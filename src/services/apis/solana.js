import axios from "axios";
import { __DEBUG__ } from "~/utils/dev";

import Cookies from "js-cookie";

export const solana = axios.create({
  baseURL: __DEBUG__
    ? "https://solana-syncer-staging.mirrorworld.fun/"
    : "https://solana-syncer.mirrorworld.fun/",
});

solana.interceptors.request.use((config) => {
  const COOKIE_SSO_TOKEN = "sso-t";
  const token = Cookies.get(COOKIE_SSO_TOKEN);
  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
});
