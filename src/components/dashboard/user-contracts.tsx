// import { api } from "@/lib/api";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { IContractAnalysis } from "@/interfaces/contract.interface";
// import { useState } from "react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Badge } from "../ui/badge";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
// } from "@tanstack/react-table";
// import { UploadModal } from "../modals/upload-modal";
// import { Loader2, AlertCircle, FileText, AlertTriangle, Star, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
// import { Input } from "../ui/input";

// export default function UserContracts() {
//   const queryClient = useQueryClient();
//   const { data: contracts, isLoading, error } = useQuery<IContractAnalysis[]>({
//     queryKey: ["user-contracts"],
//     queryFn: () => fetchUserContracts(),
//   });

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [contractToDelete, setContractToDelete] = useState<string | null>(null);
//   const [goToPage, setGoToPage] = useState<string>("");

//   const router = useRouter();

//   const handleDeleteContract = async (contractId: string) => {
//     try {
//       await api.delete(`/contracts/${contractId}`);
//       queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
//       setIsDeleteDialogOpen(false);
//       setContractToDelete(null);
//     } catch (err) {
//       console.error("Failed to delete contract:", err);
//     }
//   };

//   const columns: ColumnDef<IContractAnalysis>[] = [
//     {
//       accessorKey: "_id",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           aria-label={`Sort by Contract ID ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
//         >
//           Contract ID
//           {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-medium text-blue-600">{row.getValue<string>("_id")}</div>
//       ),
//     },
//     {
//       accessorKey: "overallScore",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           aria-label={`Sort by Overall Score ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
//         >
//           Overall Score
//           {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
//         </Button>
//       ),
//       cell: ({ row }) => {
//         const score = parseFloat(row.getValue<number>("overallScore").toString());
//         const variant = score > 70 ? "default" : score < 50 ? "destructive" : "secondary";
//         return (
//           <Badge variant={variant} className="font-semibold">
//             {score.toFixed(2)} Overall Score
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "contractType",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           aria-label={`Sort by Contract Type ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
//         >
//           Contract Type
//           {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="text-gray-700">{row.getValue<string>("contractType") || "Unknown"}</div>
//       ),
//     },
//     {
//       accessorKey: "createdAt",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           aria-label={`Sort by Created At ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
//         >
//           Created At
//           {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
//         </Button>
//       ),
//       cell: ({ row }) => {
//         const date = new Date(row.getValue<Date>("createdAt"));
//         return <div className="text-gray-600">{date.toLocaleDateString()}</div>;
//       },
//     },
//     {
//       id: "actions",
//       header: () => <div className="text-right">Actions</div>,
//       cell: ({ row }) => (
//         <div className="text-right space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => router.push(`/dashboard/contract/${row.getValue("_id")}`)}
//             aria-label={`View details for contract ${row.getValue("_id")}`}
//             className="hover:bg-blue-50 transition-colors"
//           >
//             View Details
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setContractToDelete(row.getValue("_id"));
//               setIsDeleteDialogOpen(true);
//             }}
//             aria-label={`Delete contract ${row.getValue("_id")}`}
//             className="hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 transition-colors"
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data: contracts || [],
//     columns,
//     state: {
//       sorting,
//       pagination: { pageIndex, pageSize },
//     },
//     onSortingChange: setSorting,
//     onPaginationChange: (updater) => {
//       const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
//       setPageIndex(newState.pageIndex);
//       setPageSize(newState.pageSize);
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   const totalContracts = contracts?.length || 0;
//   const averageScore =
//     totalContracts > 0
//       ? (contracts?.reduce((sum, contract) => sum + (contract.overallScore ?? 0), 0) ?? 0) / totalContracts
//       : 0;
//   // const highRiskContracts =
//   //   contracts?.filter((contract) => contract.risks.some((risk) => risk.severity === "high")).length ?? 0;
//  const highRiskContracts = contracts?.filter((contract) => contract.overallScore < 50).length ?? 0;
//   const handleUploadComplete = () => {
//     queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
//     table.reset();
//   };

//   const handleGoToPage = () => {
//     const page = parseInt(goToPage, 10);
//     if (!isNaN(page) && page > 0 && page <= table.getPageCount()) {
//       table.setPageIndex(page - 1);
//       setGoToPage("");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full max-w-full mx-0 bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 space-y-6 font-sans">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
//         <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
//           Your Contracts
//         </h1>
//         <Button
//           onClick={() => setIsUploadModalOpen(true)}
//           className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
//         >
//           <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> New Contract
//         </Button>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
//         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-100">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
//             <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Contracts</CardTitle>
//             <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{totalContracts}</div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-green-50">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
//             <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Average Score</CardTitle>
//             <Star className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div
//               className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
//                 averageScore > 70 ? "text-green-600" : averageScore < 50 ? "text-red-600" : "text-yellow-600"
//               }`}
//             >
//               {averageScore.toFixed(2)}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-red-50">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
//             <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">High Risk Contracts</CardTitle>
//             <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
//           </CardHeader>
//           <CardContent>
//             <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${highRiskContracts > 0 ? "text-red-600" : "text-green-600"}`}>
//               {highRiskContracts}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="text-center py-8 sm:py-12 animate-fade-in">
//           <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin mx-auto text-blue-600" />
//           <p className="mt-2 sm:mt-3 text-gray-600 font-medium">Loading contracts...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="text-center py-8 sm:py-12 animate-fade-in">
//           <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 mx-auto" />
//           <p className="mt-2 sm:mt-3 text-red-500 font-medium">
//             Error loading contracts: {(error as Error).message}
//           </p>
//           <Button
//             variant="outline"
//             className="mt-3 sm:mt-4 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
//             onClick={() => queryClient.invalidateQueries({ queryKey: ["user-contracts"] })}
//           >
//             Retry
//           </Button>
//         </div>
//       )}

//       {/* Table for Desktop / Stacked Cards for Mobile */}
//       {contracts && (
//         <>
//           {/* Desktop Table View (hidden on mobile) */}
//           <div className="hidden sm:block rounded-xl border shadow-lg overflow-x-auto bg-white animate-slide-up w-full">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <tr key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <th key={header.id} className="px-4 py-3 sm:px-6 sm:py-4 font-semibold" scope="col">
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(header.column.columnDef.header, header.getContext())}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody>
//                 {table.getRowModel().rows.map((row, index) => (
//                   <tr
//                     key={row.id}
//                     className={`border-t transition-all duration-300 ${
//                       index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-blue-50 animate-slide-up`}
//                     style={{ animationDelay: `${index * 50}ms` }}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <td key={cell.id} className="px-4 py-3 sm:px-6 sm:py-4">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {contracts.length === 0 && (
//               <div className="text-center py-8 sm:py-12">
//                 <p className="text-gray-500 font-medium">No contracts found.</p>
//               </div>
//             )}
//           </div>

