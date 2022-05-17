import VueGtag from "vue-gtag";
import { $vm } from "~/services/vm";
import { __DEBUG__ } from "~/utils/dev";

const MEASURE_ID = __DEBUG__ ? "G-MOCK" : "G-L6DHFJSH1D";
const APP_NAME = "satoshi";

const ANALYTICS_KEY = "analytics";

class Analytics {
  constructor() {
    this.lastPageName = null;
  }

  install(app, injectKey) {
    app.use(VueGtag, {
      config: {
        id: MEASURE_ID,
        params: {
          send_page_view: false,
        },
      },
    });

    app.provide(injectKey || ANALYTICS_KEY, this);
    app.config.globalProperties.$analytics = this;
  }

  page($route) {
    $vm.$gtag.pageview($route);
    this.lastPageName = $route.name || $route.path;
    this.screen(this.lastPageName);
    if (__DEBUG__) {
      console.log("Analytics page:", $route);
    }
  }

  screen(name) {
    $vm.$gtag.screenview({
      app_name: APP_NAME,
      screen_name: name,
    });
    if (__DEBUG__) {
      console.log("Analytics screen:", name);
    }
  }

  event(action, params = {}) {
    const gaParams = {
      event_category: params.category || this.lastPageName,
      event_label: JSON.stringify(params || {}, null, 2),
    };

    $vm.$gtag.event(action, gaParams);

    if (__DEBUG__) {
      console.log("Analytics event:", action, params);
    }
  }
}

export const analytics = new Analytics();
