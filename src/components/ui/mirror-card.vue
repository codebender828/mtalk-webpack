<script setup>
const props = defineProps({
  borderWidth: String,
  borderRadius: String,
  skewDegAbs: Number,
  placement: String, // 'left', 'right'
  borderColor: String,
  bgColor: String,
  shadowColor: String,
});
const isLeft = props.placement === "left";
const innerOffsetX = `${props.skewDegAbs * 2}px`;
const innerWidth = `calc(100% - ${innerOffsetX})`;

const elSkewStyle = {
  width: `calc(100% - ${props.skewDegAbs}px)`,
  "border-width": props.borderWidth,
  "border-color": props.borderColor,
  "border-radius": props.borderRadius,
  transform: `skew(-${props.skewDegAbs}deg)`,
  "background-color": props.bgColor,
  "box-shadow": `${props.borderWidth} ${props.borderWidth} 0 ${props.shadowColor}`,
  [props.placement]: "0",
};

const elOverlayStyle = {
  width: innerWidth,
  "border-width": props.borderWidth,
  "border-color": props.borderColor,
  [`border-${props.placement}-width`]: "0",
  "border-radius": isLeft
    ? `0 ${props.borderRadius} ${props.borderRadius} 0`
    : `${props.borderRadius} 0 0 ${props.borderRadius}`,
  "background-color": props.bgColor,
  "box-shadow": isLeft
    ? `${props.borderWidth} ${props.borderWidth} 0 ${props.shadowColor}`
    : "none",
  [props.placement]: innerOffsetX,
};

const elContentStyle = {
  width: innerWidth,
  [props.placement]: innerOffsetX,
};
</script>

<template lang="pug">
div.mirror-card
  div.mirror-card_skew(:style="elSkewStyle")
  div.mirror-card_overlay(:style="elOverlayStyle")
  div.mirror-card_content(:style="elContentStyle")
    slot
</template>

<style lang="stylus">
.mirror-card
  position relative

  &_skew, &_overlay
    position absolute
    border-style solid

  &_skew
    height 100%
    transform-origin center
    top 0

  &_overlay,
  &_content
    width 100%
    height 100%
    top 0
    left 0

  &_content
    position relative
    color #000
</style>
