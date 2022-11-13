import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../../components/Layout";
import UmpireStepper from "../../../components/ui/UmpireStepper";
import { STEPS, STEP_NAVIGATION } from "../../../constants";
import {
  EUmpireJobStatus,
  ICreateJob,
  useGlobalContext,
} from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { v4 as uuidv4 } from "uuid";
const useCreateJobStep4 = () => {
  const router = useRouter();
  const { setCreateJobStepNumber, createJob, setCreateJob, addJob } =
    useGlobalContext();
  const [activationDate, setActivationDate] = useState<Dayjs | null>(null);
  const [deadlineDate, setDeadlineDate] = useState<Dayjs | null>(null);
  const [useActivationDate, setUseActivationDate] = useState(false);
  const [jobName, setJobName] = useState("");
  const [actionAddress, setActionAddress] = useState("");

  const nextStep = () => {
    router.push("/jobs/list");
  };

  const handleSetJobName = (event: any) => {
    setJobName(event.target.value);
  };

  const handleSetActionAddress = (event: any) => {
    setActionAddress(event.target.value);
  };

  const handleUseActivationDateChange = (event: any) => {
    setUseActivationDate(event.target.checked);
  };

  const handleDeadlineDateChange = (event: any) => {
    const deadlineDate = `${event.$M + 1}/${event.$D}/${event.$y} ${event.$H}:${
      event.$m
    }`;
    setDeadlineDate(dayjs(deadlineDate));
  };

  const handleActivationDateChange = (event: any) => {
    const activationDate = `${event.$M + 1}/${event.$D}/${event.$y} ${
      event.$H
    }:${event.$m}`;
    setActivationDate(dayjs(activationDate));
  };

  const finishAndDeploy = () => {
    //TODO call smart contract
    const job: ICreateJob = {
      ...createJob,
      jobId: uuidv4(),
      jobName,
      actionAddress,
      activationDate: activationDate?.unix() ?? undefined,
      deadlineDate: deadlineDate?.unix() ?? undefined,
      status: EUmpireJobStatus.NEW,
      dateCreated: dayjs().unix(),
    };
    setCreateJob(job);
    //TODO to be removed once smart contract call is implemented
    addJob(job);
    nextStep();
  };
  return {
    setCreateJobStepNumber,
    nextStep,
    createJob,
    actionAddress,
    handleSetActionAddress,
    jobName,
    handleSetJobName,
    useActivationDate,
    handleUseActivationDateChange,
    activationDate,
    setActivationDate,
    deadlineDate,
    setDeadlineDate,
    handleDeadlineDateChange,
    handleActivationDateChange,
    missingData:
      jobName?.trim().length === 0 ||
      actionAddress?.trim().length === 0 ||
      !deadlineDate ||
      (useActivationDate && !activationDate),
    finishAndDeploy,
  };
};

const CreateJobStep4 = () => {
  const classes = useGlobalClasses();
  const {
    setCreateJobStepNumber,
    nextStep,
    createJob,
    jobName,
    handleSetJobName,
    actionAddress,
    handleSetActionAddress,
    useActivationDate,
    activationDate,
    handleUseActivationDateChange,
    deadlineDate,
    handleActivationDateChange,
    handleDeadlineDateChange,
    missingData,
    finishAndDeploy,
  } = useCreateJobStep4();
  const { leftSide, comparator, rightSide } = createJob ?? {};

  const renderDeadlinePicker = () => {
    return (
      <DateTimePicker
        label="Deadline date & time"
        value={deadlineDate}
        onChange={handleDeadlineDateChange}
        renderInput={(params) => <TextField {...params} />}
        disablePast={true}
        minDateTime={activationDate}
      />
    );
  };

  const renderPickers = () => {
    if (!useActivationDate) {
      return (
        <Box className={`${classes.mt2}`}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {renderDeadlinePicker()}
          </LocalizationProvider>
        </Box>
      );
    }
    return (
      <Box className={`${classes.mt2} ${classes.activationDateRow}`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Activation date & time"
            value={activationDate}
            onChange={handleActivationDateChange}
            renderInput={(params) => <TextField {...params} />}
            disablePast={true}
          />
          {renderDeadlinePicker()}
        </LocalizationProvider>
      </Box>
    );
  };

  return (
    <Layout>
      <Box className={classes.centeredRow}>
        <UmpireStepper
          stepNumber={2}
          steps={STEPS}
          setStepNumber={setCreateJobStepNumber}
          stepNavigation={STEP_NAVIGATION}
        />
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt3}`}>
        <Typography variant="h4">Step 4 - final step</Typography>
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Typography variant="h5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </Typography>
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Typography variant="h5">Your formula looks like:</Typography>
      </Box>
      <Box
        className={`${classes.centeredRow} ${classes.mt2} ${classes.withBorder}`}
      >
        <Typography variant="body1">
          {leftSide} {comparator} {rightSide}
        </Typography>
      </Box>
      <Box className={classes.mt2}>
        <TextField
          id="jobName"
          label="Job name"
          variant="outlined"
          className={classes.fullWidth}
          value={jobName}
          onChange={handleSetJobName}
        />
      </Box>
      <Box className={classes.mt2}>
        <TextField
          id="action-address"
          label="Action address"
          variant="outlined"
          className={classes.fullWidth}
          value={actionAddress}
          onChange={handleSetActionAddress}
        />
      </Box>
      <Box className={classes.mt2}>
        <FormControlLabel
          control={
            <Checkbox
              id="use-activation-date"
              onChange={handleUseActivationDateChange}
            />
          }
          label="Use activation date"
        />
      </Box>
      {renderPickers()}
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Button
          variant="outlined"
          color="primary"
          onClick={finishAndDeploy}
          disabled={missingData}
        >
          Finish - deploy the job
        </Button>
      </Box>
    </Layout>
  );
};

export default CreateJobStep4;
