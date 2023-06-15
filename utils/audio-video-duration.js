const executeCommand = require("./shell-runtime");

const getDuration = async (path) => {
  const cmd = `ffprobe -i "${path}" -show_entries format=duration -v quiet -of csv="p=0"`;
  let duration = parseFloat(await executeCommand(cmd));
  duration = parseFloat(duration.toFixed(2));
  return duration;
};

module.exports = getDuration;
