import { BumpsState } from "@/types";

interface BumpsWithOffers {
  id: number;
  bump_id: number;
  product_id: number;
  offer_hash: string;
}

export const useBumpsStore = defineStore("bumps", {
  state: (): BumpsState => ({ bumps: [] }),
  getters: {
    hasSelectedBumps: (state: BumpsState) =>
      state.bumps.some((bump) => bump.checked),
  },
  actions: {
    async hasBumps(): Promise<void> {
      const { fullPath, query } = useRoute();

      // Check if exists b_id in url
      if (fullPath.includes("b_id")) {
        // Check if exists bump id in new pattern
        if (fullPath.includes("b_id_1")) await this.getNewBumps(query);
        await this.getOldBumps(query);
      }
    },
    async getNewBumps(query: any) {
      this.bumps = [];
    },
    async getOldBumps(query: any) {
      this.bumps = [];
    },
  },
});
