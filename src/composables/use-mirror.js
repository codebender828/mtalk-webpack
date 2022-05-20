import { onMounted, ref, computed, onBeforeUnmount, watch } from "vue";
import { ethers } from "ethers";
import { MirrorProvider, DeploymentInfo } from "@white-matrix/nft-mirror-sdk";

export const ethereumChainIdToName = (chainId) => {
  const id = Number(chainId);
  if (isNaN(id)) return "Invalid network Id";

  const mapping = {
    1: "mainnet",
    3: "ropsten",
    4: "rinkeby",
    42: "kovan",
  };

  return mapping[id] || "unknown network";
};

const isInitialized = ref(false);
let listenerIds = 0;

/** @type {{ [id: number]: { id: number, handler: (accounts: string[]) => VoidFunction} }} */
const onAccountsChangedListeners = {};

/** @type {{ [id: number]: { id: number, handler: (chainId) => VoidFunction} }} */
const onChainChangedListeners = {};
/**
 * Mirror SDK
 * @type {import('@white-matrix/nft-mirror-sdk').MirrorClient}
 * */
let mirror = null;
/**
 * Ethereum provider
 * @type {import('ethers').providers.Provider}
 */
let provider = null;

/**
 * HOTFIX
 */
const contractNetwork = computed(() => process.env.VUE_APP_PAYMENT_NETWORK);

const contractAddress =
  DeploymentInfo[contractNetwork.value].mirror.proxyAddress;
const ethAccount = ref(null);
const chainId = ref(null);
const isMainnet = computed(() => Number(chainId.value) === 1);
const currentNetworkName = computed(() => ethereumChainIdToName(chainId.value));
const isNetworkSafe = computed(
  () => contractNetwork.value === currentNetworkName.value
);

export function useMirror() {
  async function initializeEthereumProvider() {
    try {
      return cleanup;
    } catch (error) {
      console.error("Could not enable ethereum", error);
    }
  }

  const cleanup = () => {
    const ethereum = window.ethereum;
    ethereum.removeListener("accountsChanged", handleAccountsChanged);
    ethereum.removeListener("chainChanged", handleChainChanged);
  };

  function onAccountChanged(handler) {
    const id = ++listenerIds;
    onAccountsChangedListeners[id] = {
      id: ++listenerIds,
      handler,
    };

    return function cleanup() {
      delete onAccountsChangedListeners?.[id];
    };
  }

  function onChainChanged(handler) {
    const id = ++listenerIds;
    onChainChangedListeners[id] = {
      id: ++listenerIds,
      handler,
    };

    return function cleanup() {
      delete onChainChangedListeners?.[id];
    };
  }

  function handleAccountsChanged(accounts) {
    Object.values(onAccountsChangedListeners)
      .map(({ handler }) => handler)
      .forEach((handler) => handler?.(accounts));
  }

  function handleChainChanged(newChainId) {
    chainId.value = newChainId;
    Object.values(onChainChangedListeners).forEach(({ handler }) =>
      handler?.(newChainId)
    );
  }

  onBeforeUnmount(cleanup);

  async function init() {
    // Request user accounts on page load.
    // We enforce this so that the user
    //  can connect by default.

    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        ethAccount.value = accounts[0];
        chainId.value = await window.ethereum.request({
          method: "eth_chainId",
        });
        await initializeEthereumProvider();

        const ethereum = window.ethereum;
        if (ethereum && ethereum.isConnected()) {
          ethereum.on("accountsChanged", handleAccountsChanged);
          ethereum.on("chainChanged", handleChainChanged);
        }
      });

    // Initialize Mirrors Ethereum SDK
    provider = new ethers.providers.Web3Provider(window.ethereum);
    mirror = MirrorProvider(false);
    mirror.connectProvider(contractAddress, provider);
    const signer = provider.getSigner();
    mirror.connectSigner(signer);
    mirror.setWaitConfirmations(1);
    isInitialized.value = true;
  }

  watch(isMainnet, init);

  onMounted(() => {
    if (isInitialized.value) return;
    console.info({
      contractNetwork: contractNetwork.value,
      contractAddress,
    });
    try {
      init();
    } catch (error) {
      console.error("Error initializing Mirror Ethereum SDK", error);
    }
  });

  return {
    mirror,
    provider,
    contractAddress,
    ethAccount,
    isMainnet,
    onAccountChanged,
    onChainChanged,
    currentNetworkName,
    isNetworkSafe,
    contractNetwork,
  };
}
