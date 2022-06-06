const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFiles = ( files, allowedExtensions = ["jpg", "jpeg", "png", "gif"], dir = '') => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];

    if (!allowedExtensions.includes(extension)) {
        return reject({ msg: "Invalid file extension" });
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", dir, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFiles,
};