//           {/* Mobile Stacked View (hidden on desktop) */}
//           <div className="block sm:hidden space-y-4 w-full">
//             {table.getRowModel().rows.map((row, index) => (
//               <div
//                 key={row.id}
//                 className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow animate-slide-up"
//                 style={{ animationDelay: `${index * 50}ms` }}
//               >
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-xs font-semibold text-gray-600">Contract ID</p>
//                       <p className="text-sm font-medium text-blue-600">{row.getValue<string>("_id")}</p>
//                     </div>
//                     <div className="text-right space-x-1">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => router.push(`/dashboard/contract/${row.getValue("_id")}`)}
//                         aria-label={`View details for contract ${row.getValue("_id")}`}
//                         className="hover:bg-blue-50 transition-colors"
//                       >
//                         View
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setContractToDelete(row.getValue("_id"));
//                           setIsDeleteDialogOpen(true);
//                         }}
//                         aria-label={`Delete contract ${row.getValue("_id")}`}
//                         className="hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 transition-colors"
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-600">Overall Score</p>
//                     <p>
//                       {(() => {
//                         const score = parseFloat(row.getValue<number>("overallScore").toString());
//                         const variant = score > 70 ? "default" : score < 50 ? "destructive" : "secondary";
//                         return (
//                           <Badge variant={variant} className="font-semibold text-xs">
//                             {score.toFixed(2)} Overall Score
//                           </Badge>
//                         );
//                       })()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-600">Contract Type</p>
//                     <p className="text-sm text-gray-700">{row.getValue<string>("contractType") || "Unknown"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-600">Created At</p>
//                     <p className="text-sm text-gray-600">
//                       {new Date(row.getValue<Date>("createdAt")).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {contracts.length === 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500 font-medium">No contracts found.</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Pagination Controls */}
//       {contracts && contracts.length > 0 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4 sm:py-6 bg-white rounded-xl shadow-lg px-4 sm:px-6 w-full">
//           <div className="flex items-center space-x-2">
//             <p className="text-xs sm:text-sm text-gray-600 font-medium">
//               Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//             </p>
//             <Select
//               value={pageSize.toString()}
//               onValueChange={(value: string) => {
//                 table.setPageSize(Number(value));
//               }}
//             >
//               <SelectTrigger className="w-[100px] sm:w-[120px] border-gray-300 focus:ring-blue-500 text-xs sm:text-sm">
//                 <SelectValue placeholder="Rows per page" />
//               </SelectTrigger>
//               <SelectContent>
//                 {[5, 10, 20, 50].map((size) => (
//                   <SelectItem key={size} value={size.toString()}>
//                     {size} rows
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center space-x-2">
//             {/* Hide "Go to page" input on mobile */}
//             <div className="hidden sm:flex items-center space-x-2">
//               <Input
//                 type="number"
//                 placeholder="Go to page"
//                 value={goToPage}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoToPage(e.target.value)}
//                 className="w-20 sm:w-24 border-gray-300 focus:ring-blue-500 text-xs sm:text-sm"
//                 min="1"
//                 max={table.getPageCount()}
//               />
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleGoToPage}
//                 disabled={!goToPage || parseInt(goToPage) > table.getPageCount() || parseInt(goToPage) < 1}
//                 className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
//               >
//                 Go
//               </Button>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//               aria-label="Go to previous page"
//               className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
//             >
//               <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span className="ml-1 hidden sm:inline">Previous</span>
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//               aria-label="Go to next page"
//               className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
//             >
//               <span className="mr-1 hidden sm:inline">Next</span>
//               <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] w-[90vw]">
//           <DialogHeader>
//             <DialogTitle className="text-lg sm:text-xl">Delete Contract</DialogTitle>
//             <DialogDescription className="text-sm sm:text-base">
//               Are you sure you want to delete contract {contractToDelete}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsDeleteDialogOpen(false);
//                 setContractToDelete(null);
//               }}
//               className="w-full sm:w-auto"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => contractToDelete && handleDeleteContract(contractToDelete)}
//               className="w-full sm:w-auto"
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <UploadModal
//         isOpen={isUploadModalOpen}
//         onClose={() => setIsUploadModalOpen(false)}
//         onUploadComplete={handleUploadComplete}
//       />
//     </div>
//   );
// }

