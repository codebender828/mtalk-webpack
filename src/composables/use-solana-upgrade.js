import { onMounted, readonly, ref } from "vue";
import { useAnchorWallet } from "solana-wallets-vue";
import * as web3 from "@solana/web3.js";
import { __DEBUG__ } from "~/utils/dev";
// import { solana } from "~/services/apis/solana";
import { nftAPI } from "~/services/apis";

const { clusterApiUrl, Connection, PublicKey } = web3;

let isInitialized = false;
/** @type {import('vue').Ref<import('@mirrorworld/library.upgrade').LevelUpgrade>} */
const solanaUpgrade = ref(null);

export function useSolanaUpgrade() {
  const wallet = useAnchorWallet();
  const connection = new Connection(
    __DEBUG__ ? clusterApiUrl("devnet") : clusterApiUrl("mainnet-beta")
  );

  async function signLevelUpTransaction(transaction) {
    console.debug("Upgrade transaction: ", transaction);
    console.debug("Requesting user signature ...");
    const serializedTransaction = Buffer.from(transaction, "base64");
    const txt = web3.Transaction.from(serializedTransaction);
    console.debug("Constructed transaction from authority ...");
    const signedUpgradeTransaction = await wallet.value.signTransaction(txt);
    console.debug("Signed upgrade transaction ...");
    console.debug("Sending txt ...");
    const signature = await connection.sendRawTransaction(
      signedUpgradeTransaction.serialize()
    );
    const result = await connection.confirmTransaction(signature);
    console.debug("Successfully sent txt ...", result);
    console.log("result", result);
    return { result, signature };
  }

  async function initalize() {
    const { LevelUpgrade, LEVEL_UPGRADE_PROGRAM_ID } = await import(
      /** webpackChunkName: "MirrorSolanaUpgradeSDK" */ "@mirrorworld/library.upgrade"
    );
    solanaUpgrade.value = new LevelUpgrade(
      LEVEL_UPGRADE_PROGRAM_ID,
      connection,
      // @ts-ignore
      wallet.value
    );
    isInitialized = true;
  }

  onMounted(async () => {
    if (!solanaUpgrade.value || !isInitialized) {
      await initalize();
      // @ts-ignore
      window.$solanaUpgrade = solanaUpgrade.value;
    }
  });

  return {
    solanaUpgrade: readonly(solanaUpgrade),
    signLevelUpTransaction,
  };
}

export function isSolanaAddress(sol_address) {
  try {
    const publicKey = new PublicKey(sol_address);
    if (PublicKey.isOnCurve(publicKey.toBytes())) return true;
  } catch (e) {
    return false;
  }
  return false;
}

export const isSolanaBot = (bot) => isSolanaAddress(bot.owner_address);

export const getBotSolanaNFT = async (bot) => {
  return nftAPI.getSolanaMintInfo({
    token_id: String(bot.bot_id),
  });
};

// export interface IBot {
//   bot_id: string;
//   bot_name: string;
//   desc: string;
//   language: string;
//   image: string;
//   avatar: string;
//   level: number;
//   all_level_exp: number;
//   contract_address: string;
//   token_id: string;
//   trading_address: string;
//   owner_address: string;
//   node_public_id: string;
//   accompany_count: number;
//   experience_ranking: number;
//   last_input_at: string;
//   exp_limit: number;
//   exp: number;
//   nft_type: number;
//   birthday: string;
//   constellation: string;
//   mbti_type: string;
//   community: string;
//   binding_contract: string;
//   binding_token_id: string;
// }

// export interface ISolanaNFTResponse {
//   status: string;
//   data: Data;
// }
// export interface Data {
//   nft: SolanaNFT;
//   ownerTransfers?: OwnerTransfersEntity[] | null;
// }
// export interface SolanaNFT {
//   url: string;
//   mint_address: string;
//   token_id: string;
//   update_authority: string;
//   creator_address: string;
//   name: string;
//   symbol: string;
//   primary_sale_happened: boolean;
//   is_mutable: boolean;
//   metadata: Metadata;
//   uses: number;
//   last_scanned_at: string;
// }
// export interface Metadata {
//   name: string;
//   image: string;
//   symbol: string;
//   attributes?: AttributesEntity[] | null;
//   collection: Collection;
//   properties: Properties;
//   description: string;
//   external_url: string;
//   seller_fee_basis_points: number;
// }
// export interface AttributesEntity {
//   value: string | number;
//   trait_type: string;
// }
// export interface Collection {
//   name: string;
//   family: string;
// }
// export interface Properties {
//   files?: FilesEntity[] | null;
//   category: string;
//   creators?: CreatorsEntity[] | null;
// }
// export interface FilesEntity {
//   uri: string;
//   type: string;
// }
// export interface CreatorsEntity {
//   share: number;
//   address: string;
// }
// export interface OwnerTransfersEntity {
//   id: number;
//   nft_address: string;
//   transaction_signature: string;
//   from_token_account?: string | null;
//   to_token_account: string;
//   associated_to_account: string;
//   amount: number;
//   block_time: string;
//   slot: number;
//   createdAt: string;
//   updatedAt: string;
// }
