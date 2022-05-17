export * from "./user";
export * from "./nft";

import { MOCK_USER } from ".";

export const mockInterceptor = (res) => {
  const config = res.config;
  const url = config.url.split("?")[0];

  let needIntercept = true;

  console;

  switch (url) {
    // case '/meta/user/auth':
    case "/user.logout":
      res.data = {
        user: MOCK_USER,
        auth_code:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mjc1NDkwMTIsImlzcyI6Imdpbi1tZXRhIn0.QIw7xFlOj8ySWYNbs1PnTNzMWWpHqdT9efAkBvPGr2E",
      };
      break;
    default:
      needIntercept = false;
  }

  const nextRes = { data: res.data, status: 200 };

  return needIntercept ? Promise.resolve(nextRes) : res;
};
