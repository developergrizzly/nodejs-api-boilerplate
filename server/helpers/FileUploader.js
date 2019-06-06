import FtpClient from 'ftp';
import Promise from 'bluebird';
import Config from '../../config/config';
import FileSystem from 'fs';
import Path from 'path';

/**
 * Entry function for upload file on ftp server
 * @param files - files object which contains all the file data
 * @param destinationPath - where to save file n ftp server
 * @param fileId - it will set as file name on server
 */
function upload(file, destinationPath, fileId) {
  return new Promise((resolve, reject) => {
    if(!file || !file.path) {
      resolve({
        isSucceeded: false,
        isFileExists: false
      });
    }
    let sourcePath = file.path,
      fileExtension = file.name.split('.').pop(),
      newFileName = `${fileId}.${fileExtension}`,
      tempPath = Path.join(`${__basedir}/.temp/${newFileName}`);
    destinationPath = `${destinationPath}/${fileId}.${fileExtension}`;
    readFile(sourcePath)
      .then((data) => {
        return writeTempFile(tempPath, data);
      }).then(() => {
      return uploadFile(tempPath, destinationPath);
    }).then(() => {
      return deleteTempFile(tempPath);
    }).then((result) => {
      resolve({
        isSucceeded: result === true,
        isFileExists: true,
        fileName: newFileName
      });
    }).catch(err => reject(err));
  });
}

/**
 * Read file from uploaded files object
 * @param sourcePath - File source path from where it will read
 * @return {data}
 */
function readFile(sourcePath) {
  return new Promise((resolve, reject) => {
    FileSystem.readFile(sourcePath, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Write uploaded file to server's temp folder
 * @param tempFilePath - temp folder path on server
 * @param fileData - files data which will going to write into file
 * @return Boolean - it will return true if the file wrote on server otherwise error message
 */
function writeTempFile(tempFilePath, fileData) {
  return new Promise((resolve, reject) => {
    FileSystem.writeFile(tempFilePath, fileData, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Delete temp file from server after ftp transfer done
 * @param tempFilePath - temp file path
 * @return Boolean - it will return true if the deleted successfully
 */
function deleteTempFile(tempFilePath) {
  return new Promise((resolve, reject) => {
    FileSystem.unlink(tempFilePath, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Upload file to ftp server
 * @param sourcePath
 * @param destinationPath
 * @return {*|Promise<any>}
 */
function uploadFile(sourcePath, destinationPath) {
  let client = new FtpClient();
  return new Promise((resolve, reject) => {
    connect(client)
      .then(() => {
        return put(client, sourcePath, destinationPath);
      })
      .then(function (result) {
        if (result) {
          resolve(result);
        } else {
          reject("Failed to upload file");
        }
      })
      .catch((err) => reject(err));
  }).finally(function () {
    client.end();
  });
}

/**
 * To connect to ftp server
 * @param client - Ftp client object
 * @return FTP object
 */
function connect(client) {
  return new Promise(function (resolve, reject) {
    client.connect(Config.ftp);
    client.on('ready', function () {
      resolve(client);
    });
    client.on('error', function (err) {
      reject(err);
    });
  });
}

/**
 * To transfer file from temp folder to ftp server
 * @param client - FTP client object
 * @param sourcePath - Source path from where it will take file for transfer
 * @param destinationPath - Destination path on ftp server where it will store the file
 * @return Boolean - true if the file transfer succeeded
 */
function put(client, sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    client.put(sourcePath, destinationPath, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export default {upload}
