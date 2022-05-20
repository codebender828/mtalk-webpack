// import fly from 'flyio'
import axios from "axios";
import stringify from "qs/lib/stringify";
import { mockInterceptor } from "./mock";
import { $vm } from "../vm";
import { store } from "../store";

export const request = axios;
const ENABLE_MOCK = false;

request.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

let errorMessageTimer;
const errorMessageInterceptor = (errorRes) => {
  const errorData = errorRes.response?.data || errorRes.data;

  if (!errorData) {
    return;
  }

  if (errorMessageTimer) {
    clearTimeout(errorMessageTimer);
    errorMessageTimer = null;
  }

  // 只全部捕获部分 code
  if (
    (errorData.code !== 200 && errorData.message) ||
    errorData.code === 20001
  ) {
    if (!errorData.data && !errorData.message) {
      return;
    }

    errorMessageTimer = setTimeout(() => {
      $vm.$message.error(errorData.data || errorData.message);
    }, 50);
  }
};

const interceptGuestAction = (req) => {
  let needBreak = false;
  let source;

  if (store.state.user.uid !== 0) {
    return false;
  }

  return needBreak;
};

request.interceptors.request.use((req) => {
  // 使用 SSO Token
  req.headers["X-Sso-Token"] = store.state.user.token;

  /**
   * 注意：
   * 如果配置 content-type:application/x-www-form-urlencoded，
   * 就需要对表单数据进行 stringify
   * 如果是 json，直接删除以下两行就好
   */
  if (req.method === "get") {
    req.headers["Content-Type"] = "application/x-www-form-urlencoded";
    req.data = stringify(req.data);
  } else {
    const combinator = ~req.url.indexOf("?") ? "&" : "?";

    req.url = `${req.url}${combinator}`;

    if (req.method === "post") {
      req.headers["Content-Type"] = "application/json";
      // req.data = stringify(req.data)
    }
  }

  if (interceptGuestAction(req)) {
    return;
  }

  return req;
});

const washErrorRes = (errorRes) => {
  const res = errorRes.response || errorRes;

  if (!res) {
    return errorRes;
  }

  const resData = res.data || {};

  const washedRes = {
    ...res.config,
    message: resData.data || resData.message,
    data: resData,
    status: res.status,
  };

  return washedRes;
};

request.interceptors.response.use(
  (res) => {
    if (res.status !== 200 || res.data?.code !== 200) {
      errorMessageInterceptor(res);
      return Promise.reject(washErrorRes(res));
    }

    return res;
  },
  (errorRes) => {
    // 捕获特定错误展示报错信息
    errorMessageInterceptor(errorRes);

    if (!ENABLE_MOCK) {
      return errorRes;
    }

    // 在这里对报错对请求进行 Mock
    return mockInterceptor(errorRes);
  }
);

export class BaseAPI {
  constructor() {
    this.request = {
      async get(url, params, config) {
        try {
          const res = await axios.get(url, {
            ...config,
            params,
          });

          if (res.status !== 200) {
            return Promise.reject(washErrorRes(res));
          }

          if (res.data) {
            return res.data.data ? res.data.data : res.data;
          }

          return res;
        } catch (error) {
          if (error.ok) {
            console.log("wired error in request", error);
            return { ...error };
          }

          Promise.reject(error);
        }
      },
      async post(url, params, config) {
        const res = await axios.post(url, params, {
          ...config,
        });
        if (res.status !== 200) {
          return Promise.reject(washErrorRes(res));
        }
        if (res.data) {
          // Flat data 层级
          return res.data.data ? res.data.data : res.data;
        }
        return res;
      },
      delete: axios.delete,
      put: axios.put,
    };
  }
}
