import { Schema, model } from "mongoose";

const jobSchema = new Schema(
   {
      title: { type: String, required: true },
      description: { type: String, required: true },
      salary: { type: String, required: true },
      business: {
         type: Schema.Types.ObjectId,
         ref: "Business",
         required: true,
      },
      status: {
         type: String,
         enum: ["ABERTA", "FECHADA", "CANCELADA"],
         default: "ABERTA",
      },
      city: { type: String, required: true },
      state: { type: String, required: true },
      model: { type: String, enum: ["REMOTO", "HIBRIDO", "PRESENCIAL"] },
      candidates: [{ type: Schema.Types.ObjectId, ref: "User" }],
      select_candidate: { type: Schema.Types.ObjectId, ref: "User" },
   },
   { timestamps: true }
);

export default model("Job", jobSchema);
