<script>
import MirrorCard from "@/components/ui/mirror-card";

import { toRef, defineComponent } from "vue";

const props = {
  card: {
    type: Object,
    required: true,
  },
};

export default defineComponent({
  props,
  components: {
    MirrorCard,
  },
  setup(props) {
    const propCard = toRef(props, "card");
    return {
      propCard,
    };
  },
});
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
