<template lang="pug">
el-icon.rct-icon(
  v-bind="$props"
)
  svg( v-if="name" )
    use( :xlink:href="'#' + finalName" )
  slot( v-else )
</template>

<script>
export default {
  props: {
    color: {
      type: String,
    },
    size: {
      type: Number,
    },
    name: {
      type: String,
    },
  },

  computed: {
    finalName() {
      if (!this.name) {
        return;
      }

      return this.name.startsWith("icon-") ? this.name : `icon-${this.name}`;
    },
  },
};
</script>

<style lang="stylus">
.rct-icon
  vertical-align: middle
</style>
