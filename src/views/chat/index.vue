<script>
import { defineComponent } from "vue";
import MetaBeingCard from "./meta-being-card";
import HistoryList from "./history-list";
import NftMain from "./nft-main";
import NftModal from "./nft-modal";
import NftLocale from "./nft-locale";
import { WalletMultiButton, useAnchorWallet } from "solana-wallets-vue";

import get from "lodash/get";
import Cookies from "js-cookie";
import { mapActions } from "vuex";
import { userAPI, nftAPI } from "~/services/apis";
import { localNftList } from "~/utils/mergeChatData";
import { useMirror } from "~/composables/use-mirror";

export default defineComponent({
  components: {
    MetaBeingCard,
    HistoryList,
    NftMain,
    NftModal,
    NftLocale,
    WalletMultiButton,
  },
  setup(_) {
    const {
      isNetworkSafe,
      currentNetworkName,
      contractNetwork,
      onAccountChanged,
    } = useMirror();

    onAccountChanged(async () => {
      await userAPI.logout();
      location.reload();
    });

    return {
      isNetworkSafe,
      contractNetwork,
      currentNetworkName,
    };
  },

  data() {
    return {
      isLoading: true,
      isSetLocaleLoading: false,
      isExpandSwitchLocale: false,
      isShowMobileSidebar: false,
      isShowHistoryListDialog: false,
      isShowMetaBeingIntroDialog: false,
    };
  },

  computed: {
    nftId() {
      return this.$route.params.id || localNftList[0].id;
    },

    nft() {
      return get(this.$store.state, "context.chatInfo");
    },

    switchLocaleButtonText() {
      return this.$i18n.locale === "cn" ? "中文" : "ENG";
    },
  },

  watch: {
    nftId() {
      this.loadData();
    },
  },

  beforeMount() {
    this.loadData();
  },

  methods: {
    ...mapActions(["getSingleChatInfo"]),

    setLocale(target) {
      const lang = target || "en";
      this.$i18n.locale = lang;
      Cookies.set("locale", lang);
    },

    async handleSetLocale(target) {
      if (this.isSetLocaleLoading || this.isLoading) return;

      try {
        this.isSetLocaleLoading = true;
        await nftAPI.setLanguage({
          bot_id: this.nft.id,
          language: (target || "en").toUpperCase(),
        });
        // this.setLocale(target)
        this.isSetLocaleLoading = false;
        this.loadData();
      } catch (error) {
        this.isSetLocaleLoading = false;
        this.loadData();
        this.$message.error(this.$t("network.error"));
      }
    },

    async loadData() {
      try {
        this.isLoading = true;

        // 设置当前的 id 和 info
        await this.getSingleChatInfo(this.nftId);
        this.setLocale(this.nft.language);
        await this.$nextTick();

        const nftMain = this.$refs.nftMain;
        if (nftMain && nftMain.addNftMessages) {
          const { locale, messages } = this.$i18n;
          const messageList = messages[locale]["nft.welcome.messages"];
          const messageId = Math.round(
            Math.random() * (messageList.length - 1)
          );
          const message = messageList[messageId];
          message && nftMain.addNftMessages([{ content: message }]);
        }
      } catch (error) {
        console.error(error);
        this.$message.error(this.$t("network.error"));
      } finally {
        this.isLoading = false;
      }
    },

    // async handleLogoutClick () {
    //   await userAPI.logout()
    //   this.$router.replace('/')
    // },

    handleLogoClick() {
      // window.open('https://rct.ai?utm_source=socrates&utm_medium=logo', '_blank')
      // this.$analytics.event('brand_show_click')
    },

    handleShowNftModal(view) {
      const nftModal = this.$refs.nftModal;
      if (nftModal && nftModal.switchModalVisible) {
        nftModal.switchModalVisible(true, view);
      }
    },
  },
});
</script>

