const generateFile = require("../compiler/generateFile");
const generateInputFile = require("../compiler/generateInputFile");
const executeCode = require("../compiler/execute");
const Problem = require("../models/Problem");
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
        .json({ message: "Code and language are required", success: false });
    }

    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    console.log("Filename:", filePath, inputPath);
    const output = await executeCode({ filePath, inputPath });
    console.log("Output:", output);

    fs.unlinkSync(filePath);
    fs.unlinkSync(inputPath);

    return res
      .status(201)
      .json({ message: "Compiled successfully", output, success: true });
  } catch (error) {
    console.error("Error running problem:", error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

const submitCode = async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const results = [];
    const filePath = await generateFile(language, code);
    console.log("File Path:", filePath);

    for (const testCase of problem.test_cases) {
      const inputPath = await generateInputFile(testCase.input);
      console.log("Input Path:", inputPath);

      try {
        const result = await executeCode({ filePath, inputPath });
        console.log("Test Case Result:", result);

        results.push({
          input: testCase.input,
          expected: testCase.output,
          output: result.trim(),
          passed: result.trim() === testCase.output.trim(),
        });
      } catch (err) {
        console.error("Execution error:", err);

        results.push({
          input: testCase.input,
          expected: testCase.output,
          output: err?.stderr?.toString() || err?.error?.toString() || "Execution failed",
          passed: false,
          error: true,
        });
      }
    }

    const passedAll = results.every((r) => r.passed && !r.error);
    res.json({ passedAll, results });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  runCode,
  submitCode,
};
