import { nftAPI } from "~/services/apis";
import { washBotData } from "~/utils/mergeChatData";
import { errorReporter } from "~/utils/dev";

export const chatMutations = {
  UPDATE_RECORD_ITEM(state, payload) {
    const payloadData = JSON.parse(JSON.stringify(payload));
    const targetItem = state.context.localChatRecords.find(
      (record) => record.id === payloadData.msg_id
    );

    if (!targetItem) return;
    Object.keys(payloadData).forEach((key) => {
      targetItem[key] = payloadData[key];
    });
  },
};

export const chatActions = {
  async getSingleChatInfo({ commit, dispatch }, botId) {
    try {
      const chatId = await nftAPI.getChatId(botId);
      const resChatInfo = await nftAPI.getChatInfo(botId, chatId);
      const finalChatInfo = resChatInfo.data ? resChatInfo.data : resChatInfo;
      const chatInfo = washBotData(finalChatInfo);
      commit("SET_USER", {
        name: chatId,
      });
      commit("SET_CONTEXT", {
        botId,
        chatId,
        chatInfo,
      });
      return chatInfo;
    } catch (error) {
      if (error.status === 401) {
        dispatch("removeUserCookies");
      }
      errorReporter("[getSingleChatInfo] Action Error", error);
      throw error;
    }
  },

  async sendChatMessage({ commit, dispatch, state }, text) {
    try {
      const replyMessages = await nftAPI.sendMessage({
        bot_id: state.context.botId,
        conversation_id: state.context.chatId,
        text,
      });
      const lastMessage = replyMessages[replyMessages.length - 1];
      dispatch("updateTotalExp", lastMessage.total_exp);
      return replyMessages;
    } catch (error) {
      errorReporter("[sendChatMessage] Action Error", error);
      throw error;
    }
  },

  async restartConversation({ commit, state }) {
    try {
      await nftAPI.restartConversation(
        state.context.botId,
        state.context.chatId
      );
      commit("SET_CONTEXT", {
        localChatRecords: [
          { name: "intent", text: "/restart" },
          { name: "action_restart" },
        ],
      });
    } catch (error) {
      errorReporter("[restartConversation] Action Error", error);
      throw error;
    }
  },

  async setStats({ commit, state }) {
    try {
      const { botId, chatId, chatInfo } = state.context;
      const countInfo = await nftAPI.getChatCount(botId, chatId);
      commit("SET_CONTEXT", {
        chatInfo: {
          ...(chatInfo || {}),
          stats: {
            ...((chatInfo && chatInfo.stats) || {}),
            replyCount: countInfo.add_count,
            markCount: countInfo.mark_count,
            sessionCount: countInfo.session_count,
          },
        },
      });
    } catch (error) {
      errorReporter("[setStats] Action Error", error);
      throw error;
    }
  },

  async addLocalChatRecords({ commit, dispatch, state }, records) {
    try {
      if (records && records.length) {
        await dispatch("setStats");
        const { localChatRecords } = state.context;
        const newValue = localChatRecords.concat(records);
        commit("SET_CONTEXT", {
          localChatRecords: newValue,
        });
      }
    } catch (error) {
      errorReporter("[addLocalChatRecords] Action Error", error);
      throw error;
    }
  },

  async getLocalChatRecords({ commit, state }) {
    try {
      const localChatRecords = await nftAPI.getChatRecords(
        state.context.chatId
      );
      commit("SET_CONTEXT", { localChatRecords });
      return localChatRecords;
    } catch (error) {
      errorReporter("[getLocalChatRecords] Action Error", error);
      throw error;
    }
  },

  async likeChatRecordItem({ commit, dispatch, state }, item) {
    try {
      await nftAPI.voteRecordItem({
        conversation_id: state.context.chatId,
        id: item.msg_id,
        evaluate: item.evaluate,
      });
      await dispatch("setStats");
      commit("UPDATE_RECORD_ITEM", {
        msg_id: item.msg_id,
        evaluate: item.evaluate,
      });
    } catch (error) {
      errorReporter("[likeChatRecordItem] Action Error", error);
      throw error;
    }
  },

  async updateRecordReplyMessage(
    { commit, dispatch, state },
    { type, recordId, replyMessage }
  ) {
    try {
      const { chatId } = state.context;
      const updateApi = {
        add: () =>
          nftAPI.addRecordReplyMessage({
            from_share: true,
            action: "utter_greet",
            conversation_id: chatId,
            id: recordId,
            text: replyMessage.text,
          }),
        edit: () =>
          nftAPI.editRecordReplyMessage({
            conversation_id: chatId,
            id: recordId,
            text_id: replyMessage.text_id,
            text: replyMessage.text,
          }),
        delete: () =>
          nftAPI.deleteRecordReplyMessage({
            conversation_id: chatId,
            id: recordId,
            text_id: replyMessage.text_id,
            text: replyMessage.text,
          }),
      }[type];
      const updateApiRes = await updateApi();
      await dispatch("setStats");
      commit("UPDATE_RECORD_ITEM", {
        msg_id: recordId,
        besttext: updateApiRes.texts ? updateApiRes.texts : updateApiRes,
      });

      if (updateApiRes.total_exp) {
        dispatch("updateTotalExp", updateApiRes.total_exp);
      }
    } catch (error) {
      errorReporter("[updateRecordReplyMessage] Action Error", error);
      throw error;
    }
  },
  updateTotalExp({ commit, state }, totalExp) {
    const chatInfo = state.context.chatInfo || {};

    commit("SET_CONTEXT", {
      chatInfo: {
        ...chatInfo,
        stats: {
          ...(chatInfo.stats || {}),
          exp: totalExp,
        },
      },
    });
  },
  async signUpgrade(_, payload) {
    try {
      const result = await nftAPI.signUpgrade(payload);
      return result;
    } catch (error) {
      errorReporter("Request signUpgrade API failed", error);
      throw error;
    }
  },
  async verifyUpgrade(_, payload) {
    try {
      const result = await nftAPI.verifyUpgrade(payload);
      return result;
    } catch (error) {
      errorReporter("Request verifyUpgrade API failed", error);
      throw error;
    }
  },
  async requestSolanaBotUpgrade(_, payload) {
    try {
      const result = await nftAPI.requestSolanaBotUpgrade(payload);
      return result;
    } catch (error) {
      errorReporter("Request requestSolanaBotUpgrade API failed", error);
      throw error;
    }
  },
};
