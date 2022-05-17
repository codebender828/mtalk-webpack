import { BaseAPI } from "./base";
import { errorReporterCreator } from "~/utils/dev";
import { store } from "../store";

const errorReporter = errorReporterCreator("API Error");

class UserAPI extends BaseAPI {
  async getUserInfo() {
    try {
      const res = await this.request.get(`/api/userinfo/`, {});
      store.commit("SET_USER", { ...res.response });
      return res;
    } catch (error) {
      errorReporter("Request getUserInfo API failed", error);
      throw error;
    }
  }

  async signup(data) {
    try {
      const res = await this.request.post(`/api/sign_up/`, {
        ...data,
        code: "",
      });
      store.commit("SET_USER", {
        type: "user",
        ...res.user,
      });
      return res;
    } catch (error) {
      errorReporter("Request signup API failed", error);
      throw error;
    }
  }

  async login(data) {
    try {
      const res = await this.request.post(`/meta/user/auth`, { ...data });
      if (!res.user) {
        res.user = {
          token: res.auth_code,
        };
      }
      store.commit("SET_USER", {
        type: "user",
        ...res.user,
      });
      return res;
    } catch (error) {
      errorReporter("Request login API failed", error);
      throw error;
    }
  }

  async logout() {
    try {
      store.commit("SET_USER", {
        type: "guest",
        token: null,
      });
      // return res
    } catch (error) {
      errorReporter("Request logout API failed", error);
      throw error;
    }
  }
}

export const userAPI = new UserAPI();
