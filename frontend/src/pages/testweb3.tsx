import { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { useGlobalClasses } from "../theme";
import { Layout } from "../components/Layout";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useGlobalContext } from "../context/GlobalContext";
import { ADDRESS_ZERO, registryAddress } from "../utils";
import UmpireRegistry from "../artifacts/contracts/UmpireRegistry.sol/UmpireRegistry.json";
import dayjs from "dayjs";

const TestWeb3 = () => {
  const classes = useGlobalClasses();
  const { address } = useAccount();
  const { setLoading } = useGlobalContext();
  const [readRawResult, setReadRawResult] = useState<any>();
  const [writeRawResult, setWriteRawResult] = useState<any>();
  const { data: resultFetchJobs, refetch: fetchJobs } = useContractRead({
    address: registryAddress,
    abi: UmpireRegistry.abi,
    functionName: "getJobsByOwner",
    enabled: false,
    args: [address],
  });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: registryAddress,
    abi: UmpireRegistry.abi,
    functionName: "createJobFromNodes",
    args: [
      "Some job name", // name
      [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 2, 0, 0],
      ], // left
      0, // comparator
      [[4, 0, 0, 0]], // right
      [], // variables
      0,
      dayjs().add(1, "years").unix(),
      "0xA04BBF55fFcCac9Af713372dA77F7B0Ba2Ab4EF5",
    ],
    enabled: true,
  });

  const {
    data: resultAddJob,
    error,
    isError,
    write,
    // @ts-ignore
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: resultAddJob?.hash,
  });

  const fetchMyJobs = async () => {
    setLoading(true);
    const x = await fetchJobs();
    console.log(x);
    setReadRawResult(x);
    setLoading(false);
  };
  const runCalculation = async () => {
    setLoading(true);
    // @ts-ignore
    const x = await write();
    console.log(x);
    setWriteRawResult(x);
    setLoading(false);
  };

  return (
    <Layout>
      <Box className={classes.container}>
        <Box className={classes.centeredRow}>
          <Button variant="outlined" onClick={fetchMyJobs}>
            Fetch my jobs
          </Button>
        </Box>
        <Box className={classes.centeredRow}>
          <pre>
            {JSON.stringify({ readRawResult, resultFetchJobs }, null, 2)}
          </pre>
        </Box>
        <hr />
        <Box className={classes.centeredRow}>
          <Button variant="outlined" onClick={runCalculation}>
            Create a `2 + 2 = 4` job
          </Button>
        </Box>
        <Box className={classes.centeredRow}>
          <pre>
            {JSON.stringify(
              {
                writeRawResult,
                resultAddJob,
                prepareError,
                isPrepareError,
                error,
                isError,
                isLoading,
                isSuccess,
              },
              null,
              2
            )}
          </pre>
        </Box>
        <hr />
      </Box>
    </Layout>
  );
};

export default TestWeb3;
