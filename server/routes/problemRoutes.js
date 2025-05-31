const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProblem,
  getAllProblems,
  getProblemById,
  deleteProblemById,
  updateProblemById,
} = require("../controllers/problemController");
const { runCode, submitCode } = require("../controllers/runController");

router.post("/createproblem", createProblem);
router.get("/",  getAllProblems);
router.get("/:id",  getProblemById);
router.delete("/:id", deleteProblemById);
router.put("/:id",  updateProblemById);
router.post("/:id/run",  runCode);
router.post('/:id/submit',  submitCode);

module.exports = router;
