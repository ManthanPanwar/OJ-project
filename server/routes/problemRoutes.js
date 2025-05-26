const express = require("express");
const router = express.Router();

const {createProblem, getAllProblems, getProblemById, deleteProblemById, updateProblemById} = require("../controllers/problemController")

router.post("/createproblem", createProblem);
router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.delete("/:id", deleteProblemById);
router.put("/:id", updateProblemById);

module.exports = router;