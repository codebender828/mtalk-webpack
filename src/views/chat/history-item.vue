<script>
import { toRef, defineComponent } from "vue";
import HistoryItemAction from "./history-item-action";

const props = {
  item: {
    type: Object,
    required: true,
  },
};

export default defineComponent({
  props,
  components: {
    HistoryItemAction,
  },
  setup(props) {
    const propItem = toRef(props, "item");
    return {
      propItem,
    };
  },
});
</script>

<template lang="pug">
.chat-item.restart-divider.d-flex.align-center(
  v-if="propItem.name === 'action_restart'"
)
  .divider-text {{ $t('nft.chat.restarted') }}
  .divider-line.flex-grow-1
div.chat-item.d-flex.align-end(
  v-else
  :class="propItem.name === 'action' ? 'chat-item_ai' : 'chat-item_user'"
)
  div.chat-item_main.d-flex.flex-column.flex-shrink-1.flex-grow-0
    div.chat-item_content
      div {{ propItem.text }}
      HistoryItemAction(
        v-if="propItem.name === 'action'"
        :item="propItem"
        mode="inner"
      )

  div.chat-item_right.d-flex.flex-shrink-0.flex-grow-0(
    v-if="propItem.name === 'action'"
  )
    HistoryItemAction(
      :item="propItem"
      mode="outer"
    )
</template>

<style lang="stylus">
.restart-divider
  line-height: 17px
  font-size: 12px
  color: #8c97b1

  .divider-line
    height: 1px
    background: #464a50
    transform: scale(1, 0.5)
    margin-left: 15px

.chat-item
  padding 10px 0
  width 100%

  &&_ai
    flex-direction row

  &&_user
    flex-direction row-reverse

  &_main
    max-width 80%
    border-radius 15px

  &_content
    padding 13px 15px
    font-size 14px
    font-weight 600
    line-height 20px
    user-select text

  &&_ai &_main
    background #dcdfee
    color #35466d

  &&_user &_main
    background #dcff1c
    color #35466d

  &_right
    margin-left 5px
    width 100px
    min-height 27px

  @media $mediaInMobile
    &&_ai &_main
      flex 0 1 95%
</style>
