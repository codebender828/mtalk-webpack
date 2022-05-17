<script>
import TypingRandom from "./typing-random";

import { getFormattedContent, getTypingDelay } from "./typing-content";

export default {
  components: {
    TypingRandom,
  },

  props: {
    lang: {
      type: String,
    },

    status: {
      type: String,
    },

    defaultMessage: {
      type: String,
      default: "......",
    },
  },

  emits: ["setStatus"],

  data: () => ({
    futureMessages: [],
    isWaitingFutureMessage: false,

    typingTexts: [],
    typingTimer: null,

    resizeObserver: null,
  }),

  computed: {
    currentMessageTexts() {
      return getFormattedContent(this.futureMessages[0], this.lang);
    },
  },

  methods: {
    setTypingText() {
      if (this.typingTexts.length >= this.currentMessageTexts.length) {
        clearTimeout(this.typingTimer);
        this.futureMessages.shift();

        if (this.futureMessages.length) {
          this.isWaitingFutureMessage = true;
          this.typingTimer = setTimeout(() => {
            this.typingTexts = [];
            this.isWaitingFutureMessage = false;
            this.$emit("setStatus", "typing");
            this.setTypingText();
          }, 2000);
        } else {
          this.isWaitingFutureMessage = false;
          this.$emit("setStatus", "done");
        }

        return;
      }

      const currentText = this.currentMessageTexts[this.typingTexts.length];
      const typingDelay = getTypingDelay(currentText, this.lang);

      if (typingDelay) {
        this.typingTimer = setTimeout(() => {
          this.typingTexts.push(currentText);
          this.setTypingText();
        }, typingDelay);
      } else {
        this.typingTexts.push(currentText);
        this.setTypingText();
      }
    },

    startTyping() {
      clearTimeout(this.typingTimer);
      this.typingTexts = [];
      this.$nextTick();

      if (this.futureMessages.length) {
        this.$emit("setStatus", "typing");
        this.setTypingText();
      } else {
        this.$emit("setStatus", "done");
      }
    },

    addTypingMessages(newMessages = []) {
      const enabledMessages = newMessages.filter((message) => !!message);
      if (!enabledMessages.length) return;

      const lastCount = this.futureMessages.length;
      this.futureMessages = this.futureMessages.concat(enabledMessages);
      if (!lastCount) {
        this.startTyping();
      }
    },
  },

  mounted() {
    const wrapperEl = this.$refs.wrapper;
    const contentEl = this.$refs.content;
    if (!wrapperEl || !contentEl) return;

    this.resizeObserver = new ResizeObserver(() => {
      wrapperEl.scrollTop = 9999;
    });
    this.resizeObserver.observe(contentEl);
  },

  beforeUnmount() {
    clearTimeout(this.typingTimer);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
};
</script>

<template lang="pug">
div.typing-message(ref="wrapper")
  div.typing-message_texts(ref="content")
    template(v-if="typingTexts.length")
      span(
        v-for="text in typingTexts"
      ) {{ text }}
      TypingRandom(
        v-if="status === 'typing' && !isWaitingFutureMessage"
        :lang="lang"
      )
    span(v-else) {{ defaultMessage }}
</template>

<style lang="stylus">
.typing-message
  &_texts
    word-break break-word
    padding-bottom 4px
</style>
