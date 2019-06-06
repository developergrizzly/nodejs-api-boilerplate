import FileSystem from 'fs';
import Promise from 'bluebird';

let logFilename= 'access-log.txt';

let writeFile= (err) =>{
  let path= `${__basedir}\\${logFilename}`;
  var logFile = FileSystem.createWriteStream(path, { flags: 'a' });
  logFile.write(`Datetime: ${new Date()}\r\n`);
  logFile.write(`HTTP code: ${err.status}\r\n`);
  logFile.write(`message: ${err.message}\r\n`);
  logFile.write(`stacktrace: ${err.stack.replace(/\n+/g, '\r\n')}\r\n`);
  logFile.write('------------------------------------------------\r\n');
};

export default { writeFile };
