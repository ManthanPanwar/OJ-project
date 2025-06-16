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

const { runCode, submitCode, runCustomInput } = require("../controllers/runController");

const { aiReview } = require("../controllers/aiController");

router.post("/createproblem", createProblem);
router.get("/",  getAllProblems);
router.get("/:id",  getProblemById);
router.delete("/:id", authMiddleware, deleteProblemById);
router.put("/:id",  authMiddleware,updateProblemById);
router.post("/:id/run", authMiddleware, runCode);
router.post('/:id/submit',  authMiddleware, submitCode);
router.post("/:id/aireview", authMiddleware, aiReview);
router.post("/runCustomInput",runCustomInput);

module.exports = router;
