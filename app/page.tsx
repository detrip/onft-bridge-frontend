"use client"

import { useState } from "react"
import type { ethers } from "ethers"
import NFTBridgeCard from "@/components/NFTBridgeCard"

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  const handleWalletConnect = (connectedProvider: ethers.BrowserProvider) => {
    setProvider(connectedProvider)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <NFTBridgeCard provider={provider} onConnect={handleWalletConnect} />
    </main>
  )
}

