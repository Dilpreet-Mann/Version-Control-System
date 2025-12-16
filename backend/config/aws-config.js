// Disable EC2 metadata service - prevents SDK from trying to connect to EC2
process.env.AWS_EC2_METADATA_DISABLED = "1";

const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-north-1" });

// Create S3 client only (no EC2 service)
const s3 = new AWS.S3();
const S3_BUCKET = "demobucketdilpreet";

module.exports = { s3, S3_BUCKET };


