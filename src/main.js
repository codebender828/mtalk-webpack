import { createApp } from "vue";
import ElementPlus from "element-plus";
import "@element-plus/theme-chalk/dist/index.css";
// import "virtual:svg-icons-register";

import { store } from "~/services/store";
import { guard } from "~/services/guard";
import { analytics } from "~/services/analytics";
import { updateVM } from "~/services/vm";
import { router } from "./router";
import components from "./components";
import App from "./App.vue";
import i18n from "./i18n";
import "./utils/polyfill";

// import

import SolanaWallets from "solana-wallets-vue";
//
// You can either import the default styles or create your own.
import "solana-wallets-vue/styles.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
  SolflareWalletAdapter,
  MathWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CloverWalletAdapter,
  SolletExtensionWalletAdapter,
  Coin98WalletAdapter,
} from "@solana/wallet-adapter-wallets";

const network = __DEBUG__
  ? WalletAdapterNetwork.Devnet
  : WalletAdapterNetwork.Mainnet;

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolletWalletAdapter({ network }),
    new SolflareWalletAdapter({ network }),
    new MathWalletAdapter({ network }),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    new SlopeWalletAdapter({ network }),
    new GlowWalletAdapter({ network }),
    new CloverWalletAdapter({ network }),
    new SolletExtensionWalletAdapter({ network }),
    new Coin98WalletAdapter({ network }),
  ],
  autoConnect: true,
};

// import "@/styles/ref.styl";

// import "vuetify/src/styles/settings/_variables.scss";
// import "vuetify/src/styles/styles.sass";
// import "vuetify/src/styles/utilities/_index.sass";
// import "vuetify/src/components/VGrid/_grid.sass";
// import "vuetify/src/components/VGrid/VGrid.sass";

import "@/styles/atomic/vuetify.sass";
import "@/styles/themes/element-plus-custom.scss";
import "@/styles/main.styl";

import { __DEBUG__ } from "./utils/dev";

export const app = createApp(App);

app.use(ElementPlus, {
  i18n: i18n.global.t,
});
app.use(components);
app.use(store);
app.use(analytics);
app.use(guard);
app.use(router);
app.use(i18n);
app.use(SolanaWallets, walletOptions);

app.mount("#app");
updateVM(app);
