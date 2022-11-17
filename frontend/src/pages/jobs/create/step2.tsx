import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { UmpireList } from "../../../components/ui/UmpireList";
import { UmpireTabs } from "../../../components/ui/UmpireTabs";
import {
  COMMODITIES_ITEMS,
  CRYPTO_ITEMS,
  EQUITIES_ITEMS,
  FOREX_ITEMS,
} from "../../../constants";
import { EFormulaType, useGlobalContext } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import ItemsSelected from "./ItemsSelected";
const useCreateJobStep2 = (classes: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [listItems, setListItems] = useState<any[]>([]);

  const router = useRouter();
  const { setCreateJob } =
    useGlobalContext();
  const nextStep = () => {
    setCreateJob({
      values: selectedValues,
    });
    router.push("/jobs/create/step3");
  };

  const setListContent = (): void => {
    switch (activeTab) {
      case 0:
        setListItems(CRYPTO_ITEMS);
        break;
      case 1:
        setListItems(EQUITIES_ITEMS);
        break;
      case 2:
        setListItems(FOREX_ITEMS);
        break;
      case 3:
        setListItems(COMMODITIES_ITEMS);
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
    selectedValues,
    listItems,
    setSelectedValues,
  };
};

const TABS = [
  EFormulaType.CRYPTO_USD,
  EFormulaType.EQUITIES,
  EFormulaType.FOREX,
  EFormulaType.COMMODITIES,
];
const CreateJobStep2 = () => {
  const classes = useGlobalClasses();
  const {
    nextStep,
    activeTab,
    setActiveTab,
    selectedValues,
    listItems,
    setSelectedValues,
  } = useCreateJobStep2(classes);

  const renderContent = () => {
    return (
      <Box className={classes.centeredRow}>
        <UmpireList
          listId="listFrom"
          listItems={listItems}
          setOptionsSelected={setSelectedValues}
          selected={selectedValues}
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
      <Box className={classes.centeredRow}>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
          est maiores dicta dolore aspernatur iusto quisquam, sequi eaque
          aliquam quaerat. quasi.
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
        <Typography variant="h6">List of values selected</Typography>
        <ItemsSelected selectedValues={selectedValues} />
      </Box>
      <Box className={classes.centeredRow}>
        <Button
          onClick={nextStep}
          disabled={false}
          className="pink"
        >
          Next Step
        </Button>
      </Box>
      <Box className={classes.centeredRow}></Box>
    </Layout>
  );
};

export default CreateJobStep2;
