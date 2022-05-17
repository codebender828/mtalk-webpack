import { BaseAPI } from "./base";
import { store } from "../store";
import { solana } from "./solana";

const STORAGE_KEY_PREFIX = "mirrors";

class NFTAPI extends BaseAPI {
  async getChatId(botId) {
    const storageKey = `${STORAGE_KEY_PREFIX}/${store.state.user.token}/${botId}/conversationId`;
    const lastConsersationId = localStorage.getItem(storageKey);
    if (lastConsersationId) {
      return lastConsersationId;
    } else {
      const res = await this.request.post(`api/v1/bot/conversation`, {
        bot_id: botId,
      });
      localStorage.setItem(storageKey, res.conversation_id);
      return res.conversation_id;
    }
  }

  async getChatInfo(botId, conversationId) {
    const baseInfo = await this.request.post(`/api/v1/bot/info`, {
      bot_id: botId,
    });
    const countInfo = await this.getChatCount(botId, conversationId);
    return {
      ...baseInfo,
      stats: countInfo,
    };
  }

  async getChatRecords(conversationId) {
    const res = await this.request.post(`/api/v1/bot/conversation/detail`, {
      conversation_id: conversationId,
    });
    return res.details;
  }

  getChatCount(botId, conversationId) {
    return this.request.post(`/api/v1/bot/count`, {
      bot_id: botId,
      conversation_id: conversationId,
    });
  }

  restartConversation(botId, conversationId) {
    return this.request.post(`/api/v1/bot/conversation/restart`, {
      bot_id: botId,
      conversation_id: conversationId,
    });
  }

  sendMessage(params) {
    // await this.request.post(`/api/v1/bot/conversation/input`, params)
    return this.getMessageResponse(params);
  }

  async getMessageResponse(params) {
    const messages = await this.request.post(
      `/api/v1/bot/conversation/response`,
      params
    );
    return messages.map((item) => ({
      ...item,
      content: item.text,
    }));
  }

  voteRecordItem(params) {
    return this.request.post(`/api/v1/response/evaluate`, params);
  }

  addRecordReplyMessage(params) {
    return this.request.post(`/api/v1/bot/response/text`, params);
  }

  editRecordReplyMessage(params) {
    return this.request.post(`/api/v1/bot/response/edit_text`, params);
  }

  deleteRecordReplyMessage(params) {
    return this.request.post(`/api/v1/bot/response/delete_text`, params);
  }

  signUpgrade(params) {
    return this.request.post(`/api/v1/bot/upgrade/get_signature`, params);
  }

  verifyUpgrade(params) {
    return this.request.post(`/api/v1/bot/upgrade/verify`, params);
  }

  setLanguage(params) {
    return this.request.post(`/api/v1/bot/set_language`, params);
  }

  /** Gets solana mint info for an NFT by bot Id */
  getSolanaMintInfo(params) {
    return solana.post(`/search/mint`, params);
  }

  requestSolanaBotUpgrade(params) {
    return solana.post(`/mirror/upgrade`, params);
  }
}

export const nftAPI = new NFTAPI();
