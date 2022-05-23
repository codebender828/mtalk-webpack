<script lang="js">
import { ElMessage } from 'element-plus'
import get from 'lodash/get'

import { BigNumber } from 'ethers';
import { useMirror } from '@/composables/use-mirror'
import { useSouls } from '@/composables/use-souls'
import { getBotSolanaNFT, isSolanaAddress } from '@/composables/use-solana-upgrade'
import { ref, toRef, computed, nextTick, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useSolanaUpgrade } from '~/composables/use-solana-upgrade';

const props = {
	exp: {
		type: Number,
		required: true
	},
	maxExp: {
		type: Number,
		required: true
	}
}

export default defineComponent({
	props,
	setup(props) {
		const store = useStore()
		const propExp = toRef(props, 'exp')
		const propMaxExp = toRef(props, 'maxExp')
		const percentNumber = computed(() => {
			return Math.floor(propExp.value / propMaxExp.value * 100)
		})


		// 需要严格与 assets/icons/icon-upgrade 图片对应
		const percentSteps = [ 100, 90, 80, 65, 50, 35, 20, 0 ]
		const stepIconName = computed(() => {
			const stepIndex = percentSteps.findIndex((step) => {
				return percentNumber.value >= step
			})
			return `upgrade-${percentSteps[stepIndex]}`
		})

		const { mirror, onChainChanged } = useMirror()
		const { souls } = useSouls()
		const { signLevelUpTransaction } = useSolanaUpgrade()

		onChainChanged((newChainId) => {
			console.log('chain changed =>', newChainId)
		})

		const upgradeSuccessVisible = ref(false)
		const handleUpgradePending = ref(false)
		const handleUpgradeEnabled = computed(() => {
			// return true
			return !handleUpgradePending.value && percentNumber.value >= 100
		})

		const handleUpgrade = async () => {
			if (!handleUpgradeEnabled.value) return
			handleUpgradePending.value = true

			console.log("state", store.state)
			const { data: { data: solanaBot }} = await getBotSolanaNFT({
				bot_id: store.state.context.botId
			})

			const isSolanaBot = !!solanaBot && isSolanaAddress(solanaBot.nft.mint_address)

			if (isSolanaBot) {
				// Solana
				try {
					const new_level = store.state.context.chatInfo.stats.levelValue + 1
					console.debug("Upgrading solana NFT to new level: ", new_level)
					const { data: response } = await store.dispatch('requestSolanaBotUpgrade', {
						mint_address: solanaBot.nft.mint_address,
						new_level: !isNaN(new_level) ? new_level : null
					})

					const transaction = response.data.transaction
					if (!transaction) {
						throw new Error("Could not create upgrade transaction. Please try again.")
					}

					const { result, signature } = await signLevelUpTransaction(transaction)

					// 4. Refresh bot context state
					console.debug("Upgrade successful. Refreshing bot state ...", result, signature)

					await store.dispatch('verifyUpgrade', {
						bot_id: store.state.context.botId,
						level: new_level
					})

					// 4. Refresh bot context state
					await store.dispatch('getSingleChatInfo', get(store.state, 'context.botId'))
					await nextTick()
					upgradeSuccessVisible.value = true
				} catch (error) {
					console.error("solana upgrade failed", error)
					const message = error?.response?.data?.errors?.[0]?.msg
					if (message) {
						ElMessage.error(error.message)
					}
				} finally {
					handleUpgradePending.value = false
				}
			} else {
				// Ethereum
				try {
					// 1. Request upgrade signature from API server
					const payload = await store.dispatch('signUpgrade', {
						bot_id: store.state.context.botId
					})

					const { signature, level, bot_id } = payload
					console.log({ signature, level, token_id: bot_id })
					let upgradeTransaction

					// 2. Invoke level up from SDK
					// nft_type of 0 is a mirror. 1 is a soul
					if (store.state.context.chatInfo.nft_type) {
						upgradeTransaction = await souls.value.levelUp(
							signature,
							bot_id
						)
					} else {
						upgradeTransaction = await mirror.levelUp(
							BigNumber.from(bot_id),
							BigNumber.from(level),
							signature
						)
					}

					console.log('upgrade successful', upgradeTransaction)

					// 3. Check API to verify level up
					// @see https://smlhic47en.feishu.cn/docs/doccnDor2WJ9mjrvwSTYtD6U34b#jnFOuV
					await store.dispatch('verifyUpgrade', {
						bot_id: store.state.context.botId,
						level
					})

					// 4. Refresh bot context state
					await store.dispatch('getSingleChatInfo', get(store.state, 'context.botId'))
					await nextTick()

					upgradeSuccessVisible.value = true
					handleUpgradePending.value = false
				} catch (error) {
					handleUpgradePending.value = false
					ElMessage.error(error.message)
					console.error(error)
				}
			}
		}

		const currentLevel = computed(() => {
			return get(store.state, 'context.chatInfo.stats.level')
		})
		const currentLevelValue = computed(() => {
			return get(store.state, 'context.chatInfo.stats.levelValue')
		})

		return {
			currentLevel,
			currentLevelValue,
			handleUpgrade,
			percentNumber,
			maxExp: props.maxExp,
			exp: props.exp,
			handleUpgradeEnabled,
			handleUpgradePending,
			upgradeSuccessVisible,
			stepIconName,
		}
	}
})
</script>

