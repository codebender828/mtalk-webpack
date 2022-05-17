<template lang="pug">
.v-application
  .container.mt-10
    .section.px-2.mb-10( v-if="type === 'spacing'" )
      .text-h4.mb-4 Spacing
      .box-model.d-flex
        .ma-2.col( style="background-color: #ffcc80" )
          .pa-6( style="background-color: #c5e1a5" )
            .pa-6( style="background-color: white" ) Box Model Spacing

    .section.px-2.mb-10( v-if="type === 'layout'" )
      .text-h4.mb-4 Layout
      .part-display
        .text-h6.mb-4 Display
        .gray-card.d-inline.pa-2 d-inline
        .gray-card.d-inline.pa-2( style="background-color: #ccc" ) d-inline
      .part-flex.mt-10
        .text-h6.mb-4 Flex
        .demo-card-row.d-flex.justify-space-between
          .gray-card.demo-card.pa-3( v-for="n in 3" ) justify-space-between
      .part-flex.mt-10
        .text-h6.mb-4 Grid
        .row
          .col-6
            .gray-card.pa-3 .col-6
          .col-6
            .gray-card.pa-3 .col-6
        .row
          .col-8
            .gray-card.pa-3 .col-8
          .col-4
            .gray-card.pa-3 .col-4
        .mt-6
        .row.no-gutters
          .gray-card.pa-3.col .col
          .spacer
          .gray-card.pa-3.col .col
        .mt-6
        .row
          .col
            .gray-card.pa-3  1 of 3
          .col.col-5
            .gray-card.pa-3  2 of 3 (wider)
          .col
            .gray-card.pa-3  3 of 3

    .section.px-2.mb-10( v-if="type === 'typography'" )
      .text-h4.mb-4 Typography
      .text-box.pa-4( style="border: 1px solid #ddd" )
        .text-h1 Heading 1
        .text-h2 Heading 2
        .text-h3 Heading 3
        .text-h4 Heading 4
        .text-h5 Heading 5
        .text-h6 Heading 6
        .text-subtitle-1 Subtitle 1
        .text-subtitle-2 Subtitle 2
        .text-body-1 Body 1
        .text-body-2 Body 2
        .text-button Button
        .text-caption Caption
        .font-italic  Italic text
        .text-center  Center aligned text on all viewport sizes.
        .text-decoration-line-through  Line-through text
</template>

<script>
export default {
  props: ["type"],
};
</script>

<style lang="stylus">
.gray-card {
  background-color: $v-primary-color-07
}
</style>
