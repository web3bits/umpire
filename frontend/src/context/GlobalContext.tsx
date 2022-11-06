import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface IUser {
  address: string;
  profileId: string;
  signature: string;
}

export enum EFormulaType {
  CRYPTO_USD = "Crypto/USD",
  EQUITIES = "Equities",
  FOREX = "Forex",
  COMMODITIES = "Commodities",
}

export enum EComparator {
  EQUAL = "=",
  GREATER_THAN_EQUAL = ">=",
  GREATER_THAN = ">",
  LOWER_THAN = "<",
  LOWER_THAN_EQUAL = "<=",
  DIFFERENT_FROM = "!=",
}
interface ICreateJob {
  formulaType?: EFormulaType;
  valuesFrom?: string[];
  valuesTo?: string[];
  leftSide?: string;
  comparator?: EComparator;
  rightSide?: string;
  jobName?: string;
  jobId?: string;
  actionAddress?: string;
  activationDate?: number;
  deadlineDate?: number;
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
};

export const GlobalContext: Context<IGlobalContext> =
  createContext<IGlobalContext>(defaultGlobalContext);

// @ts-ignore
export const GlobalContextProvider: React.FC = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [user, setUser] = useState<IUser | undefined>();
  const [signInError, setSignInError] = useState(false);
  const [createJob, setCreateJob] = useState<ICreateJob | null>(null);
  const [createJobStepNumber, setCreateJobStepNumber] = useState<number>(0);
  return (
    <GlobalContext.Provider
      value={{
        isLoading,
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
