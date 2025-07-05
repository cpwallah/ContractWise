import  ContractResults from "./_components/contract-results";
interface IContractAnalysisResultsProps{
    params:{id:string};
}
export default function ContractPage({
    params:{id},

}:IContractAnalysisResultsProps){
    return <ContractResults contractId={id}/>
}