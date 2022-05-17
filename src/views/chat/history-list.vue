<script setup>
import { analytics } from "~/services/analytics";

import HistoryItem from "./history-item";
import HistoryEditModal from "./history-edit-modal";

import { ref, toRef, computed, watch, nextTick, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({
  nftId: String,
  isInDialog: Boolean,
});

const chatList = ref();
const scrollChatList = async () => {
  if (!chatList.value) return;
  await nextTick();
  chatList.value.scrollTop = 999999;
};

const visible = ref(false);
const propNftId = toRef(props, "nftId");
const propIsInDialog = toRef(props, "isInDialog");
watch(propNftId, () => {
  switchVisible(false);
});
watch(propIsInDialog, () => {
  switchVisible(propIsInDialog.value);
});
const switchVisible = async (newValue) => {
  const nextValue = typeof newValue === "boolean" ? newValue : !visible.value;
  visible.value = nextValue;
  if (nextValue) {
    analytics.screen("chat_history_panel");
  } else {
    analytics.event("chat_history_panel_closed");
  }
  await nextTick();
  if (visible.value && chatList.value) {
    chatList.value.scrollTop = 999999;
  }
};
// Mobile 下主动展开，后续通过 watch 监听
if (propIsInDialog.value) {
  switchVisible(propIsInDialog.value);
}

const localChatRecords = computed(() => store.state.context.localChatRecords);
watch(localChatRecords, async (newValue) => {
  if (newValue && newValue.length) {
    scrollChatList();
  }
});

const loadStatus = ref(""); // loading | done | error
const loadRecords = async () => {
  if (loadStatus.value === "loading") return;
  try {
    loadStatus.value = "loading";
    await store.dispatch("getLocalChatRecords");
    loadStatus.value = "done";
  } catch (error) {
    loadStatus.value = "error";
  }
};
onMounted(async () => {
  if (localChatRecords.value.length) {
    loadStatus.value = "done";
  } else {
    await loadRecords();
  }
  scrollChatList();
});

const isRestarting = ref(false);
const handleRestartClick = async () => {
  isRestarting.value = true;
  try {
    await store.dispatch("restartConversation");
  } finally {
    isRestarting.value = false;
  }
};
</script>

<template lang="pug">
div.chat-list.flex-grow-0.flex-shrink-0.d-flex.flex-column(
  :class="{ 'chat-list_visible': visible, 'is-in-dialog': isInDialog }"
)
  div.chat-list_switch.d-flex.justify-space-between.align-center.flex-grow-0.flex-shrink-0
    .left-part.d-flex.align-start
      el-button#chat-list-switch.only-icon(
        :icon="visible ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        @click.stop="switchVisible"
      )
      el-button.ml-6.flex-shrink-0(
        v-if="visible"
        :loading="isRestarting"
        :disabled="!localChatRecords.length"
        @click.stop="handleRestartClick"
      ) {{ $t('nft.chat.restart') }}
    span.chat-list_switch-title {{ $t('nft.chat.history') }}

  div.chat-list_list.flex-grow-1.flex-shrink-1(
    v-if="visible"
    v-loading="loadStatus === 'loading'"
    element-loading-background="#34383D"
    ref="chatList"
  )
    template(v-if="loadStatus === 'done'")
      div.d-flex.flex-column(v-if="localChatRecords.length")
        HistoryItem(
          v-for="item in localChatRecords"
          :item="item"
        )
      div.chat-list_tip.d-flex.flex-column.justify-center.align-center(v-else)
        span.chat-list_tip-text {{ $t('nft.chat.history.empty') }}
      HistoryEditModal

    div.chat-list_tip.d-flex.flex-column.justify-center.align-center(
      v-else-if="loadStatus === 'error'"
    )
      span.chat-list_tip-text {{ $t('network.error') }}
      el-button(
        type="primary"
        size="small"
        @click.stop="loadRecords"
      ) Retry
</template>

<style lang="stylus">
.chat-list
  margin-left 95px
  width 250px
  position relative
  // transition width .2s ease-in

  &&_visible
    width: s('max(25vw, 300px)')

  &.is-in-dialog
    width: 100vw !important
    height: 100%
    margin-left: 0 !important

    .chat-list_list
      background-color: transparent
      border-top: none
      padding: (16px + 18px) (13px + 25px)
      min-height: 50vh
      height: 100%
      width: 100%

    .el-loading-mask
      background-color: transparent !important

    .chat-list_switch
      display: none !important

  @media $mediaInDesktop
    &.chat-list_visible
      // margin-top: -24px

      .chat-list_switch,
      .chat-list_list
        // border-radius: 0

  @media $mediaInMobile
    &.is-in-dialog .chat-list_list
      padding: 30px 16px

  &_switch
    padding 15px 25px
    width 100%
    height 80px
    background-color #34383D
    border-radius 16px 0 0 16px
    font-size 18px
    font-weight 600
    color #fff
    transition padding .2s ease-in, border-radius .2s ease-in

    &-title
      text-align right

    .el-button--danger
      padding 2px 0 8px
      width 46px

  &_visible &_switch
    padding 15px 25px
    border-radius 16px 0 0 0
    border-bottom 1px solid #464a50

  &_list
    padding 10px 25px
    width 100%
    background-color #34383D
    border-top 1px solid rgba(53, 70, 109, 0.2)
    border-radius 0 0 0 16px
    overflow-x hidden
    overflow-y auto

    &::-webkit-scrollbar
      width 7px
      background rgba(0, 0, 0, 0)

    &::-webkit-scrollbar-thumb
      width 7px
      background #7e7e7e
      border-radius 5px

    &::-webkit-scrollbar-button,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner,
    &::-webkit-resizer
      display none

  &_tip
    width 100%
    height 100%

    &-text
      margin-bottom 16px
      font-size 14px
      font-weight 500
      color rgba(#fff, 0.7)
</style>
