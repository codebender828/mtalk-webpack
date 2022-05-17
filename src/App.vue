<script>
import { useWallet } from "solana-wallets-vue";
import { defineComponent, watchEffect } from "vue";

export default defineComponent({
  name: "App",
  created() {
    const className = `lang-${this.$i18n.locale}`;
    document.body.classList.add(className);
  },
  setup() {
    const wallet = useWallet();
    watchEffect(() => {
      console.log("wallet", wallet);
    });
  },
});
</script>

<template lang="pug">
router-view
</template>

<style lang="stylus"></style>
