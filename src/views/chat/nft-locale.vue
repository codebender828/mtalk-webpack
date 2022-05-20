<script>
import { toRef, defineEmits, defineComponent } from "vue";

const props = {
  loading: Boolean,
};

export default defineComponent({
  props,
  setup(props) {
    const emit = defineEmits(["setLanguage"]);
    const propLoading = toRef(props, "loading");
    const handleClick = (lang) => emit("setLanguage", lang);

    return {
      propLoading,
      handleClick,
    };
  },
});
</script>

<template lang="pug">
div.nft-locale.d-flex.flex-column.justify-center.align-center
  logo
  div.nft-locale_title Please select your preferred session language.<br>The language can only be selected ONCE!
  div.nft-locale_loading(
    v-if="propLoading"
    v-loading="true"
  )
  div.d-flex.justify-space-between.align-center(
    v-else
  )
    button.nft-locale_button(
      @click.stop="handleClick('cn')"
    ) 中文
    button.nft-locale_button(
      @click.stop="handleClick('en')"
    ) English
</template>

<style lang="stylus">
.nft-locale
  width 100%
  height 100%
  position fixed
  top 0
  left 0
  z-index 999999
  background url('../../assets/backgrounds/nft-locale-bg.png') center center no-repeat
  background-size cover

  .logo-mirror
    width 260px
    height 100px

  &_title
    margin 50px 0
    font-size 18px
    line-height 25px
    font-weight 700
    text-align center

  &_button
    margin 0 48px
    width 108px
    height 64px
    border 2px solid #dcff1c
    border-radius 10px
    background none
    color #dcff1c
    font-size 18px
    font-weight 700
    cursor pointer

    &:hover
      background #dcff1c
      color #000

  &_loading
    width 100px
    height 64px
</style>
