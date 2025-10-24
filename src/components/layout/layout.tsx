"use client"

import { ReactNode } from "react"
import { Header } from "@/components/layout/header"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
}
