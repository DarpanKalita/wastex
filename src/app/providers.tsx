'use client'

import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </Provider>
  )
} 