import Cookies from "js-cookie";
import { createI18n } from "vue-i18n";
import cn from "./messages.cn";
import en from "./messages.en";

const cookieLocale = Cookies.get("locale") || navigator.language;

export default createI18n({
  globalInjection: true,
  locale: cookieLocale.startsWith("zh") ? "cn" : cookieLocale,
  fallbackLocale: {
    zh: ["en"],
    default: ["en"],
  },
  messages: {
    cn,
    en,
  },
});
