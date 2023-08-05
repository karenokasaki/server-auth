import { Schema, model } from "mongoose";

const jobSchema = new Schema(
   {
      business: {
         type: Schema.Types.ObjectId,
         ref: "Business",
         required: true,
      },
      description: { type: String, required: true },
      salary: { type: Number, required: true },
      candidates: [{ type: Schema.Types.ObjectId, ref: "User" }],
      status: {
         type: String,
         enum: ["aberta", "cancelada", "fechada"],
         default: "aberta",
      },
      selectedCandidate: { type: Schema.Types.ObjectId, ref: "User" },
   },
   { timestamps: true }
);

export default model("Job", jobSchema);
