import Demo from "./UIDemo";

export default {
  title: "Component/UI",
  component: Demo,
};

const DemoTemplate = (args) => ({
  components: { Demo },
  setup() {
    return { args };
  },
  template: '<Demo v-bind="args" />',
});

export const UIPlayground = DemoTemplate.bind({});
UIPlayground.args = {};

UIPlayground.parameters = {};
