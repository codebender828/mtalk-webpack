<script>
export default {
  computed: {
    pathMatch() {
      return this.$route.params.pathMatch && this.$route.params.pathMatch[0];
    },
  },

  beforeMount() {
    let redirect = null;
    const code = this.pathMatch.replace(/rose/gi, "");

    if (code) {
      redirect = `/nfts/${code}`;
    }

    // if (!validRoseCode.includes(code)) {
    //   this.$router.replace({
    //     path: '/'
    //   })
    //   return
    // }

    this.$router.replace({
      path: "/",
      query: {
        code,
        redirect,
      },
    });
  },
};
</script>
