"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NetworkSelectorProps {
  value: string
  onChange: (value: string) => void
  networks: string[]
  disabled?: boolean
}

export default function NetworkSelector({ value, onChange, networks, disabled = false }: NetworkSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-gray-900 border-gray-700">
        <SelectValue placeholder="Select network" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {networks.map((network) => (
          <SelectItem key={network} value={network} className="text-white capitalize">
            {network}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

