<script>
import MetaBeingCard from "./meta-being-card";

export default {
  components: {
    MetaBeingCard,
  },

  props: {
    nft: Object,
  },

  data() {
    return {
      // @values: dialog, fullscreen
      view: "dialog",
      modalVisible: false,
      isShowMoreInfo: false,
    };
  },

  methods: {
    async switchModalVisible(value, view) {
      if (view) {
        this.view = view;
      }
      this.modalVisible = !!value;
    },

    handleSwitchNft() {
      this.modalVisible = false;
      this.$router.push(`/nfts/${this.nft.id}`);
    },
  },
};
</script>

<template lang="pug">
el-dialog(
  v-model="modalVisible"
  :custom-class="'nft-modal view-' + view"
  :close-on-click-modal="false"
  @opened="() => $analytics.screen('story_modal')"
  width="100%"
  :modal="view === 'dialog'"
  append-to-body
)
  .desktop-view.d-none.d-sm-block
    div.d-flex
      div.nft-modal_left.d-flex.flex-column.align-center.flex-shrink-0.flex-grow-0
        img.nft-modal_avatar(:src="nft.images.portrait")

      div.nft-modal_card.d-flex.flex-column.flex-shrink-1.flex-grow-1
        MetaBeingCard(
          isShowDesc
          isShowStory
          :isShowMeta="false"
          :isShowHero="false"
          :nft="nft"
        )

  .mobile-view.d-flex.d-sm-none.flex-column
    .d-flex.flex-column.align-center
      .spacer.col.pt-8.flex-shrink-0
      img.nft-modal_avatar.mb-4(
        :src="nft.images.portrait"
      )
      meta-being-card(
        isShowDesc
        isShowStory
        :isShowHero="false"
        :isShowMeta="false"
        :nft="nft"
      )

      .fixed-panel.d-flex.justify-center.align-center
        el-button.nft-modal_chat(
          type="primary"
          @click.stop="handleSwitchNft"
        ) {{ $t('nft.chat.with') }}

  bottom-panel(
    v-model="isShowMoreInfo"
    :title="$t('nft.intro')"
  )
    meta-being-card(
      isShowDesc
      :nft="nft"
    )
</template>

<style lang="stylus">
.nft-modal
  max-width: 1060px

  &.el-dialog
    background #fff

  .el-dialog__body
    padding 80px 80px 60px 30px

  &_left
    width 36.8%
    margin-bottom: 20px

  &_avatar
    display block
    width 100%
    height auto

  &_chat.el-button
    margin-top 25px
    padding-left 35px
    padding-right 35px

  &_card
    margin-left 24px

    .meta-card
      width 48%
      height 78px

    .story-card
      flex-grow: 1

    .desc-card
      .el-card__body
        min-height: 0 !important

  &_prev.el-button,
  &_next.el-button
    padding 2px 0 8px
    width 46px
    position absolute
    top 50%
    transform translateY(-50%)

  &_prev
    left -130px

  &_next
    right -130px

  .index-indicators
    height: 20px

    .dot
      width: 8px
      height: 8px
      background-color: $secondary-gray
      border-radius: 50%

      & + .dot
        margin-left: 10px

      &.is-current
        background-color: $primary-red

  &.view-dialog
    width: 80% !important

  &.view-fullscreen
    margin: 0 !important
    height: 100%
    border-radius: 0
    background-color: $primary-gray
    padding: 25px 20px

    .el-dialog__headerbtn
      top: 34px
      right: 33px

    .el-dialog__body
      background-color: $v-secondary-color
      border-radius: 8px
      padding: 0 20px 10px
      margin-bottom: 90px
      max-height: s('calc(100vh - 130px)')
      overflow-y: auto

    .nft-modal_avatar
      width: 200px
      height: 200px

    .action-bar
      width: 100%

      .el-button + .el-button
        margin-left: 20px

    .fixed-panel
      position: absolute
      width: 100%
      box-shadow: 0px -0.5px 0px rgba(0, 0, 0, 0.3)
      background: #F5F5F5
      min-height: 89px
      bottom: 0
      padding: 12px
      padding-bottom: calc(env(safe-area-inset-bottom) + 12px)

      .nft-modal_chat
        margin-top: 0
</style>
