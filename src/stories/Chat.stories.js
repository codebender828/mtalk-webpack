import MessageItem from "~/views/chat/typing-message";

const mockMessage = {
  status: "typing",
  lang: "en",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};

export default {
  title: "View/Chat",
  component: MessageItem,
};

const MessageEntryTemplate = (args) => ({
  components: { MessageItem },
  setup() {
    return { args };
  },
  template: '<MessageItem v-bind="args" />',
});

export const MessageEntry = MessageEntryTemplate.bind({});
MessageEntry.args = {
  ...mockMessage,
};

MessageEntry.parameters = {
  options: { showPanel: true },
};
