"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoIcon as InfoCircle, ArrowDown } from "lucide-react";
import NetworkSelector from "./NetworkSelector";
import TokenSelector from "./TokenSelector";
import GasSettings from "./GasSettings";
import BridgeABI from "@/abi/BridgeAbi.json";
import { Options } from "@layerzerolabs/lz-v2-utilities";

interface NFTBridgeCardProps {
  provider: ethers.BrowserProvider | null;
  onConnect: (provider: ethers.BrowserProvider) => void;
}

export interface NFTNetwork {
  network: string;
  contractAddress: string;
}

export interface NFT {
  name: string;
  networks: NFTNetwork[];
}

// Sample NFT data with contract addresses provided for each network
const nfts: NFT[] = [
  {
    name: "BAYC",
    networks: [
      { network: "ethereum", contractAddress: "0xBAYC_eth_address" },
      { network: "polygon", contractAddress: "0xBAYC_polygon_address" },
    ],
  },
  {
    name: "CryptoPunks",
    networks: [
      { network: "ethereum", contractAddress: "0xCryptoPunks_eth_address" },
      { network: "bnb", contractAddress: "0xCryptoPunks_bnb_address" },
    ],
  },
  {
    name: "Azuki",
    networks: [
      { network: "ethereum", contractAddress: "0xAzuki_eth_address" },
      { network: "polygon", contractAddress: "0xAzuki_polygon_address" },
      { network: "bnb", contractAddress: "0xAzuki_bnb_address" },
    ],
  },
  {
    name: "DTNS",
    networks: [
      {
        network: "sepolia",
        contractAddress: "0xA56Dc4c966c6A8b8E6B2e76fA83da715BD692451",
      },
      {
        network: "bitlayer_testnet",
        contractAddress: "0x17838e216b82B6a9934b67fc075cF4e8A8A8997e",
      },
    ],
  },
];

export default function NFTBridgeCard({
  provider,
  onConnect,
}: NFTBridgeCardProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [sourceNetwork, setSourceNetwork] = useState<string>("ethereum");
  const [destinationNetwork, setDestinationNetwork] =
    useState<string>("polygon");
  const [selectedNFT, setSelectedNFT] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [gasLimit, setGasLimit] = useState<string>("0");

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        onConnect(provider);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  // Add helper function to map network to LayerZero endpoint ID
  const mapEndpointIdLayerzero = (network: string): number => {
    switch (network.toLowerCase()) {
      case "ethereum":
        return 30101;
      case "sepolia":
        return 40161;
      case "polygon":
        return 30109;
      case "amoy":
        return 40267;
      case "base":
        return 30184;
      case "bitlayer_testnet":
        return 40320;
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  };

  const handleBridge = async () => {
    const destinationContract = nfts
      .find((nft) => nft.name === selectedNFT)
      ?.networks.find(
        (net) => net.network === destinationNetwork
      )?.contractAddress;
    console.log("Bridging NFT...", {
      tokenId,
      selectedNFT,
      sourceNetwork,
      destinationNetwork,
      destinationContract,
    });

    const sourceContractAddress = nfts
      .find((nft) => nft.name === selectedNFT)
      ?.networks.find((net) => net.network === sourceNetwork)?.contractAddress;

    if (!provider || !sourceContractAddress) {
      console.error("Provider or source contract is missing");
      return;
    }

    try {
      const signer = await provider.getSigner();
      // Create the contract instance with the source contract address, ABI, and signer
      const contract = new ethers.Contract(
        sourceContractAddress,
        BridgeABI,
        signer
      );

      // Encode the payload message for bridging
      const payloadMessage = await contract.encodeBridgeToken(
        account, // user wallet address from state
        tokenId,
        "ipfs://QmfHc16wyUL6c9tGdJWUHuzUraup6CfYmTK5SgWW3ywCsX" // IPFS link mock data
      );

      // Determine the destination endpoint id using the helper
      const destEid = mapEndpointIdLayerzero(destinationNetwork);

      const options = Options.newOptions()
        .addExecutorLzReceiveOption(Number(gasLimit), 0)
        .toHex()
        .toString();

      // Quote the bridge fee based on the payload message
      const fee = await contract.quoteBridge(destEid, payloadMessage, options);

      console.log("Bridge transaction details:", {
        payloadMessage,
        destEid,
        fee,
      });

      // Send the bridge transaction
      const tx = await contract.bridgeONFT(destEid, tokenId, options, {
        value: fee.nativeFee,
      });

      // Send the transaction
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);
      // Optionally, proceed to send the actual bridge transaction here.
    } catch (error) {
      console.error("Error during bridging:", error);
    }
  };

  // Filter NFTs based on the selected source network
  const availableNFTs = nfts.filter((nft) =>
    nft.networks.some((net) => net.network === sourceNetwork)
  );

  // Update destination network when source network changes
  useEffect(() => {
    const selectedNFTData = nfts.find((nft) => nft.name === selectedNFT);
    const availableDestinations = selectedNFTData
      ? selectedNFTData.networks.filter((net) => net.network !== sourceNetwork)
      : [];
    if (
      availableDestinations.length > 0 &&
      !availableDestinations.some((net) => net.network === destinationNetwork)
    ) {
      setDestinationNetwork(availableDestinations[0].network);
    }
  }, [sourceNetwork, selectedNFT, destinationNetwork]);

  return (
    <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Bridge Token
            <InfoCircle className="h-4 w-4 text-gray-400" />
          </CardTitle>
          {account ? (
            <Button
              variant="outline"
              onClick={disconnectWallet}
              className="text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500 border-red-500/20"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={connectWallet}
              className="text-sm bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500 border-blue-500/20"
            >
              Connect Wallet
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-400">
          Transfer your NFT from one network to another
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <NetworkSelector
            value={sourceNetwork}
            onChange={(network) => {
              setSourceNetwork(network);
              setSelectedNFT("");
            }}
            networks={[
              "ethereum",
              "polygon",
              "bnb",
              "sepolia",
              "bitlayer_testnet",
            ]}
          />
          <TokenSelector
            nfts={availableNFTs}
            value={selectedNFT}
            onChange={(newValue) => {
              if (newValue !== "no-nfts") {
                setSelectedNFT(newValue);
              } else {
                setSelectedNFT("");
              }
            }}
          />
          <Input
            type="text"
            placeholder="Enter Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white mt-2"
          />
        </div>

        <div className="flex justify-center">
          <div className="bg-blue-600 rounded-full p-2">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Transfer To</label>
          <NetworkSelector
            value={destinationNetwork}
            onChange={setDestinationNetwork}
            networks={
              nfts
                .find((nft) => nft.name === selectedNFT)
                ?.networks.filter((net) => net.network !== sourceNetwork)
                .map((net) => net.network) || []
            }
            disabled={!selectedNFT}
          />
          <TokenSelector
            nfts={selectedNFT ? [{ name: selectedNFT, networks: [] }] : []}
            value={selectedNFT}
            onChange={() => {}}
            disabled={true}
          />
        </div>

        <GasSettings value={gasLimit} onChange={setGasLimit} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleBridge}
          disabled={!account || !selectedNFT || !tokenId}
        >
          Bridge Token
        </Button>
        <p className="text-xs text-gray-400 text-center">
          DeTrip with LayerZero
        </p>
      </CardFooter>
    </Card>
  );
}
