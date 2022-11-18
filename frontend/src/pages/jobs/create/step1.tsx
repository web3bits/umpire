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
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body1">
          To create a new job, first make sure your action is ready and
          deployed. An action is a contract that Umpire Registry is going to
          call when a job is finalized. If the formula defined in the job
          evaluates as true before the deadline, the{" "}
          <strong>positive action</strong> will be called. If the condition is
          not met before the job deadline is reached, the{" "}
          <strong>negative action</strong> will be called.
        </Typography>
      </Box>
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body1">
          Make sure your action inherits the{" "}
          <a
            href="https://github.com/web3bits/umpire/blob/main/contracts/contracts/UmpireActionInterface.sol"
            target="_blank"
            rel="noreferrer"
          >
            UmpireActionInterface
          </a>{" "}
          or the more convenient{" "}
          <a
            href="https://github.com/web3bits/umpire/blob/main/contracts/contracts/AbstractUmpireAction.sol"
            target="_blank"
            rel="noreferrer"
          >
            AbstractUmpireAction
          </a>{" "}
          contract. Please note, if your contract action throws an error
          (reverts), the job will finalize with a REVERTED status! Additionally,
          if the gas limit is exceeded, the action will not be executed, so make
          sure it&apos;s lean.
        </Typography>
      </Box>
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body1">
          A typical use case for Umpire would be to create a&quot;Put Your Money
          Where Your Mouth Is&quot; job, which is a basic betting contract. For
          example, you could deploy PYMWYMI action contract with a formula being
          an equivalent of saying:{" "}
          <em>
            &quot;I bet [BTC/USD] price will be greater than $18,000 on December 1st&quot;
          </em>
          ; if the price reaches that point before the deadline, everyone who
          put a &quot;positive&quot; bet wins an amount proportional to their share of all
          positive bets. Otherwise, those who bet on the negative action win.{" "}
          <a
            href="https://github.com/web3bits/umpire/blob/main/contracts/contracts/examples/PYMWYMI.sol"
            target="_blank"
            rel="noreferrer"
          >
            Click here
          </a>{" "}
          to view the source code of PYMWYMI action smart contract. Feel free to
          use it (Umpire is open source and on MIT license!), but beware, it has
          not been audited and may contain security holes!
        </Typography>
      </Box>
      <Box className={classes.centeredRow}>
        <Button className="pink" onClick={nextStep}>
          My action is deployed to Polygon Mumbai, take me to the next step
        </Button>
      </Box>
    </Layout>
  );
};

export default CreateJobStep1;
