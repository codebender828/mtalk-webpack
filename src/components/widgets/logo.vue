<template lang="pug">
.logo-widget.d-flex.align-center
  .cover.brand-logo.logo-mirror
  i.union-symbol.el-icon-close( v-if="union" )
  .cover.brand-logo( :class="[ 'logo-' + union ]" )
</template>

<script>
export default {
  name: "logo",

  props: {
    union: String,
  },
};
</script>

<style lang="stylus">
.logo-widget

  .union-symbol
    min-width: 14px

  // 尺寸在使用时指定
  .brand-logo
    background-size: contain

    &.logo-rct
      background-image: url(logo/rctAIlogo_whitebg.svg)

    &.logo-mirror
      background-image: url(https://d39gv0w0je0u4w.cloudfront.net/ui/v1_0_0/mirror_world_logo_withtext.svg)

    &.logo-icarusart
      background-image: url(logo/logo-icarusart.png)
</style>
