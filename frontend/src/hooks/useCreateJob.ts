import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";
import { registryAddress } from "../utils";
import UmpireRegistry from "../artifacts/contracts/UmpireRegistry.sol/UmpireRegistry.json";
import { infixToPostfix } from "../utils/formulas";
import {
  comparatorToString,
  postfixNodeToTuple,
  PostfixNodeTuple,
  UmpireComparator,
} from "../utils/model";
import { isAddress } from "ethers/lib/utils";

export interface IUseCreateJobProps {
  jobName: string;
  leftFormula: string;
  comparator: UmpireComparator;
  rightFormula: string;
  variableFeeds: string[];
  activationTimestamp: number;
  timeoutTimestamp: number;
  actionAddress: string;
}

export interface IUseCreateJob {
  isLeftValid: boolean;
  isRightValid: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  transactionHash: string | undefined;
  deployJob: () => Promise<void>;
  error: Error | null;
  isError: boolean;
  prepareError: Error | null;
  isPrepareError: boolean;
  fullFormula: string;
}

export const useCreateJob = ({
  jobName,
  leftFormula,
  comparator,
  rightFormula,
  variableFeeds,
  activationTimestamp,
  timeoutTimestamp,
  actionAddress,
}: IUseCreateJobProps): IUseCreateJob => {
  const [isLeftValid, setLeftValid] = useState<boolean>(false);
  const [isRightValid, setRightValid] = useState<boolean>(false);

  const [leftAsTuples, setLeftAsTuples] = useState<PostfixNodeTuple[]>([]);
  const [rightAsTuples, setRightAsTuples] = useState<PostfixNodeTuple[]>([]);

  const [fullFormula, setFullFormula] = useState<string>("");

  useEffect(() => {
    try {
      const left = infixToPostfix(leftFormula);
      setLeftAsTuples(left.map(postfixNodeToTuple));
      setLeftValid(true);
    } catch (e: any) {
      console.log(e);
      setLeftValid(false);
    }

    try {
      const right = infixToPostfix(rightFormula);
      setRightAsTuples(right.map(postfixNodeToTuple));
      setRightValid(true);
    } catch (e: any) {
      console.log(e);
      setLeftValid(false);
    }

    setFullFormula(
      `${leftFormula} ${comparatorToString(comparator)} ${rightFormula}`
    );
  }, [leftFormula, rightFormula, comparator]);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: registryAddress,
    abi: UmpireRegistry.abi,
    functionName: "createJobFromNodes",
    enabled:
      isLeftValid &&
      isRightValid &&
      isAddress(actionAddress) &&
      (timeoutTimestamp ?? 0) > 0,
    args: [
      jobName,
      leftAsTuples,
      comparator,
      rightAsTuples,
      variableFeeds,
      activationTimestamp,
      timeoutTimestamp,
      actionAddress,
    ],
  });

  useEffect(() => {
    console.log({
      jobName,
      leftAsTuples,
      comparator,
      rightAsTuples,
      variableFeeds,
      activationTimestamp,
      timeoutTimestamp,
      actionAddress,
    });
  }, [
    jobName,
    leftAsTuples,
    comparator,
    rightAsTuples,
    variableFeeds,
    activationTimestamp,
    timeoutTimestamp,
    actionAddress,
  ]);

  const {
    data,
    error,
    isError,
    write,
    // @ts-ignore
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const deployJob = async () => {
    if (!isLeftValid || !isRightValid) {
      console.error("Invalid formulas");
      return;
    }

    await write?.();
  };

  return {
    isLeftValid,
    isRightValid,
    isLoading,
    isSuccess,
    transactionHash: data?.hash,
    deployJob,
    error,
    isError,
    prepareError,
    isPrepareError,
    fullFormula,
  };
};
