import { useEffect } from "react";
import { GlobalSpinner } from "../components/GlobalSpinner";
import { Layout } from "../components/Layout";
import { EComparator, useGlobalContext } from "../context/GlobalContext";
import { useCreateJob } from "../hooks/useCreateJob";
import { UmpireComparator } from "../utils/model";

const getComparator = (comparator: EComparator) => {
  switch (comparator) {
    case EComparator.EQUAL:
      return UmpireComparator.EQUAL;
    case EComparator.DIFFERENT_FROM:
      return UmpireComparator.NOT_EQUAL;
    case EComparator.GREATER_THAN:
      return UmpireComparator.GREATER_THAN;
    case EComparator.GREATER_THAN_EQUAL:
      return UmpireComparator.GREATER_THAN_EQUAL;
    case EComparator.LOWER_THAN:
      return UmpireComparator.LESS_THAN;
    case EComparator.LOWER_THAN_EQUAL:
      return UmpireComparator.LESS_THAN_EQUAL;
  }
};

const ProcessCreateJob = () => {
  const { createJob, setLoading } = useGlobalContext();

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
    jobName: createJob?.jobName!,
    leftFormula: createJob?.leftSide!,
    comparator: getComparator(createJob?.comparator!),
    rightFormula: createJob?.rightSide!,
    variableFeeds: [],
    activationTimestamp: createJob?.activationDate ?? 0,
    timeoutTimestamp: createJob?.deadlineDate!,
    actionAddress: createJob?.actionAddress!,
  });

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (isLeftValid && isRightValid) {
      console.log("Deploying job");
      deployJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeftValid, isRightValid]);

  useEffect(() => {
    console.error("Error", error);
  }, [error]);

  useEffect(() => {
    console.log("Transaction hash", transactionHash);
  }, [transactionHash]);

  return (
    <Layout>
      <GlobalSpinner />
    </Layout>
  );
};
export default ProcessCreateJob;
