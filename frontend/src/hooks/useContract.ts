import Moralis from "moralis";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { factoryAddress } from "../utils";

interface IUseContract {
  handleSuccess: () => void;
  handleError: (error: any) => void;
  functionName: string;
  params: any;
  abi: any;
}

export const useContract = ({
  handleSuccess,
  handleError,
  functionName,
  params,
  abi,
}: IUseContract) => {
  const { setLoading, setLoadingMessage } = useGlobalContext();
  const [result, setResult] = useState<any>();
  const handleMoralisSuccess = () => {
    setResult({}); // TODO: Replace with result;
    handleSuccess();
  };

  const handleMoralisError = (error: any) => {
    console.error(error);
    setResult(undefined);
    handleError(error);
  };

  useEffect(() => {
    const runContract = async () => {
      const options = {
        contractAddress: factoryAddress,
        abi,
        functionName,
        params,
      };
      try {
        const tx = await (Moralis as any).executeFunction(options);
        setLoadingMessage("Waiting for transaction confirmation...");
        await tx.wait(1);
        handleMoralisSuccess();
      } catch (e: any) {
        handleMoralisError(e);
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };
    runContract();
  });
  return { result };
};
