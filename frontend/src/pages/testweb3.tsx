import { Button, Box } from "@mui/material";
import { useGlobalClasses } from "../theme";
import { Layout } from "../components/Layout";
import dayjs from "dayjs";
import { useFetchJobs } from "../hooks/useFetchJobs";
import { useCreateJob } from "../hooks/useCreateJob";

const TestWeb3 = () => {
  const classes = useGlobalClasses();
  const { jobs } = useFetchJobs(true);

  const {
    isLeftValid,
    isRightValid,
    isLoading,
    isSuccess,
    transactionHash,
    deployJob,
    error,
    isError,
    prepareError,
    isPrepareError,
    fullFormula,
  } = useCreateJob({
    jobName: `Some job name`,
    leftFormula: "2 + 2",
    comparator: 0,
    rightFormula: "4",
    variableFeeds: [],
    activationTimestamp: 0,
    timeoutTimestamp: dayjs().add(1, "years").unix(),
    actionAddress: "0xA04BBF55fFcCac9Af713372dA77F7B0Ba2Ab4EF5", // broken action, should cause job revert
  });

  const add224 = async () => {
    await deployJob();
  };

  return (
    <Layout>
      <Box className={classes.container}>
        <Button variant="contained" onClick={add224}>
          Create a 2 + 2 = 4 job
        </Button>
      </Box>
      <hr />
      <Box className={classes.centeredRow}>
        <pre>
          {JSON.stringify(
            {
              isLeftValid,
              isRightValid,
              isLoading,
              isSuccess,
              transactionHash,
              error,
              isError,
              prepareError,
              isPrepareError,
              fullFormula,
            },
            null,
            2
          )}
        </pre>
      </Box>
      <hr />
      <Box className={classes.centeredRow}>
        <pre>{JSON.stringify(jobs, null, 2)}</pre>
      </Box>
    </Layout>
  );
};

export default TestWeb3;
