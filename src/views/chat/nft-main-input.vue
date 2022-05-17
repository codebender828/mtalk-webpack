<script>
import MirrorCard from "@/components/ui/mirror-card";

import { mapActions } from "vuex";

export default {
  components: {
    MirrorCard,
  },

  props: {
    status: {
      type: String,
    },
  },

  emits: ["setStatus", "addNftMessages"],

  data() {
    return {
      inputValue: "",
      maxLength: 200,
    };
  },

  computed: {
    sendDisabled() {
      return !(this.status === "done" && this.inputValue);
    },

    maxLengthVisible() {
      return this.inputValue.length > this.maxLength * 0.9;
    },
  },

  methods: {
    ...mapActions(["sendChatMessage", "addLocalChatRecords"]),

    async send(event) {
      if (this.sendDisabled) return;

      const lastValue = this.inputValue;
      this.$emit("setStatus", "loading");
      await this.$nextTick();

      try {
        const replyMessages = await this.sendChatMessage(lastValue);

        this.addLocalChatRecords([{ name: "intent", text: lastValue }]);
        this.$emit("addNftMessages", replyMessages);

        this.$analytics.event("sent_message", {
          event_type: event.type,
          message: lastValue,
          response: replyMessages[0]?.content,
        });

        this.inputValue = "";
        this.focusInput();
      } catch (e) {
        this.$emit("addNftMessages", [
          { content: this.$t("nft.chat.send.error") },
        ]);
        this.inputValue = lastValue;
        this.focusInput();
      }
    },

    focusInput() {
      const inputEl = this.$refs.inputEl;
      if (inputEl && inputEl.focus) {
        inputEl.focus();
      }
    },
  },
};
</script>

<template lang="pug">
div.nft-main_input.d-flex.align-center(
  :class="{ 'nft-main_input-typing': status === 'typing' }"
)
  mirror-card(
    borderWidth="3px"
    borderRadius="15px"
    placement="right"
    :skewDegAbs="15"
    borderColor="#35466d"
    bgColor="#dcff1c"
    shadowColor="#a6b356"
  )
    input.nft-main_input-content(
      v-model="inputValue"
      :placeholder="$t('nft.chat.placeholder')"
      :disabled="status === 'loading'"
      :maxlength="maxLength"
      ref="inputEl"
      @focus="() => $analytics.event('chat_input_focused')"
      @keyup.enter="send"
    )
    span.nft-main_input-number(
      v-if="maxLengthVisible"
    ) {{ inputValue.length }} / {{ maxLength }}

  el-button.nft-main_input-button(
    v-loading="status === 'loading'"
    type="primary"
    :disabled="sendDisabled"
    @click.stop="send"
  )
    div.nft-main_input-send {{ $t('nft.chat.send') }}
</template>

<style lang="stylus">
.nft-main_input
  margin-top 30px
  padding-right 10px
  width 100%
  height 50px
  transition opacity .3s ease-in, transform .3s ease-in

  &-typing
    opacity 0
    transform translateY(80%)
  .mirror-card
    margin-right 20px
    flex 1
    height 46px
  .mirror-card_content
    display flex
    align-items center
  &-content
    margin-left 20px
    width 100%
    font-weight 600
    font-size 18px
    line-height 22px
    background transparent
    color #35466d
  &-number
    position absolute
    top -16px
    right -24px
    font-size 12px
    color #fff
  &-button
    border-radius 15px !important
    transform skew(-15deg) !important
    .el-loading-spinner
      transform scale(0.5) translateY(-10%) skew(15deg) !important
  &-send
    transform skew(15deg)

@media $mediaInMobile
  .nft-main_input
    margin-top 20px
    padding 20px 16px
    padding 20px 16px calc(env(safe-area-inset-bottom) + 20px) 16px
    height auto

    &-content input,
    &-content input:hover,
    &-content input:focus {
      // background-color #dfe4ef
    }
</style>
