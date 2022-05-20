<template lang="pug">
.meta-being-card.d-flex.flex-shrink-0(
  v-if="isShowHero"
  :class="{ 'is-show-event-desc': isShowDescByEvent }"
)
  .meta-being-name-wrapper
    mirror-card(
      borderWidth="3px"
      borderRadius="15px"
      placement="right"
      :skewDegAbs="15"
      borderColor="#283475"
      bgColor="#dcdfee"
      shadowColor="#3546a1"
    )
      .meta-being-name.font-weight-bold.text-overflow {{ nft.name }}

  .cover.meta-being-avatar(
    :style="{ backgroundImage:'url(' + nft.images.avatar + ')' }"
  )

div.nft-upgrade-wrapper
  nft-upgrade-bar(
    :exp="nft.stats.exp"
    :maxExp="nft.stats.maxExp"
  )

.sidebar-padding.scroll-card.scrollable.no-x.is-y.flex-grow-1
  //- template( v-if="isShowDesc || isShowDescByEvent" )
  //-   el-card.desc-card.text-pre-line(
  //-     :class="{ 'is-show-top-arrow': isShowDescByEvent }"
  //-   )
  //-     .img-icon.icon-circle-dark-close( @click="isShowDescByEvent = false" )
  //-     .card-body( v-if="nft.summary_text" ) {{ nft.summary_text }}

  template( v-if="isShowStory && nft.story_text" )
    el-card.type-primary.story-card.text-pre-line
      .card-title.font-weight-semi-bold.mb-2 Story
      .card-body( v-if="nft.story_text" ) {{ nft.story_text }}

  template( v-if="isShowMeta" )
    card-item.meta-card(
      v-for="(card) in scrollCards"
      :class="{ 'event-card': card.eventName }"
      :card="card"
      :key="card.icon"
      @click.stop="handleCardItemClick(card.eventName)"
    )

    .scrollable-gutter

</template>

<script>
import NftUpgradeBar from "./nft-upgrade-bar";
import MirrorCard from "@/components/ui/mirror-card";
import CardItem from "./meta-being-card-item";

