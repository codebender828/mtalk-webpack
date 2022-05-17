import Auth from "./Auth.vue";

export default {
  title: "Service/Guard",
  component: Auth,
};

export const PermissionPlayground = () => ({
  components: { Auth },
  template: "<Auth />",
});
