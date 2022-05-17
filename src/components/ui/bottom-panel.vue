<template lang="pug">
el-drawer(
  v-model="modelValue"
  ref="root"
  @closed="handleDrawerClosed"
  :title="title"
  :custom-class="'bottom-panel ' + customClass"
  size="80%"
  direction="btt"
)
  slot
</template>

<script>
export default {
  name: "bottom-panel",

  props: {
    title: String,
    customClass: String,
    modelValue: Boolean,
  },

  data() {
    return {
      root: null,
    };
  },

  methods: {
    handleDrawerClosed() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>

<style lang="stylus">
.el-drawer.bottom-panel
  background-color: #323432

  .el-drawer__header
    text-align: center
    z-index: 2
    font-size: 17px
    line-height: 24px
    color: $primary-green
    background-color: #323432
    margin-bottom: 0
    padding: 0 18px
    height: 60px
    box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.3)
    text-semi-bold()

  .el-drawer__body
    padding: 18px 25px
    overflow-y: auto
    -webkit-overflow-scrolling: touch
</style>
