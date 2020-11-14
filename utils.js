const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

module.exports.readinput = async function (file) {
  const input = await read(file, "utf-8");
  return input;
};

function log(message) {
  console.log(message);
}
module.exports.l = log;
module.exports.p = log;
