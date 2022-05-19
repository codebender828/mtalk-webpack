<script lang="js" setup>
import { toRef, computed, defineProps } from "vue";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  confirmTitle: {
    type: String,
    default: "",
  },
  iconType: {
    type: String,
    required: true,
  }, // add | delete
});
const propDisabled = toRef(props, "disabled");
const propConfirmTitle = toRef(props, "confirmTitle");
const propIconType = toRef(props, "iconType");
const iconName = computed(() => {
  return (
    {
      add: "el-icon-plus",
      delete: "el-icon-close",
    }[propIconType.value] || ""
  );
});

const needConfirm = computed(() => {
  return propConfirmTitle.value && propIconType.value === "delete";
});
const emit = defineEmits(["click"]);
const emitClick = () => emit("click");
</script>

<template lang="pug">
el-popconfirm(
  v-if="needConfirm && !propDisabled"
  :title="propConfirmTitle"
  :confirmButtonText="$t('button.confirm')"
  :cancelButtonText="$t('button.cancel')"
  hideIcon
  popper-class="rct-edit-button-popper"
  @confirm="emitClick"
)
  template(#reference)
    el-button.only-icon.rct-edit-button(
      :disabled="propDisabled"
      :icon="iconName"
      type="primary"
    )

el-button.only-icon.rct-edit-button(
  v-else
  :disabled="propDisabled"
  :icon="iconName"
  type="primary"
  @click.stop="emitClick"
)
</template>

<style lang="stylus">
.rct-edit-button
  margin-left 12px !important

.rct-edit-button-popper
  &.el-popper
    padding 0 !important
    border none !important

  &.el-popper,
  .el-popper__arrow::before
    background #dcdfee !important

  .el-popconfirm__main,
  .el-popconfirm__action
    padding 12px 15px !important

  .el-popconfirm__action
    border-top 1px solid #ececec
    display flex
    align-items center
    justify-content space-around

  .el-popconfirm__main,
  .el-button
    font-size 12px
    color #35466d

  .el-button
    padding 0 10px !important
    height 24px !important
    padding 3px 10px 4px !important
    border-radius 2px !important
    border 1px solid #35466d !important
    box-shadow none !important
</style>
