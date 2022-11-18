import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useNetwork } from "wagmi";
import { UmpireVariable } from "../utils/model";

interface IUser {
  address: string;
  profileId: string;
  signature: string;
}

export enum EUmpireJobStatus {
  NEW = "NEW",
  POSITIVE = "POSITIVE",
  REVERTED = "REVERTED",
  NEGATIVE = "NEGATIVE",
}

export enum EVariableType {
  CRYPTO_USD = "Crypto/USD",
  EQUITIES = "Equities",
  FOREX = "Forex",
  COMMODITIES = "Commodities",
  META = "Metadata",
}

export enum EComparator {
  EQUAL = "=",
  GREATER_THAN_EQUAL = ">=",
  GREATER_THAN = ">",
  LOWER_THAN = "<",
  LOWER_THAN_EQUAL = "<=",
  DIFFERENT_FROM = "!=",
}

export interface ICreateJob {
  formulaType?: EVariableType;
  variableFeeds?: UmpireVariable[];
  leftFormula?: string;
  comparator?: EComparator;
  rightFormula?: string;
  jobName?: string;
  jobId?: string;
  actionAddress?: string;
  activationTimestamp?: number;
  timeoutTimestamp?: number;
  status?: EUmpireJobStatus;
  dateCreated?: number;
}

interface IGlobalContext {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
  signInError: boolean;
  setSignInError: (signInError: boolean) => void;
  createJob: ICreateJob | null;
  setCreateJobStepNumber: (createJobStepNumber: number) => void;
  createJobStepNumber: number;
  setCreateJob: (createJob: ICreateJob) => void;
  jobs: ICreateJob[];
  addJob: (job: ICreateJob) => void;
}

export const defaultGlobalContext: IGlobalContext = {
  isLoading: false,
  setLoading: () => {},
  loadingMessage: "",
  setLoadingMessage: () => {},
  user: undefined,
  setUser: () => {},
  signInError: false,
  setSignInError: () => {},
  createJob: null,
  setCreateJobStepNumber: () => {},
  createJobStepNumber: 0,
  setCreateJob: () => {},
  jobs: [],
  addJob: () => {},
};

export const GlobalContext: Context<IGlobalContext> =
  createContext<IGlobalContext>(defaultGlobalContext);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { chain } = useNetwork();
  const { isConnecting, isReconnecting, isConnected } = useAccount();
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(false);
  useEffect(() => {
    const isSupportedNetwork = chain?.network === "maticmum";
    setIsSupportedNetwork(isSupportedNetwork);
  }, [chain]);

  useEffect(() => {
    if (isConnected && !isSupportedNetwork) {
      setLoading(true);
      setLoadingMessage("Please switch to a Polygon Mumbai testnet account");
    } else {
      setLoading(false);
      setLoadingMessage("");
    }
  }, [isConnected, isSupportedNetwork]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [user, setUser] = useState<IUser | undefined>();
  const [signInError, setSignInError] = useState(false);
  const [createJob, setCreateJob] = useState<ICreateJob | null>(null);
  const [createJobStepNumber, setCreateJobStepNumber] = useState<number>(0);
  const [jobs, setJobs] = useState<ICreateJob[]>([]);
  const addJob = (job: ICreateJob) => {
    const newJobs = [...jobs];
    newJobs.push(job);
    setJobs(newJobs);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoading: isLoading || isConnecting || isReconnecting,
        setLoading,
        loadingMessage,
        setLoadingMessage,
        user,
        setUser,
        signInError,
        setSignInError,
        createJob,
        createJobStepNumber,
        setCreateJobStepNumber,
        setCreateJob,
        jobs,
        addJob,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
