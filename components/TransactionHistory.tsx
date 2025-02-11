// "use client";

// import { useState, useEffect } from "react";
// import type { ethers } from "ethers";

// interface Transaction {
//   id: string;
//   from: string;
//   to: string;
//   tokenId: string;
//   status: "pending" | "completed" | "failed";
// }

// interface TransactionHistoryProps {
//   provider: ethers.BrowserProvider | null;
// }

// export default function TransactionHistory(props: TransactionHistoryProps) {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   useEffect(() => {
//     // In a real application, we would fetch the transaction history from a backend or blockchain
//     // For this example, we'll use mock data
//     const mockTransactions: Transaction[] = [
//       {
//         id: "1",
//         from: "Ethereum",
//         to: "Polygon",
//         tokenId: "123",
//         status: "completed",
//       },
//       {
//         id: "2",
//         from: "Polygon",
//         to: "BNB Chain",
//         tokenId: "456",
//         status: "pending",
//       },
//       {
//         id: "3",
//         from: "Arbitrum",
//         to: "Ethereum",
//         tokenId: "789",
//         status: "failed",
//       },
//     ];
//     setTransactions(mockTransactions);
//   }, []);

//   return (
//     <div className="mt-8 w-full max-w-md">
//       <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
//       <ul className="space-y-2">
//         {transactions.map((tx) => (
//           <li key={tx.id} className="bg-gray-100 p-4 rounded-md">
//             <p>From: {tx.from}</p>
//             <p>To: {tx.to}</p>
//             <p>Token ID: {tx.tokenId}</p>
//             <p>
//               Status:{" "}
//               <span
//                 className={`font-bold ${
//                   tx.status === "completed"
//                     ? "text-green-600"
//                     : tx.status === "failed"
//                     ? "text-red-600"
//                     : "text-yellow-600"
//                 }`}
//               >
//                 {tx.status}
//               </span>
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
