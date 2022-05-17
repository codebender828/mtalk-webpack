import axios from "axios";
import { __DEBUG__ } from "~/utils/dev";

export const solana = axios.create({
  baseURL: __DEBUG__
    ? "https://solana-syncer-staging.mirrorworld.fun/"
    : "https://solana-syncer.mirrorworld.fun/",
});
