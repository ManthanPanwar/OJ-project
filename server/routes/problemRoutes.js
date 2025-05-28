const express = require("express");
const router = express.Router();

const {
  createProblem,
  getAllProblems,
  getProblemById,
  deleteProblemById,
  updateProblemById,
} = require("../controllers/problemController");
const { runCode } = require("../controllers/runController");

router.post("/createproblem", createProblem);
router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.delete("/:id", deleteProblemById);
router.put("/:id", updateProblemById);
router.post("/:id/run", runCode);

module.exports = router;
