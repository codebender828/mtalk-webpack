import { onMounted, ref, readonly, watch } from "vue";
import { useMirror } from "./use-mirror";

let isInitialized = false;
const souls = ref(null);

export function useSouls() {
  const { isMainnet } = useMirror();

  async function initalize() {
    const {
      default: Souls,
      DeploymentInfo,
      SoulsNetwork,
    } = await import(/** webpackChunkName: "SoulsSDK" */ "@mirrorworld/client");
    souls.value = new Souls({
      contractAddress: isMainnet.value
        ? DeploymentInfo[SoulsNetwork.mainnet].contractAddress
        : DeploymentInfo[SoulsNetwork.rinkeby].contractAddress,
      network: isMainnet.value ? SoulsNetwork.mainnet : SoulsNetwork.rinkeby,
    });
    console.log({ isMainnet: isMainnet.value });
    isInitialized = true;
  }

  watch(isMainnet, initalize);

  onMounted(async () => {
    if (!souls.value || !isInitialized) {
      await initalize();
      // @ts-ignore
      window.$souls = souls.value;
    }
  });

  return {
    souls: readonly(souls),
  };
}
