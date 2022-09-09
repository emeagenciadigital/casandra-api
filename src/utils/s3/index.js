const { GeneralError } = require("@feathersjs/errors");
const fs = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "AKIA3SGPONEDNMMJZIPL",
  secretAccessKey: "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",
});

class S3 {
  uploadFile(fileName, key) {
    new Promise((resolve, reject) => {
      // Read content from the file
      const fileContent = fs.readFileSync(fileName);

      // Setting up S3 upload parameters
      const params = {
        Bucket: "estrategia-web",
        Key: key, // File name you want to save as in S3
        Body: fileContent,
      };

      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          reject(err);
        }
        return resolve(data.Location);
      });
    });
  }
}

module.exports = S3;
