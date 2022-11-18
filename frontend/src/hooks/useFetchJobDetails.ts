import { useContractRead } from "wagmi";
import { useGlobalContext } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import { registryAddress } from "../utils";
import UmpireRegistry from "../artifacts/contracts/UmpireRegistry.sol/UmpireRegistry.json";
import { tupleToJob, UmpireJob } from "../utils/model";

export const useFetchJobDetails = (jobId: any, autoFetch = true) => {
  const { setLoading } = useGlobalContext();
  const [job, setJob] = useState<UmpireJob | undefined>();
  const { data, refetch, isLoading, error, isFetching } = useContractRead({
    address: registryAddress,
    abi: UmpireRegistry.abi,
    functionName: "s_jobs",
    enabled: autoFetch,
    args: [jobId],
    onError: () => {
      setJob(undefined);
    },
    onSuccess: (data: unknown) => {
      console.log(data);
    },
  });
  useEffect(() => {
    if (isLoading || isFetching) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading, isFetching]);

  return {
    job,
    rawData: data,
    isLoading,
    isFetching,
    error,
    fetch: refetch,
  };
};
