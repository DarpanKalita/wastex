'use client'

import { createContext, useContext, ReactNode } from 'react'
import { formatCurrency, formatCurrencyWithDecimals, formatCurrencyCompact } from '@/utils/currency'

interface CurrencyContextType {
  format: (amount: number) => string
  formatWithDecimals: (amount: number) => string
  formatCompact: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const value = {
    format: formatCurrency,
    formatWithDecimals: formatCurrencyWithDecimals,
    formatCompact: formatCurrencyCompact,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
} 