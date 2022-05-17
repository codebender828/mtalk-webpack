import dogPortrait from "@/assets/nfts/dog-portrait.png";
import dogPortraitTyping from "@/assets/nfts/dog-portrait-typing.png";
import dogNameBox from "@/assets/nfts/dog-name-box.svg";
import dogChatBox from "@/assets/nfts/dog-chat-box.svg";
import dogPortraitVideo from "@/assets/nfts/dog-portrait.mp4";

import yankesiPortrait from "@/assets/nfts/yankesi-portrait.png";
import yankesiPortraitTyping from "@/assets/nfts/yankesi-portrait-typing.png";
import yankesiNameBox from "@/assets/nfts/yankesi-name-box.svg";
import yankesiChatBox from "@/assets/nfts/yankesi-chat-box.svg";

import mockSatoshiPortrait from "@/assets/nfts/mock-satoshi-portrait.png";

export const localNftList = [
  // [人] 言克斯
  {
    id: "1",
    descriptionKey: "nft.kesiyan.desc",
    useLocale: "onlyChinese",
    images: {
      portrait: yankesiPortrait,
      portraitTyping: yankesiPortraitTyping,
      nameBox: yankesiNameBox,
      chatBox: yankesiChatBox,
    },
    videos: {},
    nameBoxStyle: {
      top: "-15%",
      left: "8%",
      color: "#2a465a",
    },
    chatBoxStyle: {
      padding: "6% 3% 6% 8%",
      color: "#2a465a",
    },
  },
  // [狗] Toli
  {
    id: "6",
    useLocale: "onlyEnglish",
    descriptionKey: "nft.toli.desc",
    images: {
      portrait: dogPortrait,
      portraitTyping: dogPortraitTyping,
      nameBox: dogNameBox,
      chatBox: dogChatBox,
    },
    videos: {
      portrait: dogPortraitVideo,
    },
    nameBoxStyle: {
      top: "0",
      left: "16%",
      color: "#823f06",
    },
    chatBoxStyle: {
      padding: "10% 3% 6% 8%",
      color: "#823f06",
    },
  },
];

const formatBotId = (botId) => {
  return `00000${botId}`.slice(-5).split("").join("-");
};

const formatLevel = (level) => {
  const levelString = String(level);
  const levelName = {
    1: "Sweet Dream",
    2: "Link Reality",
    3: "Small Talk",
    4: "Quick Learn",
    5: "Deep Think",
    6: "Awakening",
  }[levelString];
  return levelName ? `Lv${levelString}: ${levelName}` : `Lv${levelString}`;
};

export const washBotData = (source) => {
  if (!source.bot_id) {
    return null;
  }

  return {
    id: source.bot_id,
    useLocale: source.language === "CN" ? "onlyChinese" : "onlyEnglish",
    language: (source.language || "").toLowerCase(),
    nft_type: source.nft_type,
    name: source.bot_name,
    summary_text: source.desc,
    token: formatBotId(source.bot_id),
    token_id: source.token_id,
    nft_type: source.nft_type,
    trading_address: source.trading_address,
    images: {
      avatar: source.avatar || mockSatoshiPortrait,
      portrait: source.image || mockSatoshiPortrait,
    },
    stats: {
      exp: source.exp,
      maxExp: source.exp_limit,
      ranking: source.experience_ranking,
      level: formatLevel(source.level),
      levelValue: source.level,
      replyCount: source.stats.add_count,
      markCount: source.stats.mark_count,
      sessionCount: source.stats.session_count,
      accompanyCount: source.accompany_count || 0,
    },
  };
};

export const washNftData = (source) => {
  const localData = localNftList.find((nft) => nft.id === source.DataID);

  if (!localData) return null;

  return {
    ...localData,
    ...source,
    collector: source.collector_name,
    takenId: source.nft_number,
    stats: {
      level: source.Intelligence_level,
      session: source.interlocution,
      accompany: source.accompanying_day,
    },
  };
};

export const washNftDataList = (sourceList = []) => {
  // 以后端数据为准
  return sourceList.map(washNftData).filter((item) => !!item);

  // 以前端数据为准
  // return localNftList
  //   .map((nftItem) => {
  //     const source = sourceList.find((sourceItem) => sourceItem.DataID === nftItem.id)
  //     if (!source) return null

  //     return {
  //       ...nftItem,
  //       ...source,
  //       collector: source.collector_name,
  //       takenId: source.nft_number,
  //       stats: {
  //         level: source.Intelligence_level,
  //         session: source.interlocution,
  //         accompany: source.accompanying_day
  //       },
  //     }
  //   })
  //   .filter((item) => !!item)
};
