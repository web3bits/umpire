import { useAccount, useContractRead } from "wagmi";
import { useGlobalContext } from "../context/GlobalContext";
import { useState } from "react";
import { registryAddress } from "../utils";
import UmpireRegistry from "../artifacts/contracts/UmpireRegistry.sol/UmpireRegistry.json";
import { tupleToJob, UmpireJob } from "../utils/model";

export const useFetchJobs = (autoFetch = false) => {
  const { address } = useAccount();
  const { setLoading } = useGlobalContext();
  const [jobs, setJobs] = useState<UmpireJob[]>([]);
  const { data, refetch, isLoading, error } = useContractRead({
    address: registryAddress,
    abi: UmpireRegistry.abi,
    functionName: "getJobsByOwner",
    enabled: autoFetch,
    args: [address],
    onError: () => {
      setJobs([]);
    },
    onSuccess: (data) => {
      if (!Array.isArray(data) || data.length < 1) {
        setJobs([]);
      } else {
        setJobs(data.map((row) => tupleToJob(row)));
      }
    },
  });

  const fetchMyJobs = async () => {
    setLoading(true);
    await refetch();
    setLoading(false);
  };

  return {
    jobs,
    rawData: data,
    isLoading,
    error,
    fetchMyJobs,
  };
};
