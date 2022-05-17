<script setup>
import { ElMessage } from "element-plus";

import { ref, toRef, computed, watch, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

import iconEditDefault from "@/assets/icons/icon-edit-default.svg";
import iconEditActived from "@/assets/icons/icon-edit-actived.svg";
import iconLikeDefault from "@/assets/icons/icon-like-default.svg";
import iconLikeActived from "@/assets/icons/icon-like-actived.svg";

const { t } = useI18n();
const store = useStore();
const props = defineProps({
  item: Object,
  mode: {
    type: String,
    default: "outer",
  },
});

const localVoteType = ref(0); // 0: 默认 1:点赞 2.踩
const handleVoteIsPending = ref(false);
const handleVote = async (voteType) => {
  if (handleVoteIsPending.value) return;
  handleVoteIsPending.value = true;
  const lastValue = localVoteType.value;
  const nextValue = lastValue === voteType ? 0 : voteType;
  try {
    localVoteType.value = nextValue;
    await store.dispatch("likeChatRecordItem", {
      msg_id: props.item.id,
      evaluate: nextValue,
    });
    handleVoteIsPending.value = false;
    ElMessage.success(t("nft.chat.submit.success"));
  } catch (error) {
    localVoteType.value = lastValue;
    handleVoteIsPending.value = false;
    ElMessage.error(error.message);
  }
};

const propItem = toRef(props, "item");
const messageCount = computed(
  () => (propItem.value.besttext && propItem.value.besttext.length) || 0
);
onBeforeMount(() => {
  localVoteType.value = propItem.value.evaluate || 0;
});
watch(
  propItem,
  (newValue) => {
    localVoteType.value = newValue.evaluate || 0;
  },
  { deep: true }
);

const showEditModal = () =>
  store.commit("SET_CONTEXT", {
    recordEditorItem: propItem.value,
    recordEditorVisible: true,
  });

const hasActionData = computed(() => {
  return messageCount.value > 0 || localVoteType.value > 0;
});

const buttons = computed(() => {
  return [
    {
      icon: iconEditDefault,
      iconActived: iconEditActived,
      badge: messageCount.value > 9 ? "9+" : messageCount.value,
      tooltipText: messageCount.value
        ? t("nft.chat.reply.edit")
        : t("nft.chat.reply.add"),
      isActived: !!messageCount.value,
      action: showEditModal,
    },
    {
      isHidden: localVoteType.value === 2,
      icon: iconLikeDefault,
      iconActived: iconLikeActived,
      // tooltipText: localVoteType.value === 1 ? t('nft.chat.like.cancel') : t('nft.chat.like'),
      isActived: localVoteType.value === 1,
      action: () => handleVote(1),
    }, // 喜欢
    {
      isHidden: localVoteType.value === 1,
      icon: iconLikeDefault,
      iconActived: iconLikeActived,
      isReverse: true,
      // tooltipText: localVoteType.value === 2 ? t('nft.chat.dislike.cancel') : t('nft.chat.dislike'),
      isActived: localVoteType.value === 2,
      action: () => handleVote(2),
    }, // 不喜欢
  ].filter((button) => {
    if (props.mode === "outer") {
      return !button.isActived && !button.isHidden;
    } else {
      return button.isActived;
    }
  });
});
const clickButton = (action) => typeof action === "function" && action();

const computedClasses = computed(() => {
  return {
    "chat-item_action-outer": props.mode === "outer",
    "chat-item_action-inner": props.mode === "inner",
  };
});
</script>

<template lang="pug">
div.chat-item_action.d-flex(
  v-if="buttons.length"
  :class="computedClasses"
)
  div.chat-item_action-item(
    v-for="button in buttons"
    @click.stop="clickButton(button.action)"
    :class="{ 'chat-item_action-actived': button.isActived }"
  )
    el-tooltip(
      popper-class="chat-item_action-tooltip"
      :disabled="!button.tooltipText"
      :content="button.tooltipText"
      placement="top"
      effect="dark"
      transition="none"
    )
      div.chat-item_action-item-inner.d-flex.justify-center.align-center
        img.chat-item_action-icon(
          :class="{ 'chat-item_action-reverse': button.isReverse }"
          :src="button.icon"
        )
        img.chat-item_action-primary(
          :class="{ 'chat-item_action-reverse': button.isReverse }"
          :src="button.iconActived"
        )
        span.chat-item_action-text(v-if="button.text") {{ button.text }}
        el-badge(v-if="button.badge" :value="button.badge")
</template>

<style lang="stylus">
.chat-item
  &_action-outer
    opacity 0
  &:hover &_action-outer
    opacity 1

.chat-item_action
  -webkit-perspective: 1000
  height 27px
  border-radius 20px
  transition opacity .2s ease-in

  &&-outer
    max-width 100px
    background-color #dcdfee
    cursor pointer
    .chat-item_action-item
      width 50px

  &&-inner
    margin-top 10px

    .chat-item_action-item
      padding 0 10px
      background #cacee3
      border-radius 20px
      cursor pointer
    .chat-item_action-item + .chat-item_action-item
      margin-left 8px

  &-icon,
  &-primary
    display block
    width 14px
    height 14px

  &-primary
    display none

  &-reverse
    transform-origin center
    transform rotateX(180deg)

  &-text
    margin-left 5px

  &-item
    &:hover
      .chat-item_action-icon,
      .chat-item_action-primary
        opacity .3

    &.chat-item_action-actived
      color #386eec
      .chat-item_action-icon
        display none
      .chat-item_action-primary
        display block

    .el-badge
      line-height 1
      transform scale(.6, .6)
      transform-origin center
    .el-badge__content--primary
      border none
      background-color #35466d
      color #fff

  &-item-inner
    height 28px
    position relative
    color #35466d
    font-size 12px

  &-tooltip
    &, .el-popper__arrow::before
      background-color #8f95b3 !important
</style>
