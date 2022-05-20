<script lang="js">
import { ElMessage } from "element-plus";

import { ref, toRef, computed, onBeforeMount, defineComponent } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

const props = {
  inputItem: Object,
  recordId: String,
};

export default defineComponent({
  props,
  setup(props) {
    const { t } = useI18n();
    const store = useStore();

    const propInput = toRef(props, "inputItem");
    const inputMode = computed(() => (propInput.value.text_id ? "edit" : "add"));

    const inputContent = ref("");
    const isUpdated = computed(() => {
      const propInputContent = propInput.value.text || "";
      return propInputContent !== inputContent.value;
    });
    onBeforeMount(() => {
      inputContent.value = propInput.value.text;
    });

    const isUpdatePending = ref(false);
    const updateContent = async (type) => {
      if (isUpdatePending.value) return;
      try {
        isUpdatePending.value = true;
        await store.dispatch("updateRecordReplyMessage", {
          type,
          recordId: props.recordId,
          replyMessage: {
            ...propInput.value,
            text: inputContent.value,
          },
        });
        if (inputMode.value === "add") {
          inputContent.value = "";
        }
        isUpdatePending.value = false;
        ElMessage.success(t("nft.chat.submit.success"));
      } catch (error) {
        isUpdatePending.value = false;
        ElMessage.error(error.message);
      }
    };

    const handleSubmit = () => updateContent(inputMode.value);
    const handleDelete = () => updateContent("delete");

    return {
      handleDelete,
      handleSubmit,
      isUpdated,
      isUpdatePending
    }
  }
})
</script>

<template lang="pug">
div.chat-item_edit-item.d-flex.align-center(
  v-loading="isUpdatePending"
  element-loading-background="rgba(0, 0, 0, .3)"
)
  el-input(
    v-model="inputContent"
    type="textarea"
    :placeholder="$t('nft.chat.placeholder')"
    :maxlength="200"
    :show-word-limit="inputContent.length > 180"
    :autosize="{ minRows: 1, maxRows: 3 }"
    resize="none"
  )
  edit-button(
    v-if="inputMode === 'edit' && !isUpdated"
    :confirmTitle="$t('nft.chat.delete.confirm')"
    iconType="delete"
    @click="handleDelete"
  )
  EditButton(
    v-else
    :disabled="!inputContent"
    iconType="add"
    @click="handleSubmit"
  )
</template>

<style lang="stylus">
.chat-item_edit
  &-item
    padding 10px 20px
    width 100%

    .el-textarea
      flex 1
    .el-textarea__inner
      &::-webkit-scrollbar
        width 8px
        background transparent
      &::-webkit-scrollbar-thumb
        background #a6b256
        border-radius 4px
      &::-webkit-scrollbar-button,
      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-track-piece,
      &::-webkit-scrollbar-corner,
      &::-webkit-resizer
        display none
</style>
