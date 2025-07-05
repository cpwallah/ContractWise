// import  ContractResults from "./_components/contract-results";
// interface IContractAnalysisResultsProps{
//     params:{id:string};
// }
// export default function ContractPage({
//     params:{id},

// }:IContractAnalysisResultsProps){
//     return <ContractResults contractId={id}/>
// }



import ContractResults from "./_components/contract-results";

interface IContractAnalysisResultsProps {
  params: Promise<{ id: string }>; // Use Promise for params
}

export default async function ContractPage({
  params,
}: IContractAnalysisResultsProps) {
  const { id } = await params; // Await the params to get the id
  return <ContractResults contractId={id} />;
}