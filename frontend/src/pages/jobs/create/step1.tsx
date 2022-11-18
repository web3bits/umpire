import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import { useGlobalClasses } from "../../../theme";

const useCreateJobStep1 = () => {
  const router = useRouter();
  const nextStep = () => {
    router.push("/jobs/create/step2");
  };
  return { nextStep };
};

const CreateJobStep1 = () => {
  const classes = useGlobalClasses();
  const { nextStep } = useCreateJobStep1();
  return (
    <Layout>
      <Box className={`${classes.centeredRow} ${classes.mt3}`}>
        <Typography variant="h4">Step 1 - create an action contract</Typography>
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Typography variant="h5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
          est maiores dicta dolore aspernatur iusto quisquam, sequi eaque
          aliquam quaerat. Ea minima impedit explicabo sint, corrupti amet a at
          quasi.
        </Typography>
      </Box>
      <Box className={classes.centeredRow}>
        <Typography variant="h6">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.{" "}
        </Typography>
      </Box>
      <Box className={classes.centeredRow}>
        <Button
          className="pink"
          onClick={nextStep}>
          Next Step
        </Button>
      </Box>
    </Layout>
  );
};

export default CreateJobStep1;
