"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GasSettingsProps {
  value: string
  onChange: (value: string) => void
}

export default function GasSettings({ value, onChange }: GasSettingsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="gas-limit" className="text-sm font-medium">
        Gas Limit
      </Label>
      <Input
        id="gas-limit"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-900 border-gray-700 text-white"
        placeholder="Enter gas limit"
      />
    </div>
  )
}

