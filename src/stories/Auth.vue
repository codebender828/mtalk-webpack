<template lang="pug">
.page.page-auth
  .handlers
    .user-info()
      template( v-if="$guard.isAuthed" ) {{ $guard.user.name }}
      span &nbsp;{{ $guard.user.type }}
    .handler( v-if="!$guard.isAuthed" @click="doLogin") 登录
    .handler( v-else @click="doLogout") 退出

  .message-list( v-if="$guard.check('chat.read.message')" )
    .message(
      v-for="(message, index) in messageList"
    )
      .messate-text {{ message.content }}
      .message-control( v-if="$guard.check('chat.create.message')" @click="() => handleRepostClick(message)") 转发
      .message-control( v-if="$guard.isAuthed" @click="() => handleDeleteClick(message, index)") 删除
</template>

<script>
import { useStore } from "vuex";
import { reactive, computed } from "vue";

const messageList = reactive([
  { content: "这是一条消息，访客也能看到", creatorId: 1 },
]);

export default {
  setup() {
    const store = useStore();

    return {
      // 用到了 $guard 后则不需要再单独 useStore()
      isAuthed: computed(() => store.getters.isAuthed),
      user: computed(() => store.state.user),
      // reactive 数组
      messageList,
    };
  },

  methods: {
    doLogin() {
      this.$store.commit("SET_USER", {
        type: "user",
        token: "test-token",
      });
    },

    doLogout() {
      this.$store.commit("SET_USER", {
        type: "guest",
        token: null,
      });
    },

    handleRepostClick(message) {
      messageList.push({
        content: `${this.user.name}: ${message.content}`,
        creatorId: this.user.userId,
      });
    },

    handleDeleteClick(message, index) {
      if (!this.$guard.check("chat.delete.message", { resource: message })) {
        alert("只有管理员/自己发的才能删除");
        return;
      }

      messageList.splice(index, 1);
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-auth
  padding: 20px

  .handlers
    margin-bottom: 80px

  .message
    margin-top: 20px

  .handler,
  .message-control
    color: blue
    border: 1px solid blue
    display: inline-flex
    margin-top: 10px
    padding: 4px 10px

  .message-control + .message-control
    margin-left: 10px
</style>
