const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// outputs directory to store compiled code
const outputPath = path.join(__dirname, "outputs");

// Ensure the output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = async ({ filePath, inputPath }) => {
  const jobId = path.basename(filePath).split(".")[0];
  // const language = path.extname(filePath).slice(1);
  const outPath = path.join(outputPath, `${jobId}.out`);
    // console.log("filePath********", filePath);
    // return new Promise((resolve, reject) => {
    //   const cmdd = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.out < ${inputPath}`
    //   exec(cmdd, {shell: "cmd.exe"}, (error, stdout, stderr) => {
    //     console.log("error", error);
    //     if (error) {
    //       reject({ error: error.message, stderr });
    //     }
    //     if (stderr) {
    //       reject(stderr);
    //     }
    //     resolve(stdout);
    //   });
    // });

    return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
  };


module.exports = executeCode;