<template lang="pug">
.page-nft.d-flex.flex-column(
  v-loading="isLoading"
)
  //- .net-banner(
  //-     role="alert"
  //-     v-show="!isNetworkSafe"
  //-   )  You are currently connected to {{ currentNetworkName }}. MirrorWorld is only available on Ethereum "{{ contractNetwork }}" network.

  //- Only 桌面版显示
  .desktop-view.d-none.d-sm-inline-block
    .layout-header-wrapper.d-flex.justify-space-between.align-center
      logo(
        @click.native="handleLogoClick"
      )
      .right-part.d-flex.align-center
        //- el-dropdown.mr-3(
        //-   trigger="click"
        //- )
        //-   el-button.locale-button(
        //-     @click="() => $analytics.event('locale_switch_click')"
        //-   )
        //-     .button-row
        //-       | {{ switchLocaleButtonText }}
        //-       i.el-icon-caret-bottom.flex-shrink-0.ml-2.mr-n2
        //-   template(#dropdown)
        //-     el-dropdown-menu.locale-dropdown-menu
        //-       el-dropdown-item( @click="handleSetLocale('cn')" )
        //-         span.info-text 简体中文
        //-         .img-icon.icon-locale-tick( v-if="$i18n.locale === 'cn'" )
        //-       el-dropdown-item( @click="handleSetLocale('en')" )
        //-         span.info-text ENGLISH
        //-         .img-icon.icon-locale-tick( v-if="$i18n.locale === 'en'" )

        //- el-popconfirm(
        //-   :title="$t('logout.confirmTitle')"
        //-   @confirm="handleLogoutClick"
        //-   hideIcon
        //- )
        //-   template(#reference)
        el-button.user-banner.col(
          type="primary"
        )
          .banner-row.d-flex.justify-space-between.align-center
            .left-part.d-flex.align-center.text-overflow-wrapper
              .img-icon.icon-user-astronaut.flex-shrink-0.mr-3
              .text-overflow user-{{ $guard.user.name }}
            //- i.el-icon-caret-bottom.flex-shrink-0.ml-2.mr-1
        .sns-links.d-flex.align-center
          a(
            href="https://twitter.com/joinmirrorworld"
            target="_blank"
          )
            rct-icon(
              name="twitter"
            )
          a(
            href="https://discord.gg/RH9QEfxUHg"
            target="_blank"
          )
            rct-icon(
              name="discord"
            )
          a(
            href="https://mirrorworld.medium.com"
            target="_blank"
          )
            rct-icon(
              name="medium"
            )
          wallet-multi-button(
            class="solana-button"
          )


  //- Only 手机版显示
  .mobile-view.d-flex.d-sm-none.flex-column
    .page-header.d-flex.justify-space-between.px-4.pt-5.pb-20
      el-button.only-icon( size="small" @click="() => isShowMobileSidebar = true" )
        .img-icon.icon-burger-menu
      el-button(
        v-if="false"
        type="primary"
        size="small"
        @click="() => handleShowNftModal('fullscreen')"
      )
        .button-row.d-flex.align-center.justify-center
          .img-icon.icon-switch-nft.mr-3
          | {{ $t('nft.switch') }}

    el-drawer(
      v-if="nft"
      v-model="isShowMobileSidebar"
      @opened="() => $analytics.screen('mobile_drawer_menu')"
      :withHeader="false"
      custom-class="mobile-burger-drawer"
      size="72%"
      direction="ltr"
    )
      .drawer-header.d-flex.align-center.px-4.py-5
        el-button.only-icon.mr-7.flex-shrink-0( size="small" type="primary" @click="() => isShowMobileSidebar = false" )
          .img-icon.icon-close
        .text-overflow.color-primary-blue.font-weight-medium  {{ $t('user.account.label') }}{{ $guard.user.name }}

      .drawer-menu
        .menu-item
          .color-primary-blue.font-weight-medium(
            @click="() => isShowHistoryListDialog = true"
          ) {{ $t('nft.chat.history') }}

        .menu-item.need-shadow(
          @click="() => isShowMetaBeingIntroDialog = true"
        )
          .color-primary-blue.font-weight-medium {{ $t('nft.intro') }}

        .menu-item.need-shadow.d-flex.justify-space-between.align-center.color-primary-blue(
          v-if="false"
          @click="() => isExpandSwitchLocale = !isExpandSwitchLocale"
        )
          .font-weight-medium {{ $t('locale.switch') }}
          i.el-icon-caret-bottom

        //- el-collapse-transition
        //-   .switch-locale(
        //-     v-show="isExpandSwitchLocale"
        //-   )
        //-     .pa-4
        //-       .locale-item.d-flex.justify-space-between.align-center.mb-4( @click="() => $i18n.locale = 'cn'" )
        //-         span.info-text.color-primary-blue.size-small 简体中文
        //-         .img-icon.icon-checkbox-checked( v-if="$i18n.locale === 'cn'" )
        //-         .img-icon.icon-checkbox( v-else )
        //-       .locale-item.d-flex.justify-space-between.align-center( v-if="false" @click="() => $i18n.locale = 'en'" )
        //-         span.info-text.color-primary-blue.size-small ENGLISH
        //-         .img-icon.icon-checkbox-checked( v-if="$i18n.locale === 'en'" )
        //-         .img-icon.icon-checkbox( v-else )

        .menu-item.need-shadow(
          v-if="false"
          v-show="!isExpandSwitchLocale"
        )

        .menu-item.need-shadow.action-about(
          v-if="false"
          @click="handleLogoClick"
        )
          .color-primary-blue.font-weight-medium {{ $t('about.rct') }}

        .menu-item.need-shadow.action-logout(
          v-if="false"
          @click="handleLogoutClick"
        )
          .color-primary-blue.font-weight-medium {{ $t('logout') }}

        .menu-item.need-shadow.bottom-placeholder

    bottom-panel(
      v-model="isShowMetaBeingIntroDialog"
      :title="$t('nft.intro')"
    )
      meta-being-card(
        isShowStory
        isShowDesc
        :nft="nft"
      )

    bottom-panel(
      v-model="isShowHistoryListDialog"
      custom-class="chat-bottom-panel"
      :title="$t('nft.chat.history')"
    )
      HistoryList(
        v-if="nft"
        :nftId="nftId"
        :isInDialog="isShowHistoryListDialog"
      )

  .layout-body.d-flex.flex-column.flex-sm-row.flex-grow-1
    .layout-sidebar-wrapper.d-none.d-sm-flex.flex-shrink-0
      .layout-sidebar.d-flex.flex-column(
        v-if="nft"
      )
        meta-being-card(
          :nft="nft"
          @heroClick="() => handleShowNftModal('dialog')"
        )

    //- 手机桌面都显示
    .universe-view.d-flex.flex-grow-1.justify-center
      NftMain(
        v-if="nft"
        :nft="nft"
        ref="nftMain"
      )

    .list-container.d-none.d-sm-flex.justify-end
      HistoryList(
        v-if="nft"
        :nftId="nftId"
      )

  NftModal(
    v-if="nft"
    :nft="nft"
    ref="nftModal"
  )

  NftLocale(
    v-if="nft && !nft.language && nft.nft_type === 1"
    :loading="isSetLocaleLoading"
    @setLanguage="handleSetLocale"
  )
