import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type BearStore = {
  reqScanUrls: string[];
  reqScan: (url: string) => void;
};

export const useBearStore = create<BearStore>()(
  persist(
    (set, get) => ({
      reqScanUrls: [],
      reqScan: (url: string) => {
        set((state) => {
          const preUrls = state.reqScanUrls;
          preUrls.push(url);
          if (preUrls.length === 4) preUrls.slice(0);
          return {
            reqScanUrls: preUrls,
          };
        });
      },
    }),
    {
      name: "food-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: (state) => {
        console.log("hydration starts");

        // optional
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
          }
        };
      },
    }
  )
);