// async function fetchUserContracts(): Promise<IContractAnalysis[]> {
//   const response = await api.get("/contracts/user-contracts");
//   return response.data;
// }

import { api } from "@/lib/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { IContractAnalysis } from "@/interfaces/contract.interface";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { UploadModal } from "../modals/upload-modal";
import { Loader2, AlertCircle, FileText, AlertTriangle, Star, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";

export default function UserContracts() {
  const queryClient = useQueryClient();
  const { data: contracts, isLoading, error } = useQuery<IContractAnalysis[]>({
    queryKey: ["user-contracts"],
    queryFn: fetchUserContracts,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [goToPage, setGoToPage] = useState<string>("");

  const router = useRouter();

  // Mutation for deleting a contract
  const deleteContractMutation = useMutation({
    mutationFn: async (contractId: string) => {
      const response = await api.delete(`/contracts/${contractId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
      setIsDeleteDialogOpen(false);
      setContractToDelete(null);
      alert("Contract deleted successfully.");
    },
    onError: (err: any) => {
      console.error("Failed to delete contract:", err);
      alert(err.response?.data?.message || "Failed to delete contract. Please try again.");
    },
  });

  const columns: ColumnDef<IContractAnalysis>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by Contract ID ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
        >
          Contract ID
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">{row.getValue<string>("_id")}</div>
      ),
    },
    {
      accessorKey: "overallScore",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by Overall Score ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
        >
          Overall Score
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      ),
      cell: ({ row }) => {
        const score = parseFloat(row.getValue<number>("overallScore").toString());
        const variant = score > 70 ? "default" : score < 50 ? "destructive" : "secondary";
        return (
          <Badge variant={variant} className="font-semibold">
            {score.toFixed(2)} Overall Score
          </Badge>
        );
      },
    },
    {
      accessorKey: "contractType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by Contract Type ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
        >
          Contract Type
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue<string>("contractType") || "Unknown"}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by Created At ${column.getIsSorted() === "asc" ? "descending" : "ascending"}`}
        >
          Created At
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue<Date>("createdAt"));
        return <div className="text-gray-600">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/contract/${row.getValue("_id")}`)}
            aria-label={`View details for contract ${row.getValue("_id")}`}
            className="hover:bg-blue-50 transition-colors"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setContractToDelete(row.getValue("_id"));
              setIsDeleteDialogOpen(true);
            }}
            aria-label={`Delete contract ${row.getValue("_id")}`}
            className="hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 transition-colors"
            disabled={deleteContractMutation.isPending}
          >
            {deleteContractMutation.isPending && contractToDelete === row.getValue("_id") ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: contracts || [],
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalContracts = contracts?.length || 0;
  const averageScore =
    totalContracts > 0
      ? (contracts?.reduce((sum, contract) => sum + (contract.overallScore ?? 0), 0) ?? 0) / totalContracts
      : 0;
  const highRiskContracts = contracts?.filter((contract) => contract.overallScore < 50).length ?? 0;

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
    table.reset();
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (!isNaN(page) && page > 0 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
      setGoToPage("");
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full mx-0 bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Your Contracts
        </h1>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
        >
          <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> New Contract
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Contracts</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{totalContracts}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Average Score</CardTitle>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                averageScore > 70 ? "text-green-600" : averageScore < 50 ? "text-red-600" : "text-yellow-600"
              }`}
            >
              {averageScore.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">High Risk Contracts</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${highRiskContracts > 0 ? "text-red-600" : "text-green-600"}`}>
              {highRiskContracts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8 sm:py-12 animate-fade-in">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 sm:mt-3 text-gray-600 font-medium">Loading contracts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 sm:py-12 animate-fade-in">
          <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 mx-auto" />
          <p className="mt-2 sm:mt-3 text-red-500 font-medium">
            Error loading contracts: {(error as Error).message}
          </p>
          <Button
            variant="outline"
            className="mt-3 sm:mt-4 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["user-contracts"] })}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Table for Desktop / Stacked Cards for Mobile */}
      {contracts && (
        <>
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden sm:block rounded-xl border shadow-lg overflow-x-auto bg-white animate-slide-up w-full">
            <table className="w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 sm:px-6 sm:py-4 font-semibold" scope="col">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-t transition-all duration-300 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 animate-slide-up`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 sm:px-6 sm:py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {contracts.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 font-medium">No contracts found.</p>
              </div>
            )}
          </div>

          {/* Mobile Stacked View (hidden on desktop) */}
          <div className="block sm:hidden space-y-4 w-full">
            {table.getRowModel().rows.map((row, index) => (
              <div
                key={row.id}
                className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Contract ID</p>
                      <p className="text-sm font-medium text-blue-600">{row.getValue<string>("_id")}</p>
                    </div>
                    <div className="text-right space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/contract/${row.getValue("_id")}`)}
                        aria-label={`View details for contract ${row.getValue("_id")}`}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setContractToDelete(row.getValue("_id"));
                          setIsDeleteDialogOpen(true);
                        }}
                        aria-label={`Delete contract ${row.getValue("_id")}`}
                        className="hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 transition-colors"
                        disabled={deleteContractMutation.isPending}
                      >
                        {deleteContractMutation.isPending && contractToDelete === row.getValue("_id") ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Overall Score</p>
                    <p>
                      {(() => {
                        const score = parseFloat(row.getValue<number>("overallScore").toString());
                        const variant = score > 70 ? "default" : score < 50 ? "destructive" : "secondary";
                        return (
                          <Badge variant={variant} className="font-semibold text-xs">
                            {score.toFixed(2)} Overall Score
                          </Badge>
                        );
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Contract Type</p>
                    <p className="text-sm text-gray-700">{row.getValue<string>("contractType") || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Created At</p>
                    <p className="text-sm text-gray-600">
                      {new Date(row.getValue<Date>("createdAt")).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {contracts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">No contracts found.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {contracts && contracts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4 sm:py-6 bg-white rounded-xl shadow-lg px-4 sm:px-6 w-full">
          <div className="flex items-center space-x-2">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-[100px] sm:w-[120px] border-gray-300 focus:ring-blue-500 text-xs sm:text-sm">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Go to page"
                value={goToPage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoToPage(e.target.value)}
                className="w-20 sm:w-24 border-gray-300 focus:ring-blue-500 text-xs sm:text-sm"
                min="1"
                max={table.getPageCount()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToPage}
                disabled={!goToPage || parseInt(goToPage) > table.getPageCount() || parseInt(goToPage) < 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
              >
                Go
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="ml-1 hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
            >
              <span className="mr-1 hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Delete Contract</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete contract {contractToDelete}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setContractToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => contractToDelete && deleteContractMutation.mutate(contractToDelete)}
              className="w-full sm:w-auto"
              disabled={deleteContractMutation.isPending}
            >
              {deleteContractMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

async function fetchUserContracts(): Promise<IContractAnalysis[]> {
  const response = await api.get("/contracts/user-contracts");
  return response.data;
}