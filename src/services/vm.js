import { createApp } from "vue";

const vue = createApp();

export let $vm = { ...vue };

export const updateVM = (vm) => {
  $vm = Object.assign(vue);

  $vm = {
    ...$vm,
    ...vm.config.globalProperties,
  };
};
