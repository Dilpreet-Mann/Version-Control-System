// Disable EC2 metadata service - prevents SDK from trying to connect to EC2
process.env.AWS_EC2_METADATA_DISABLED = "1";

const AWS = require("aws-sdk");

const region = process.env.AWS_REGION || "eu-north-1";
const S3_BUCKET = process.env.S3_BUCKET || "demobucketdilpreet";

// Create S3 client configuration
const s3Config = {
  region: region,
};

// If credentials are provided in environment, use them explicitly
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  s3Config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  
  // Set credentials in AWS config to prevent EC2 metadata calls
  AWS.config.update({
    region: region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
} else {
  // Try to load from shared credentials file
  try {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
    if (credentials.accessKeyId) {
      AWS.config.update({
        region: region,
        credentials: credentials,
      });
    } else {
      throw new Error("No credentials found");
    }
  } catch (err) {
    // If no credentials found, we'll handle the error in the push/pull functions
    AWS.config.update({ region: region });
  }
}

// Create S3 client
const s3 = new AWS.S3(s3Config);

module.exports = { s3, S3_BUCKET };


