const express = require("express");
const Problem = require("../models/Problem");

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      constraints,
      example_cases,
      test_cases,
      input_format,
      output_format,
    } = req.body;
    const problemExists = await Problem.findOne({title});
    if(problemExists)
      return res
        .status(400)
        .json({ message: "Problem with this title already exists", success: false });

    const problem = new Problem({
      title,
      description,
      difficulty,
      constraints,
      example_cases,
      test_cases,
      input_format,
      output_format,
    });
    const savedProblem = await problem.save();
    if (!savedProblem)
      return res
        .status(500)
        .json({ message: "Problem not created", success: false });
    return res
      .status(200)
      .json({
        message: "Problem created successfully",
        success: true,
        problem: savedProblem,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false, err });
  }
};

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({});
        if (!problems || problems.length === 0)
        return res
            .status(404)
            .json({ message: "No problems found", success: false });
        return res
        .status(200)
        .json({ message: "Problems fetched successfully", success: true, problems });
    } catch (err) {
        // console.log(err);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false, err });
    }
};

const getProblemById = async (req, res) => {
    try {
        const problemId = req.params.id;
        const problem = await Problem.findById(problemId).select("-test_cases");
        if (!problem)
        return res
            .status(404)
            .json({ message: "Problem not found", success: false });
        return res
        .status(200)
        .json({ message: "Problem fetched successfully", success: true, problem });
    } catch (err) {
        // console.log(err);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false, err });
    }
};

const deleteProblemById = async (req, res) => {
    try {
        const problemId = req.params.id;
        const problem = await Problem.findByIdAndDelete(problemId);
        if (!problem)
        return res
            .status(404)
            .json({ message: "Problem not found", success: false });
        return res
        .status(200)
        .json({ message: "Problem deleted successfully", success: true });
    } catch (err) {
        // console.log(err);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false, err });
    }
};

const updateProblemById = async (req, res) => {
    try {
        const problemId = req.params.id;
        const {
            title,
            description,
            difficulty,
            constraints,
            example_cases,
            test_cases,
            input_format,
            output_format,
        } = req.body;
        const updatedProblem = await Problem.findByIdAndUpdate(
            problemId,
            {
                title,
                description,
                difficulty,
                constraints,
                example_cases,
                test_cases,
                input_format,
                output_format,
            },
            { new: true }
        );
        if (!updatedProblem)
        return res
            .status(404)
            .json({ message: "Problem not found", success: false });
        return res
        .status(200)
        .json({ message: "Problem updated successfully", success: true, problem: updatedProblem });
    } catch (err) {
        // console.log(err);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false, err });
    }
};


module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  deleteProblemById,
  updateProblemById,
};