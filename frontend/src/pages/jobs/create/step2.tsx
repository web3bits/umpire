import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { UmpireList } from "../../../components/ui/UmpireList";
import { UmpireTabs } from "../../../components/ui/UmpireTabs";
import {
  EVariableType,
  useGlobalContext,
} from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import ItemsSelected from "./ItemsSelected";
import {
  POLYGON_MUMBAI_COMMODITIES_ITEMS,
  POLYGON_MUMBAI_CRYPTO_ITEMS,
  POLYGON_MUMBAI_EQUITIES_ITEMS,
  POLYGON_MUMBAI_FOREX_ITEMS,
  POLYGON_MUMBAI_META,
} from "../../../constants/polygon-mumbai";
import { UmpireVariable } from "../../../utils/model";

const useCreateJobStep2 = (classes: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const [variableFeeds, setVariableFeeds] = useState<UmpireVariable[]>([]);
  const [listItems, setListItems] = useState<any[]>([]);

  const router = useRouter();
  const { setCreateJobStepNumber, createJob, setCreateJob } =
    useGlobalContext();
  const nextStep = () => {
    setCreateJobStepNumber(2);
    setCreateJob({
      variableFeeds,
    });
    router.push("/jobs/create/step3");
  };

  const setListContent = (): void => {
    switch (activeTab) {
      case 0:
        setListItems(POLYGON_MUMBAI_CRYPTO_ITEMS);
        break;
      case 1:
        setListItems(POLYGON_MUMBAI_EQUITIES_ITEMS);
        break;
      case 2:
        setListItems(POLYGON_MUMBAI_FOREX_ITEMS);
        break;
      case 3:
        setListItems(POLYGON_MUMBAI_COMMODITIES_ITEMS);
        break;
      case 4:
        setListItems(POLYGON_MUMBAI_META);
      default:
    }
  };

  useEffect(() => {
    setListContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setListContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return {
    nextStep,
    activeTab,
    setActiveTab,
    variableFeeds,
    listItems,
    setVariableFeeds,
  };
};

const TABS = [
  EVariableType.CRYPTO_USD,
  EVariableType.EQUITIES,
  EVariableType.FOREX,
  EVariableType.COMMODITIES,
  EVariableType.META,
];
const CreateJobStep2 = () => {
  const classes = useGlobalClasses();
  const {
    nextStep,
    activeTab,
    setActiveTab,
    variableFeeds,
    listItems,
    setVariableFeeds,
  } = useCreateJobStep2(classes);

  const renderContent = () => {
    return (
      <Box className={classes.centeredRow}>
        <UmpireList
          listId="listFrom"
          listItems={listItems}
          setOptionsSelected={setVariableFeeds}
          selected={variableFeeds}
          disabled={false}
        />
      </Box>
    );
  };
  const renderContents = () => {
    const contents: (JSX.Element | null)[] = [null, null, null, null];
    contents[activeTab] = renderContent();
    return contents;
  };
  return (
    <Layout>
      <Box className={`${classes.centeredRow} ${classes.mt3}`}>
        <Typography variant="h4">Step 2 - select input variables</Typography>
      </Box>
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body1">
          In the formula that triggers positive action of your job, you can use
          variables provided by hyper-reliable Chainlink&apos;s Decentralized Oracle
          Networks. The selection below is limited to feeds available on Polygon
          Mumbai testnet.
        </Typography>
      </Box>
      <Box className={classes.centeredRow}>
        <UmpireTabs
          id="create-job-tabs"
          tabs={TABS}
          contents={renderContents()}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </Box>
      <Box className={classes.mt2}>
        <Typography variant="h6">
          List of input variables you&apos;ll be able to use in your formula:
        </Typography>
        <ItemsSelected variableFeeds={variableFeeds} />
      </Box>
      <Box className={classes.centeredRow}>
        <Button onClick={nextStep} disabled={false} className="pink">
          Next Step
        </Button>
      </Box>
      <Box className={classes.centeredRow}></Box>
    </Layout>
  );
};

export default CreateJobStep2;
