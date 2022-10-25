import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudFront from "@aws-cdk/aws-cloudfront";
import {CfnOutput} from "@aws-cdk/core";

export class Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "UmpireBucket", {
      // bucketName: "Web3BitsUmpire",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "UmpireDistribution",
      {
        originConfigs: [
          {
            customOriginSource: {
              domainName: bucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true,
                allowedMethods: cloudFront.CloudFrontAllowedMethods.ALL,
                cachedMethods:
                  cloudFront.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                forwardedValues: {
                  queryString: true,
                  cookies: {
                    forward: "none",
                  },
                  headers: [
                    "Access-Control-Request-Headers",
                    "Access-Control-Request-Method",
                    "Origin",
                  ],
                },
              },
              {
                isDefaultBehavior: false,
                compress: true,
                allowedMethods: cloudFront.CloudFrontAllowedMethods.ALL,
                cachedMethods:
                  cloudFront.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                forwardedValues: {
                  queryString: true,
                  cookies: {
                    forward: "none",
                  },
                  headers: [
                    "Access-Control-Request-Headers",
                    "Access-Control-Request-Method",
                    "Origin",
                  ],
                },
                minTtl: cdk.Duration.minutes(0),
                maxTtl: cdk.Duration.minutes(0),
                defaultTtl: cdk.Duration.minutes(0),
                pathPattern: "/index.html",
              },
            ],
          },
        ],
      }
    );

    new deploy.BucketDeployment(this, "UmpireDeployment", {
      sources: [deploy.Source.asset("../frontend/build")],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, 'CloudFront URL', {
      value: distribution.distributionDomainName,
    });
  }
}
