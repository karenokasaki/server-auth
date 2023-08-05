import express from "express";
import JobModel from "../model/job.model.js";
import isAuth from "../middlewares/isAuth.js";

const jobRouter = express.Router();

// Create a new job
jobRouter.post("/create-job", isAuth, async (req, res) => {
   try {
      const form = req.body; // description, salary

      const id_business = req.auth._id;

      //create job
      const job = await JobModel.create({
         ...form,
         business: id_business,
      });

      //add job to business
      await BusinessModel.findByIdAndUpdate(
         id_business,
         { $push: { jobs: job._id } },
         { new: true, runValidators: true }
      );

      return res.status(201).json(job);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

// Get all jobs - Homepage
jobRouter.get("/get-all-jobs", async (req, res) => {
   try {
      const jobs = await JobModel.find();
      return res.status(200).json(jobs);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

// Get a job by ID
jobRouter.get("/get-job/:jobId", async (req, res) => {
   try {
      const jobId = req.params.jobId;

      const job = await JobModel.findById(jobId).populate("business");
      if (!job) {
         throw new Error("Job não encontrado");
      }

      return res.status(200).json(job);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

// Update a job by ID
jobRouter.put("/update-job/:jobId", isAuth, async (req, res) => {
   try {
      const jobId = req.params.jobId;
      const form = req.body; // description, salary, status

      const updatedJob = await JobModel.findByIdAndUpdate(
         jobId,
         { ...form },
         { new: true, runValidators: true }
      );

      return res.status(200).json({ message: "Job atualizado com sucesso" });
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

// Soft delete a job by ID (set status to "cancelada")
jobRouter.delete("/cancel-job/:jobId", isAuth, async (req, res) => {
   try {
      const jobId = req.params.jobId;

      const job = await JobModel.findByIdAndUpdate(
         jobId,
         { status: "cancelada" },
         { new: true, runValidators: true }
      );
      if (!job) {
         throw new Error("Job não encontrado");
      }

      return res.status(200).json({ message: "Job cancelado com sucesso" });
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

// Candidate applies for a job
jobRouter.post("/apply/:jobId", isAuth, async (req, res) => {
   try {
      const jobId = req.params.jobId;
      const userId = req.auth._id;

      //add candidate to job
      await JobModel.findByIdAndUpdate(
         jobId,
         { $push: { candidates: userId } },
         { new: true, runValidators: true }
      );

      //add job to user
      await UserModel.findByIdAndUpdate(
         userId,
         { $push: { jobs: jobId } },
         { new: true, runValidators: true }
      );

      return res
         .status(200)
         .json({ message: "Candidatura realizada com sucesso" });
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

// Approve a candidate for a job
jobRouter.put("/approve-candidate/:jobId/:userId", isAuth, async (req, res) => {
   try {
      const jobId = req.params.jobId;
      const userId = req.params.userId;

      //update job
      await JobModel.findByIdAndUpdate(
         jobId,
         { selectedCandidate: userId, status: "fechada" },
         { new: true, runValidators: true }
      );

      return res
         .status(200)
         .json({ message: "Candidato aprovado com sucesso" });
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

export default jobRouter;
