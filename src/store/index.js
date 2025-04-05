// src/store/index.js
import useGameStore from "./gameStore";
import useTeamStore from "./teamStore";
import useProductStore from "./productStore";
import useMarketingStore from "./marketingStore";
import useInvestorStore from "./investorStore";

// Share stores with window object for cross-store access
if (typeof window !== "undefined") {
  window.gameStore = useGameStore;
  window.teamStore = useTeamStore;
  window.productStore = useProductStore;
  window.marketingStore = useMarketingStore;
  window.investorStore = useInvestorStore;
}

export {
  useGameStore,
  useTeamStore,
  useProductStore,
  useMarketingStore,
  useInvestorStore,
};
