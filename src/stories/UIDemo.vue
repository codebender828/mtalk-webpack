<script>
export default {
  data: () => ({
    text: "",
    dialogVisible: false,
  }),
};
</script>

<template lang="pug">
div.demo-wrapper
  el-row
    el-button 默认按钮
    el-button(type="primary") 主要按钮
    el-button(type="danger") 危险按钮

  el-row
    el-button(type="primary") 大加粗
    el-button(type="primary" size="medium") 大不加粗
    el-button(type="primary" size="small") 小加粗
    el-button(type="primary" size="mini") 小不加粗

  el-row
    el-button(disabled) 禁用按钮
    el-button(type="primary" disabled) 禁用按钮
    el-button(type="danger" disabled) 禁用按钮

  el-row
    el-button(round) 默认圆形按钮
    el-button(type="primary" round) 主要圆形按钮
    el-button(type="danger" round) 危险圆形按钮

  el-row
    el-button(round disabled) 圆形禁用按钮
    el-button(type="primary" round disabled) 圆形禁用按钮
    el-button(type="danger" round disabled) 圆形禁用按钮

  el-row
    el-input(v-model="text" placeholder="请输入内容")

  el-row
    el-input(v-model="text" placeholder="无法输入内容" disabled)

  el-row
    el-input(v-model="text" placeholder="请输入密码" show-password)

  el-row
    el-button(@click="dialogVisible = true") 打开 Toast
    el-dialog(
      v-model="dialogVisible"
      width="435px"
      append-to-body
    )
      span 这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容

  el-row
    el-popconfirm(
      title="这里是标题"
      hideIcon
    )
      template(#reference)
        el-button 打开 PopConfirm
</template>

<style lang="stylus" scoped>
.demo-wrapper
  padding 100px

  .el-row
    margin 20px 0

  .dialog-footer
    display flex
</style>
