import { create } from "zustand";

interface CartStore {
  count: number;
  total: number;
  setCount: (n: number) => void;
  setTotal: (n: number) => void;
  increment: (qty: number, amount: number) => void;
  decrement: (qty: number, amount: number) => void;
  reset: () => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  count: 0,
  total: 0,
  setCount: (n) => set({ count: n }),
  setTotal: (n) => set({ total: n }),
  increment: (qty, amount) =>
    set((s) => ({ count: s.count + qty, total: s.total + amount })),
  decrement: (qty, amount) =>
    set((s) => ({
      count: Math.max(0, s.count - qty),
      total: Math.max(0, s.total - amount),
    })),
  reset: () => set({ count: 0, total: 0 }),
}));
