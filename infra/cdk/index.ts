#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Stack } from './stack';

const app = new cdk.App();
new Stack(app, 'UmpireAppStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_DEFAULT_REGION,
  },
});