</template>

<style lang="stylus">
.page-nft
  width 100vw
  height 100vh
  overflow-y: hidden

  // Universe
  .only-icon
    width: 46px
    height: 46px
    padding: 0
    font-size: 20px

    &.el-button--small
      // border-radius: 12px
      font-size: 14px
      width: 36px
      height: 36px
      padding: 6px 0 5px

  .scroll-card
    &::-webkit-scrollbar
      width 7px
      background rgba(255, 255, 255, 0)

    &::-webkit-scrollbar-thumb
      width 7px
      background #7E7E7E
      border-radius 5px

    &::-webkit-scrollbar-button,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner,
    &::-webkit-resizer
      display none

  // Desktop
  .layout-header-wrapper
    width: 100vw
    min-width: 1280px
    padding: 0 30px
    height: 80px
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
    margin-bottom: 25px

    .el-icon-caret-bottom
      font-size: 14px

    .sns-links
      margin-left: 35px

      a
        transition: 218ms

        &:hover
          opacity: 0.8

          .rct-icon
            // --circle-fill: #eee

        & + a
          margin-left: 15px

      .rct-icon
        font-size: 30px

    .user-banner
      min-width: 150px
      height: 46px
      padding-left: 20px
      padding-right: 20px
      font-weight: 500
      border-color: #fff !important
      border-radius: 15px
      transform: skew(15deg)

      .banner-row
        transform: skew(-15deg)

      .icon-avatar
        width: 25px
        height: 25px

    .logo-widget
      cursor: pointer
      margin-left: 4px

    .logo-mirror
      width: 192px
      height: 48px

  .sidebar-padding
    padding-right 16px

  .layout-body
    min-height: 0
    @media $mediaInDesktop
      min-width: 1280px

  .layout-sidebar
    min-width 275px
    width 20vw
    height s('calc(100vh - 95px)')

    /.lang-en&
      min-width: 290px

    .el-icon-caret-bottom
      font-size: 12px

    .sidebar-row
      margin-bottom: 24px

    .scrollable-gutter
      height: 42px

    &-wrapper
      padding: 0 32px 42px

  .list-container
    min-width: s('max(calc(25vw + 95px), 400px)')

  // Mobile
  .mobile-burger-drawer
    background-color: #2c312d

    .drawer-header
      background-color: #3a3d3a

    .menu-item
      height: 60px
      padding: 20px
      cursor: pointer

      &.need-shadow
        box-shadow: 0px -0.5px 0px rgba(255, 255, 255, 0.3)

      &.bottom-placeholder
        width: 100%
        position: absolute
        bottom: 0

      &.action-about,
      &.action-logout
        width: 100%
        position: absolute
        bottom: 60px

      &.action-about
        // bottom: 120px
// Popups
.chat-bottom-panel
  background-color #323432 !important

  .el-drawer__body
    padding: 0 !important

.locale-button
  &, &:active
    transform: skew(15deg) !important
  .button-row
    transform: skew(-15deg)

.locale-dropdown-menu
  .info-text
    display: inline-block
    min-width: 72px
    color: #35466d

.net-banner
  position: relative;
  width: 100vw;
  display: flex;
  padding: 12px 0;
  justify-content: center;
  background-color: #f4d134;
  font-size: 1.2em;
  color: black;
  z-index: 10;


.swv-button
  margin-left: 15px;

  &.swv-button-trigger
    background-color: #DCFF1C;
    font-family: var(--font-base);
    color: #35466d;
    font-weight: 500;

.swv-button
  &:not([disabled]):hover
    background-color: #a4bf12 !important;
  &:not([disabled]):active
    background-color: #a4bf12 !important;
</style>
