<template lang="pug">
.page.page-home
  .container.is-fluid
    .d-flex.justify-center
      .login-box.d-flex.flex-column.align-center
        logo.mb-12.mb-sm-15(
        )
        .login-form.flex-column
          el-button.col(
            type="primary"
            :loading="isLoading"
            @click="handleLoginButtonClick"
          ) Enter
</template>

<script>
import { reactive } from "vue";
import { mapActions } from "vuex";
// import { userAPI } from '~/services/apis'
import { localNftList } from "~/utils/mergeChatData";

export default {
  setup() {
    return reactive({
      isLoading: false,
      isShowLicenseModal: false,
      inputAccount: "",
      inputPassword: "",
    });
  },

  computed: {
    inputCode() {
      return this.$route.query.code;
    },

    redirect() {
      return this.$route.query.redirect || `/nfts/${localNftList[0].id}`;
    },
  },

  beforeMount() {
    this.redirectWhenAuthed();
  },

  methods: {
    ...mapActions(["removeUserCookies"]),

    redirectWhenAuthed() {
      if (!this.$guard.isAuthed) {
        this.removeUserCookies();
      }

      if (this.inputCode) {
        this.$router.replace(this.redirect);
      }
    },

    handleDisagreeLicenseClick() {
      this.$analytics.event("data_auth_back");
      this.isShowLicenseModal = false;
    },

    handleAgreeLicenseClick() {
      this.$store.commit("SET_CONTEXT", {
        licenseStatus: "agreed",
      });
      this.$analytics.event("data_auth_yes");
      this.redirectWhenAuthed();
    },

    async handleLoginButtonClick() {
      if (this.isLoading) {
        return;
      }

      if (!this.inputCode) {
        this.$message.error("Bot ID is invalid.");
        return;
      }

      const nextUrl = encodeURIComponent(
        `${location.origin}/nfts/${this.inputCode}`
      );
      location.href = `${process.env.VUE_APP_OFFICIAL_URL}/auth?nextUrl=${nextUrl}`;

      // this.isLoading = true

      // try {
      //   await userAPI.login({
      //     code: this.inputCode
      //   })
      //   this.redirectWhenAuthed()
      // } catch (error) {
      //   this.$message.error(error.message || 'Enter failed, please retry later.')
      // } finally {
      //   this.isLoading = false
      // }
    },
  },
};
</script>

<style lang="stylus">
.page-home
  padding-top: 16.56vh
  padding-bottom: 16.56vh

  .logo-mirror
    width: 200px
    height: 70px

  .product-name
    font-size: 24px
    line-height: 29px
    color: $primary-blue

  .login-form
    width: 100%
    max-width: 151px
    margin-top: 108px

  @media $mediaInMobile
    padding-top: 15.6vh

    .logo-rct
      width: 113px
      height: 33px

    .product-name
      font-size: 24px
      line-height: 29px

    .login-form
      margin-top: 50px

.el-dialog.license-modal
  max-width: 600px
  background: #FFFFFF
  border-radius: 4px

  .el-dialog__body
    padding: 20px 40px 25px
    max-height: s('min(420px, 50vh)')

  .el-dialog__header
    padding-top: 30px

  .license-text
    white-space: pre-line
    font-size: 10px
    line-height: 14px
    color: rgba(0, 0, 0, 0.76)

  .gray-color
    color: #12293A

  @media $mediaInMobile
    .el-dialog__body
      padding: 20px 30px 25px

    .el-dialog__footer
      padding-left: 14px
      padding-right: 14px
</style>
