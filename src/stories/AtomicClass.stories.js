import Atomic from "./AtomicClass.vue";
// import'../styles/atomic/vuetify.sass'

export default {
  title: "Style/Atomic",
  component: Atomic,
};

export const Spacing = () => ({
  components: { Atomic },
  template: '<Atomic type="spacing" />',
});

export const Layout = () => ({
  components: { Atomic },
  template: '<Atomic type="layout" />',
});

export const Typography = () => ({
  components: { Atomic },
  template: '<Atomic type="typography" />',
});
