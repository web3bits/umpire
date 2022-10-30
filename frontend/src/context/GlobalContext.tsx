import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum NotificationType {
  ERROR,
  WARNING,
  INFO,
  SUCCESS,
}

export interface SystemNotification {
  id: string;
  message: string;
  header?: string;
  type: NotificationType;
  keepOpen: boolean;
}

interface IGlobalContext {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;
  addNotification: (
    type: NotificationType,
    message: string,
    header?: string
  ) => void;
  closeNotification: (id: string) => void;
  notifications: SystemNotification[];
}

export const defaultGlobalContext: IGlobalContext = {
  isLoading: false,
  setLoading: () => {},
  loadingMessage: "",
  setLoadingMessage: () => {},
  addNotification: () => {},
  closeNotification: () => {},
  notifications: [],
};

export const GlobalContext =
  createContext<IGlobalContext>(defaultGlobalContext);

// @ts-ignore
export const GlobalContextProvider: React.FC = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  /*const {
    user,
    isWeb3Enabled,
    isWeb3EnableLoading,
    isInitialized,
    isInitializing,
    isAuthenticated,
    isAuthenticating,
  } = useMoralis();*/

  const addNotification = (
    type: NotificationType,
    message: string,
    header?: string,
    keepOpen = false
  ) => {
    const newNotification: SystemNotification = {
      id: uuidv4(),
      type,
      message,
      header,
      keepOpen,
    };
    setNotifications([...notifications, newNotification]);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const closeNotification = (id: string) => {
    const notificationToDelete = notifications.find(
      (n: SystemNotification) => n.id === id
    );
    if (!notificationToDelete) {
      return;
    }
    const notificationIdx = notifications.indexOf(notificationToDelete);
    if (notificationIdx > -1) {
      const notificationsCopy = [...notifications];
      notificationsCopy.splice(notificationIdx, 1);
      setNotifications(notificationsCopy);
    }
  };

  // const handleMoralisError = (err: string[] | Error | any) => {
  //   if (Array.isArray(err)) {
  //     err = err[0];
  //   }

  //   addNotification(
  //     NotificationType.ERROR,
  //     err?.message || err?.error || "" + err
  //   );
  //   setEthBalanceReady(true);
  // };

  // const handleMoralisSuccess = (data: any) => {
  //   setEthBalance(data);
  //   setEthBalanceReady(true);
  // };

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingMessage,
        setLoadingMessage,
        addNotification,
        closeNotification,
        notifications,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
