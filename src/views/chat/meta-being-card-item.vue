<script setup>
import MirrorCard from "@/components/ui/mirror-card";

import { toRef } from "vue";

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const propCard = toRef(props, "card");
</script>

<template lang="pug">
mirror-card(
  borderWidth="3px"
  borderRadius="15px"
  placement="right"
  :skewDegAbs="15"
  borderColor="#35466d"
  bgColor="#dcff1c"
  shadowColor="#a6b356"
)
  .meta-card-item.d-flex.align-center
    .img-icon.size-big(
      :class="propCard.icon"
    )
    .meta-body
      .meta-label(v-if="propCard.title") {{ propCard.title }}
      .meta-count.font-weight-bold(v-if="propCard.content")  {{ propCard.content }}
</template>

<style lang="stylus">
.meta-card-item
  padding-left 20px
  height 80px
</style>
