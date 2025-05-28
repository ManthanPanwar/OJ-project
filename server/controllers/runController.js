const generateFile = require("../compiler/generateFile");
const generateInputFile = require("../compiler/generateInputFile");
const executeCode = require("../compiler/execute");
const fs = require("fs");

const runCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language, input } = req.body;
    console.log(`${id} \n ${code} \n ${language} \n ${input}`);
    // Validate required fields
    if (!code || !language) {
      return res
        .status(400)
        .json({message: "Code and language are required", success: false});
    }

    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    console.log("Filename:", filePath, inputPath);
    const output = await executeCode({ filePath, inputPath });
    console.log("now I am here");
    console.log("Output:", output);

    fs.unlinkSync(filePath);
    fs.unlinkSync(inputPath);

    return res
      .status(201)
      .json({message: "Compiled successfully", output, success: true});
  } catch (error) {
    console.error("Error running problem:", error);
    return res
      .status(500)
      .json({message: "Internal server error", success: false, error: error.message});
  }
};

module.exports = {
  runCode,
};
