const path = require("path");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

module.exports = {
  upload: function (location) {
    if (process.env.NODE_ENV === "production") {
      return this.s3_upload(location);
    } else {
      return this.local_upload("public/images/uploads");
    }
  },
  s3_upload: function (location) {
    try {
      aws.config.update({
        accessKeyId: process.env.DYNAMIC_CONFIG_AWS_KEY,
        secretAccessKey: process.env.DYNAMIC_CONFIG_AWS_SECRET,
        region: process.env.DYNAMIC_CONFIG_AWS_REGION,
      });

      const s3 = new aws.S3();

      const upload = multer({
        storage: multerS3({
          s3: s3,
          bucket: process.env.DYNAMIC_CONFIG_AWS_BUCKET,
          acl: "public-read",
          contentType: multerS3.AUTO_CONTENT_TYPE,
          key: function (req, file, cb) {
            cb(null, location + file.originalname);
          },
        }),
      });

      return upload;
    } catch (error) {
      console.log("s3_upload => ", error);
    }
  },
  local_upload: function (location) {
    try {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, location);
        },
        filename: function (req, file, cb) {
          req.local_file = path.join(
            __dirname,
            "../",
            "public/images/uploads",
            file.originalname
          );
          cb(null, file.originalname);
        },
      });

      const upload = multer({ storage: storage });

      return upload;
    } catch (error) {
      console.log("local_upload => ", error);
    }
  },
};
