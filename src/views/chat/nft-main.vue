<script>
import MirrorCard from "@/components/ui/mirror-card";
import TypingMessage from "./typing-message";
import NFTMainInput from "./nft-main-input";

import { mapActions } from "vuex";

export default {
  components: {
    MirrorCard,
    TypingMessage,
    NFTMainInput,
  },

  props: {
    nft: Object,
  },

  data() {
    return {
      status: "done", // 'loading' | 'typing' | 'done'
      nextRecords: [],
    };
  },

  computed: {
    portraitImageSrc() {
      const { images, videos } = this.nft;
      if (videos && videos.portrait) return "";

      const { portrait, portraitTyping } = images;
      // 设计：暂时取消输入状态的贴图
      // return this.status === 'typing' ? portraitTyping : portrait
      return portrait;
    },
  },

  methods: {
    ...mapActions(["addLocalChatRecords"]),

    setStatus(newStatus) {
      this.status = newStatus;

      if (newStatus === "done" && this.nextRecords.length) {
        this.addLocalChatRecords(this.nextRecords);
        this.nextRecords = [];
      }
    },

    addNftMessages(newMessages) {
      const elTyping = this.$refs.elTyping;

      if (elTyping && elTyping.addTypingMessages) {
        this.nextRecords = newMessages
          .filter((message) => message.id)
          .map((message) => {
            return {
              name: "action",
              ...message,
              // content: message.content || this.$t('nft.chat.response.error')
            };
          });

        const contents = newMessages.map((message) => message.content);
        elTyping.addTypingMessages(contents);
      }
    },
  },
};
</script>

<template lang="pug">
div.nft-main.d-flex.flex-column.align-center.flex-grow-1.flex-sm-grow-0.flex-shrink-1(v-if="nft")
  div.nft-main_portrait.flex-grow-1.flex-shrink-1.d-flex.flex-column.align-center
    video.nft-main_video(
      v-if="nft.videos && nft.videos.portrait"
      autoplay
      loop
      muted
      playsinline
    )
      source(:src="nft.videos.portrait" type="video/mp4")

    img.nft-main_image(
      v-else-if="portraitImageSrc"
      :src="portraitImageSrc"
    )

  .nft-main_chat.flex-grow-0.flex-shrink-0
    mirror-card(
      borderWidth="3px"
      borderRadius="15px"
      placement="right"
      :skewDegAbs="15"
      borderColor="#283475"
      bgColor="#dcdfee"
      shadowColor="#3546a1"
    )
      div.nft-main_chat-content(
        :style="nft.chatBoxStyle"
      )
        TypingMessage.nft-main_chat-text(
          :lang="$i18n.locale"
          :status="status"
          ref="elTyping"
          @setStatus="setStatus"
        )

  NFTMainInput.flex-grow-0.flex-shrink-0(
    :status="status"
    @setStatus="setStatus"
    @addNftMessages="addNftMessages"
  )
</template>

<style lang="stylus">
.nft-main
  padding 20px 0 30px 70px
  max-width 640px
  height 100%
  justify-content space-around

  &_chat
    margin-top 24px
    padding-right 14px
    position relative
    width: 100%
    border-radius: 1px
    background-size: cover

    .mirror-card_content
      min-height 120px
      padding 20px 25px

    // &.el-card
    //   min-height: 120px
    //   // background-color: transparent;
    //   // background-image: url("../../assets/trapezoids/nft_chat_frame.svg");
    //   // background-size: 100% 100%;
    //   // background-repeat: no-repeat;

    //   .el-card__body
    //     padding: 25px
    //     padding-bottom: 30px

  &_name
    margin-bottom: 20px
    font-weight: 600

  &_chat-img,
  &_name-img
    display block
    max-width 100%
    height auto

  &_chat-content
    font-size 16px
    line-height 20px
    font-weight 600

  &_chat-content
    overflow hidden

  &_chat-text
    padding-right 20px
    width 100%
    height 100%
    overflow-x hidden
    overflow-y auto

    .chat-text-placeholder
      padding-bottom: 4px

    &::-webkit-scrollbar
      width 6px
      background #6c898f

    &::-webkit-scrollbar-thumb
      width 6px
      background #2a465a

    &::-webkit-scrollbar-button,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner,
    &::-webkit-resizer
      display none

  &_portrait
    width 100%
    max-width 500px
    max-height 500px
    overflow hidden

  &_image
    border-radius 20px
    overflow hidden
    max-width 100%
    max-height 100%

  &_video
    width 100%
    height 100%

    &::-webkit-media-controls-enclosure
      display none

  &_tags
    margin-top 24px
  &_tag
    margin-right 22px
    height 22px
    font-size 9px

    img
      display block
      width 18px
      height 18px
      margin 0 6px 2px 0

@media $mediaInDesktop
  .nft-main
    min-width: 470px
    height: s('calc(100vh - 95px)')
    width: 100%

@media $mediaInMobile
  .nft-main
    padding: 0
    padding-top: 16px
    height: auto
    justify-content space-between

    &_chat
      margin 0 22px
      width: s('calc(100% - 44px)')

    &_name
      margin-bottom: 15px

    &_name-content
      font-size 12px

    &_chat-content
      padding-bottom: 4px
      font-size 10px

    &_portrait
      max-width 325px
      max-height 325px
</style>
