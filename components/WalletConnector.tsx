"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"

interface WalletConnectorProps {
  onConnect: (provider: ethers.BrowserProvider) => void
}

export default function WalletConnector({ onConnect }: WalletConnectorProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
    }
  }, [])

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", [])
        setAccount(accounts[0])
        onConnect(provider)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      console.error("MetaMask is not installed")
    }
  }

  return (
    <div className="flex flex-col items-center">
      {account ? (
        <div className="text-center">
          <p className="mb-2">Connected Account:</p>
          <p className="font-mono bg-gray-100 p-2 rounded">{account}</p>
        </div>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </div>
  )
}