<template lang="pug">
div.upgrade-bar.d-flex.align-center
	div.upgrade-bar_outer
		div.upgrade-bar_inner(
			:style="{ width: `${percentNumber}%` }"
		)

	div.upgrade-bar_text.d-flex.align-center(
		v-if="maxExp"
	) {{ exp }} / {{ maxExp }}

	el-tooltip(
		placement="top"
		model-value
		:content="$t('nft.upgrade.click')"
		:disabled="!handleUpgradeEnabled"
	)
		div.upgrade-bar_button(
			v-loading="handleUpgradePending"
			:class="{ 'upgrade-bar_full': handleUpgradeEnabled }"
			@click.stop="handleUpgrade"
		)
			rct-icon(:name="stepIconName")

	el-dialog(
		v-model="upgradeSuccessVisible"
		custom-class="upgrade-bar_success"
		width="300px"
		append-to-body
	)
		div.upgrade-bar_success-top
			rct-icon(
				name="upgrade-100"
				:size="166"
			)
		div.upgrade-bar_success-title Level Up!
		div.upgrade-bar_success-level Lv{{ currentLevelValue }}
		rct-icon.upgrade-bar_success-logo(
			name="logo-mirror-squire"
			:size="40"
		)
</template>

<style lang="stylus">
.upgrade-bar
	padding 0 3px
	width 100%
	height 46px
	border 4px solid #35466d
	border-radius 24px
	position relative

	&_outer
		width 100%
		height 32px
		border-radius 24px
		overflow hidden

	&_inner
		height 32px
		background #dcff1c url("../../assets/backgrounds/bg-upgrade-bar.svg") 0 0 repeat-x
		background-size 24px 32px

	&_text
		padding 0 15px
		font-weight 600
		font-size 14px
		color #dcff1c
		position absolute
		height 38px
		bottom -38px
		left 0

	&_button
		position absolute
		top -4px
		right -4px
		width 46px
		height 46px
		.rct-icon
			font-size 46px
		.el-loading-mask
			border-radius 50%

	&_full
		cursor pointer

	&_success
		&.el-dialog
			background linear-gradient(200deg, #4d51be 5%, #0a1438 88%)
			border 5px solid #dcff1c
			border-radius 30px
		.el-dialog__header
			display none
		.el-dialog__body
			height 340px
			padding 0
			display flex
			flex-direction column
			align-items center
			justify-content flex-end

		&-top
			position relative
			top -30px
			border-radius 50%
			border 5px solid #dcff1c

		&-title
			font-size 36px
			line-height 44px
			font-weight 600

		&-level
			font-size 72px
			line-height 89px
			font-weight 600

		&-logo
			margin 10px 0 25px
</style>
