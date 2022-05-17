<script setup>
import HistoryEditInput from "./history-edit-input";

import get from "lodash/get";
import { ref, computed, nextTick, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const editorVisible = computed(() => store.state.context.recordEditorVisible);
const setEditorVisible = (visible) =>
  store.commit("SET_CONTEXT", {
    recordEditorVisible: visible,
  });

const recordEditorItem = computed(() =>
  get(store, "state.context.recordEditorItem")
);
const inputList = computed(
  () => get(store, "state.context.recordEditorItem.besttext") || []
);
const inputPlaceholder = computed(() => ({ text: "" }));

const elMain = ref();
const scrollElMain = async () => {
  if (!elMain.value) return;
  await nextTick();
  elMain.value.scrollTop = 99999;
};
watch(inputList, scrollElMain);
</script>

<template lang="pug">
div.chat-item_edit.d-flex.flex-column(
  v-if="editorVisible && recordEditorItem"
)
  div.chat-item_edit-header.d-flex.justify-space-between.align-center.overflow-hidden.flex-shrink-0.flex-grow-0
    el-button.only-icon(
      icon="el-icon-close"
      @click.stop="setEditorVisible(false)"
    )
    h3 {{ inputList.length ? $t('nft.chat.reply.edit') : $t('nft.chat.reply.add') }}

  div.chat-item_edit-main.flex-shrink-1.flex-grow-0(ref="elMain")
    div.chat-item_edit-content {{ recordEditorItem.text }}

    HistoryEditInput(
      v-for="inputItem in inputList"
      :inputItem="inputItem"
      :recordId="recordEditorItem.id"
      :key="inputItem.text_id"
    )

    HistoryEditInput(
      :inputItem="inputPlaceholder"
      :recordId="recordEditorItem.id"
      :key="`new-reply-${recordEditorItem.id}`"
    )
</template>

<style lang="stylus">
.chat-item_edit
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background-color #34383d
  border-radius 20px 0px 0px 20px
  overflow hidden

  &-header
    padding 15px 25px
    height 80px
    font-size 24px
    color #fff
    white-space nowrap
    border-bottom 1px solid #464a50
    h3
      font-size 16px
      font-weight 600
    span
      margin 0 50px
      flex 1

  &-main
    padding 35px 0
    width 100%
    margin-right 2px
    overflow-y auto
    &::-webkit-scrollbar
      width 2px
      background #fff
    &::-webkit-scrollbar-thumb
      width 2px
      background #dfe4ef
      border-radius 2px
    &::-webkit-scrollbar-button,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner,
    &::-webkit-resizer
      display none

  &-content
    margin 0 20px 25px
    padding 13px 15px
    font-size 14px
    font-weight 600
    line-height 20px
    user-select text
    background #dcdfee
    color #35466d
    max-width 80%
    border-radius 15px

@media $mediaInMobile
  .chat-item_edit
    width 96vw !important

    &-main
      max-height 240px
</style>
