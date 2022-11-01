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

interface IGlobalContext {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
  signInError: boolean;
  setSignInError: (signInError: boolean) => void;
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
};

export const GlobalContext: Context<IGlobalContext> =
  createContext<IGlobalContext>(defaultGlobalContext);

// @ts-ignore
export const GlobalContextProvider: React.FC = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [user, setUser] = useState<IUser | undefined>();
  const [signInError, setSignInError] = useState(false);
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