export default {
  components: {
    NftUpgradeBar,
    MirrorCard,
    CardItem,
  },

  props: {
    isShowHero: {
      type: Boolean,
      default: true,
    },
    isShowDesc: {
      type: Boolean,
      default: false,
    },
    isShowStory: {
      type: Boolean,
      default: false,
    },
    isShowMeta: {
      type: Boolean,
      default: true,
    },
    nft: {
      type: Object,
      default: {},
    },
  },

  emits: ["heroClick"],

  data() {
    return {
      isShowDescByEvent: false,
    };
  },

  computed: {
    messages() {
      return this.$store.state.context.localChatRecords;
    },

    sessionCount() {
      return this.messages.filter((item) => item.user_type === "user").length;
    },

    markCount() {
      return this.messages.filter(
        (item) =>
          item.user_type === "bot" &&
          item.evaluate !== 0 &&
          typeof item.evaluate !== "undefined"
      ).length;
    },

    replyCount() {
      let count = 0;
      this.messages.filter((item) => {
        if (item.user_type === "bot" && item.messages?.length) {
          count += item.messages.length;
        }
      });
      return count;
    },

    scrollCards() {
      const { $t, $tc, nft } = this;
      return [
        // { icon: 'icon-meta-market', title: '', content: 'Market', eventName: 'handleMarketClick' },
        {
          icon: "icon-meta-token",
          title: $t("nft.meta.token"),
          content: nft.token,
        },
        {
          icon: "icon-meta-language",
          title: $t("nft.meta.language"),
          content: $t("locale.current"),
        },
        // { icon: 'icon-meta-language', title: $t('nft.meta.language'), content: $t('locale.current'), hidden: nft.nft_type !== 1 },
        // { icon: 'icon-meta-ranking', title: $t('nft.meta.ranking'), content: nft.stats.ranking, eventName: 'handleRankingClick', hidden: nft.nft_type === 1 },
        {
          icon: "icon-meta-level",
          title: $t("nft.meta.level"),
          content: nft.stats.level,
        },
        {
          icon: "icon-meta-session",
          title: $t("nft.meta.session"),
          content: $tc("nft.meta.session.count", this.sessionCount, [
            nft.stats.sessionCount,
          ]),
        },
        {
          icon: "icon-meta-accompany",
          title: $t("nft.meta.accompany"),
          content: $tc("nft.meta.accompany.count", nft.stats.accompanyCount, [
            nft.stats.accompanyCount,
          ]),
        },
      ].filter((card) => !card.hidden);
    },
  },

  methods: {
    // handleHeroClick() {
    //   if (!this.nft.summary_text) {
    //     this.isShowDescByEvent = false
    //     return
    //   }
    //   this.isShowDescByEvent = !this.isShowDescByEvent
    // },

    handleCardItemClick(eventName = "") {
      const callback = this[eventName];
      if (typeof callback !== "function") return;
      callback();
    },

    handleMarketClick() {
      const url = `${process.env.VUE_APP_OFFICIAL_URL}/market?utm_medium=header`;
      window.open(url, "_blank");
    },

    handleRankingClick() {
      const url = `${process.env.VUE_APP_OFFICIAL_URL}/ranking`;
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="stylus">
.meta-being
  &-card
    position: relative
    width: 100%
    height: 120px
    // cursor: pointer
    margin-bottom: 30px
    transition 218ms

    // &:hover
    //   opacity: 0.8

    // &:active
    //   opacity: 1

    &.is-show-event-desc
      & + .sidebar-padding
        margin-top: -10px

    @media $mediaInSM
      margin-bottom: 20px

  &-avatar
    position: absolute
    width: 105px
    height: 120px
    border: 3px solid #283475;
    box-shadow: 3px 3px 0px #3546A1, inset 0px 2px 0px #E0F9FE;
    border-radius: 15px;
    // border-bottom-right-radius: 30px 120px;

  &-name-wrapper
    width 100%
    position absolute
    bottom 10px
    left 0
    .mirror-card_content
      display flex
      align-items center
      height: 67px

  &-name
    // background-image: url("../../assets/trapezoids/name_of_nft.svg")
    // background-size: 100% 100%
    // background-repeat: no-repeat
    padding-left 120px
    width 100%
    font-size: 24px
    line-height: 34px
    color: #35466D

    &.el-card
      .el-card__body
        padding: 0

  &-tips
    color: #F84343
    font-size: 12px
    line-height: 17px

.nft-upgrade-wrapper
  margin-bottom 42px

.desc-card,
.story-card
  width 100%
  margin-bottom: 20px

  .icon-circle-dark-close
    position: absolute
    cursor: pointer
    top: -7px
    right: -7px

  &.is-show-top-arrow
    margin-top: 10px
    overflow: initial
    position: relative

    &:after
      top: -10px
      left: 30px
      content: ' '
      position: absolute
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 15px 15px 15px;
      border-color: transparent transparent #DCDFEE transparent;

  .card-title
    font-size: 20px
    line-height: 28px
    user-select: text

    @media $mediaInSM
      font-size: 15px
      line-height: 21px

  .card-body
    font-size: 16px
    line-height: 20px
    user-select: text

.meta-card
  margin-bottom: 25px

  @media $mediaInSM
    margin-bottom: 10px

  .img-icon
    margin-right: 18px
    margin-bottom: 2px
    flex-shrink: 0

    &.size-big
      width: 47px
      height: 47px

  .meta-label
    font-size: 12px
    line-height: 14px
    margin-top: 3px
    margin-bottom: 2px

  .meta-count
    color: #35466D
    font-size: 18px;
    line-height: 22px;

.event-card
  cursor pointer
  &:hover
    opacity: 0.8
</style>
