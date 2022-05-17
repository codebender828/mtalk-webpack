import { createStore } from "vuex";
import Cookies from "js-cookie";
import { ElMessage } from "element-plus";

import { guard } from "../guard";
import { pretreatEvents } from "../apis";
import { chatMutations, chatActions } from "./chat";

const COOKIE_SSO_TOKEN = "sso-t";
const COOKIE_DOMAIN = ".mirrorworld.fun";
const STORAGE_NAME = "mirrors/user/name";

const initialState = () => {
  const token = Cookies.get(COOKIE_SSO_TOKEN);
  const name = localStorage.getItem(STORAGE_NAME) || "Mirror World Welcome";

  return {
    user: {
      name,
      userId: 0,
      // @values: guest | user | admin | god
      type: token ? "user" : "guest",
      token,
    },

    context: {
      botId: "",
      chatId: "",
      chatInfo: null,
      chatInfoList: [],
      localChatRecords: [],
      recordEditorItem: null,
      recordEditorVisible: false,
      welcomeMessage: "",
      licenseStatus:
        localStorage.getItem("rct/context/licenseStatus") || "unread",
    },

    dataMap: {},
  };
};

const getters = {
  isAuthed(state) {
    return !!state.user.token;
  },

  permissionMap(state) {
    return guard.getPermissionsMap(state.user.type);
  },

  getDataById: (state) => (id) => {
    if (!id) {
      return null;
    }

    if (Array.isArray(id)) {
      const dataArrs = id.map((_id) => state.dataMap[_id]);
      return dataArrs.filter((i) => i);
    }

    return state.dataMap[id];
  },
};

const mutations = {
  SET_USER(state, payload) {
    state.user = {
      ...state.user,
      ...payload,
    };

    if ("token" in payload) {
      if (payload.token) {
        Cookies.set(COOKIE_SSO_TOKEN, payload.token, { domain: COOKIE_DOMAIN });
      } else {
        Cookies.remove(COOKIE_SSO_TOKEN, { domain: COOKIE_DOMAIN });
      }
    }

    if (typeof payload.name !== "undefined") {
      localStorage.setItem(STORAGE_NAME, payload.name || "");
    }
  },

  SET_CONTEXT(state, payload) {
    state.context = {
      ...state.context,
      ...payload,
    };

    if (typeof payload.licenseStatus !== "undefined") {
      localStorage.setItem(
        "rct/context/licenseStatus",
        payload.licenseStatus || ""
      );
    }
  },

  SET_DATA(state, payload) {
    if (!Array.isArray(payload)) {
      payload = [payload];
    }

    payload = pretreatEvents(payload);

    payload.map((event) => {
      if (event && event.eventKey) {
        const id = event[event.eventKey];
        state.dataMap[id] = {
          ...state.dataMap[id],
          ...event,
        };
      } else if (event && event.id) {
        state.dataMap[event.id] = {
          ...state.dataMap[event.id],
          ...event,
        };
      }
    });

    // $forceUpdate
    state.dataMap = Object.assign({}, state.dataMap);
  },

  SET_DATA_BY_ID(state, payload) {
    const { id, patch } = payload;

    // DELETE: 没有 Patch 直接删除 Event
    if (!patch) {
      delete state.dataMap[id];
      // return
    } else {
      // PUT
      state.dataMap[id] = {
        ...state.dataMap[id],
        ...patch,
      };
    }

    // $forceUpdate
    state.dataMap = Object.assign({}, state.dataMap);
  },
};

export const store = createStore({
  state() {
    return initialState();
  },

  getters,
  mutations: {
    ...mutations,
    ...chatMutations,
  },
  actions: {
    ...chatActions,

    removeUserCookies() {
      // Cookies.remove(COOKIE_SSO_TOKEN, { domain: COOKIE_DOMAIN })
      ElMessage.error("用户信息不正确，请重新登录");
    },
  },
});
