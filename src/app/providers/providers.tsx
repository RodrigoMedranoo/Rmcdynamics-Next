// app/providers.tsx
'use client';

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

export default function Providers({ children }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement='top-center' />
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={true}>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}