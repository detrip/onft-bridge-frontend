"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NFT } from "./NFTBridgeCard";

interface TokenSelectorProps {
  nfts: NFT[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TokenSelector({
  nfts,
  value,
  onChange,
  disabled = false,
}: TokenSelectorProps) {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-gray-900 border-gray-700">
          <SelectValue placeholder="Select NFT" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700">
          {nfts.length > 0 ? (
            nfts.map((nft) => (
              <SelectItem
                key={nft.name}
                value={nft.name}
                className="text-white"
              >
                {nft.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-nfts" disabled className="text-gray-500">
              No NFTs available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
