import { create } from 'zustand'
import { Purchase, Warranty, ReturnPolicy, Alert } from '@/types'

interface PurchaseState {
  purchases: Purchase[]
  warranties: Warranty[]
  returnPolicies: ReturnPolicy[]
  alerts: Alert[]
  isLoading: boolean
  error: string | null
  setPurchases: (purchases: Purchase[]) => void
  addPurchase: (purchase: Purchase) => void
  updatePurchase: (id: string, purchase: Partial<Purchase>) => void
  removePurchase: (id: string) => void
  setWarranties: (warranties: Warranty[]) => void
  addWarranty: (warranty: Warranty) => void
  updateWarranty: (id: string, warranty: Partial<Warranty>) => void
  setReturnPolicies: (policies: ReturnPolicy[]) => void
  addReturnPolicy: (policy: ReturnPolicy) => void
  updateReturnPolicy: (id: string, policy: Partial<ReturnPolicy>) => void
  setAlerts: (alerts: Alert[]) => void
  addAlert: (alert: Alert) => void
  markAlertAsRead: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  purchases: [],
  warranties: [],
  returnPolicies: [],
  alerts: [],
  isLoading: false,
  error: null,
  setPurchases: (purchases) => set({ purchases }),
  addPurchase: (purchase) => set((state) => ({ purchases: [...state.purchases, purchase] })),
  updatePurchase: (id, updatedPurchase) =>
    set((state) => ({
      purchases: state.purchases.map((purchase) =>
        purchase.id === id ? { ...purchase, ...updatedPurchase } : purchase
      ),
    })),
  removePurchase: (id) =>
    set((state) => ({
      purchases: state.purchases.filter((purchase) => purchase.id !== id),
    })),
  setWarranties: (warranties) => set({ warranties }),
  addWarranty: (warranty) => set((state) => ({ warranties: [...state.warranties, warranty] })),
  updateWarranty: (id, updatedWarranty) =>
    set((state) => ({
      warranties: state.warranties.map((warranty) =>
        warranty.id === id ? { ...warranty, ...updatedWarranty } : warranty
      ),
    })),
  setReturnPolicies: (returnPolicies) => set({ returnPolicies }),
  addReturnPolicy: (policy) => set((state) => ({ returnPolicies: [...state.returnPolicies, policy] })),
  updateReturnPolicy: (id, updatedPolicy) =>
    set((state) => ({
      returnPolicies: state.returnPolicies.map((policy) =>
        policy.id === id ? { ...policy, ...updatedPolicy } : policy
      ),
    })),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  markAlertAsRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
