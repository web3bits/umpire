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
import { useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { EComparator, useGlobalContext } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UmpireComparator } from "../../../utils/model";
import { useCreateJob } from "../../../hooks/useCreateJob";
import { interpolateVariables } from "../../../utils/formulas";

const useCreateJobStep4 = () => {
  const router = useRouter();
  const { createJob, setCreateJob, setLoading } = useGlobalContext();
  const [activationTimestamp, setActivationTimestamp] = useState<Dayjs | null>(
    null
  );
  const [deadlineDate, setDeadlineDate] = useState<Dayjs | null>(null);
  const [useActivationDate, setUseActivationDate] = useState(false);
  const [jobName, setJobName] = useState("");
  const [actionAddress, setActionAddress] = useState("");
  const getComparator = (comparator: EComparator) => {
    switch (comparator) {
      case EComparator.EQUAL:
        return UmpireComparator.EQUAL;
      case EComparator.DIFFERENT_FROM:
        return UmpireComparator.NOT_EQUAL;
      case EComparator.GREATER_THAN:
        return UmpireComparator.GREATER_THAN;
      case EComparator.GREATER_THAN_EQUAL:
        return UmpireComparator.GREATER_THAN_EQUAL;
      case EComparator.LOWER_THAN:
        return UmpireComparator.LESS_THAN;
      case EComparator.LOWER_THAN_EQUAL:
        return UmpireComparator.LESS_THAN_EQUAL;
    }
  };

  const {
    isLeftValid,
    isRightValid,
    isLoading,
    isSuccess,
    transactionHash,
    deployJob,
    error,
    isError,
    prepareError,
    isPrepareError,
    fullFormula,
  } = useCreateJob({
    jobName: createJob?.jobName ?? "",
    leftFormula: interpolateVariables(
      createJob?.leftFormula ?? "",
      createJob?.variableFeeds ?? []
    ),
    rightFormula: interpolateVariables(
      createJob?.rightFormula ?? "",
      createJob?.variableFeeds ?? []
    ),
    comparator: getComparator(createJob?.comparator ?? EComparator.EQUAL),
    actionAddress: createJob?.actionAddress ?? "",
    variableFeeds: (createJob?.variableFeeds ?? []).map((feed) => feed.address),
    activationTimestamp: activationTimestamp?.unix() ?? 0,
    timeoutTimestamp: deadlineDate?.unix() ?? 0,
  });

  useEffect(() => {
    setCreateJob({ ...createJob, jobName });
  }, [jobName]);

  useEffect(() => {
    setCreateJob({ ...createJob, actionAddress });
  }, [actionAddress]);

  useEffect(() => {
    setCreateJob({ ...createJob, timeoutTimestamp: deadlineDate?.unix() ?? 0 });
  }, [deadlineDate]);

  useEffect(() => {
    setCreateJob({
      ...createJob,
      activationTimestamp: activationTimestamp?.unix() ?? 0,
    });
  }, [activationTimestamp]);

  useEffect(() => {
    console.log({ isSuccess, isLoading, transactionHash });
    if (isSuccess && transactionHash) {
      setLoading(false);
      nextStep();
    }
  }, [transactionHash, isSuccess]);

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
    const activationTimestamp = `${event.$M + 1}/${event.$D}/${event.$y} ${
      event.$H
    }:${event.$m}`;
    setActivationTimestamp(dayjs(activationTimestamp));
  };

  const finishAndDeploy = async () => {
    setLoading(true);
    await deployJob();
  };

  return {
    createJob,
    actionAddress,
    handleSetActionAddress,
    jobName,
    handleSetJobName,
    useActivationDate,
    handleUseActivationDateChange,
    activationTimestamp,
    setActivationTimestamp,
    deadlineDate,
    setDeadlineDate,
    handleDeadlineDateChange,
    handleActivationDateChange,
    missingData:
      jobName?.trim().length === 0 ||
      actionAddress?.trim().length === 0 ||
      !deadlineDate ||
      (useActivationDate && !activationTimestamp),
    finishAndDeploy,
    isLeftValid,
    isRightValid,
    isLoading,
    isSuccess,
    transactionHash,
    error,
    isError,
    prepareError,
    isPrepareError,
    fullFormula,
  };
};

const CreateJobStep4 = () => {
  const classes = useGlobalClasses();
  const {
    createJob,
    jobName,
    handleSetJobName,
    actionAddress,
    handleSetActionAddress,
    useActivationDate,
    activationTimestamp,
    handleUseActivationDateChange,
    deadlineDate,
    handleActivationDateChange,
    handleDeadlineDateChange,
    missingData,
    finishAndDeploy,
    fullFormula,
  } = useCreateJobStep4();
  const { leftFormula, comparator, rightFormula } = createJob ?? {};

  const renderDeadlinePicker = () => {
    return (
      <DateTimePicker
        label="Deadline date & time"
        value={deadlineDate}
        onChange={handleDeadlineDateChange}
        renderInput={(params) => (
          <TextField {...params} className={classes.inputFieldDate} />
        )}
        disablePast={true}
        minDateTime={activationTimestamp}
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
            value={activationTimestamp}
            onChange={handleActivationDateChange}
            renderInput={(params) => (
              <TextField {...params} className={classes.inputFieldDate} />
            )}
            disablePast={true}
          />
          {renderDeadlinePicker()}
        </LocalizationProvider>
      </Box>
    );
  };

  return (
    <Layout>
      <Box className={`${classes.centeredRow} ${classes.mt3}`}>
        <Typography variant="h4">Step 4 - final step</Typography>
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Typography variant="body1">
          To deploy your job, please fill in the remaining data below.
        </Typography>
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Typography variant="h5">Your formula looks like this:</Typography>
      </Box>
      <Box
        className={`${classes.centeredRow} ${classes.mt2} ${classes.withBorder}`}
      >
        <Typography variant="body1">
          {leftFormula} {comparator} {rightFormula}
        </Typography>
      </Box>
      <Box className={classes.mt2}>
        <TextField
          id="jobName"
          label="Job name"
          variant="outlined"
          className={classes.inputField}
          value={jobName}
          onChange={handleSetJobName}
        />
      </Box>
      <Box className={classes.mt2}>
        <TextField
          id="action-address"
          label="Action address"
          variant="outlined"
          className={classes.inputField}
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
              disableRipple
              sx={{
                "& .MuiSvgIcon-root": {
                  color: "#ec407a",
                },
              }}
            />
          }
          label="Use activation date"
        />
      </Box>
      {renderPickers()}
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Button
          onClick={finishAndDeploy}
          disabled={missingData}
          className="pink"
        >
          Finish - deploy the job
        </Button>
      </Box>
    </Layout>
  );
};

export default CreateJobStep4;
