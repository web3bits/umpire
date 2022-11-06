import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { UmpireList } from "../../../components/ui/UmpireList";
import UmpireStepper from "../../../components/ui/UmpireStepper";
import { UmpireTabs } from "../../../components/ui/UmpireTabs";
import {
  COMMODITIES_ITEMS,
  CRYPTO_ITEMS,
  EQUITIES_ITEMS,
  FOREX_ITEMS,
  STEPS,
  STEP_NAVIGATION,
} from "../../../constants";
import { EFormulaType, useGlobalContext } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import { ItemsSelected } from "./ItemsSelected";
const useCreateJobStep2 = (classes: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const [leftSideValuesSelected, setLeftSideValuesSelected] = useState<
    string[]
  >([]);
  const [rightSideValuesSelected, setRightSideValuesSelected] = useState<
    string[]
  >([]);
  const [listItems, setListItems] = useState<any[]>([]);

  const router = useRouter();
  const { setCreateJobStepNumber } = useGlobalContext();
  const nextStep = () => {
    setCreateJobStepNumber(2);
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
    setCreateJobStepNumber,
    nextStep,
    activeTab,
    setActiveTab,
    leftSideValuesSelected,
    listItems,
    setLeftSideValuesSelected,
    rightSideValuesSelected,
    setRightSideValuesSelected,
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
    setCreateJobStepNumber,
    nextStep,
    activeTab,
    setActiveTab,
    leftSideValuesSelected,
    listItems,
    setLeftSideValuesSelected,
    rightSideValuesSelected,
    setRightSideValuesSelected,
  } = useCreateJobStep2(classes);

  const renderContent = () => {
    return (
      <Box className={classes.centeredRow}>
        <UmpireList
          listId="listFrom"
          listItems={listItems}
          setOptionsSelected={setLeftSideValuesSelected}
          selected={leftSideValuesSelected}
          disabled={
            leftSideValuesSelected.length > rightSideValuesSelected.length
          }
        />
        <UmpireList
          listId="listTo"
          listItems={listItems}
          setOptionsSelected={setRightSideValuesSelected}
          selected={rightSideValuesSelected}
          disabled={
            leftSideValuesSelected.length === rightSideValuesSelected.length
          }
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
      <Box className={classes.centeredRow}>
        <UmpireStepper
          stepNumber={1}
          steps={STEPS}
          setStepNumber={setCreateJobStepNumber}
          stepNavigation={STEP_NAVIGATION}
        />
      </Box>
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
        <ItemsSelected
          leftSideValuesSelected={leftSideValuesSelected}
          rightSideValuesSelected={rightSideValuesSelected}
        />
      </Box>
      <Box className={classes.centeredRow}>
        <Button
          variant="outlined"
          color="primary"
          onClick={nextStep}
          disabled={
            leftSideValuesSelected.length === 0 ||
            leftSideValuesSelected.length !== rightSideValuesSelected.length
          }
        >
          Next Step
        </Button>
      </Box>
      <Box className={classes.centeredRow}></Box>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session?.user ?? null },
  };
}

export default CreateJobStep2;