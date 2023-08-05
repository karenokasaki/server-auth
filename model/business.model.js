import { Schema, model } from "mongoose";

const businessSchema = new Schema(
   {
      name: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      // Other business information, if necessary
      jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
      active: { type: Boolean, default: true },
   },
   { timestamps: true }
);

export default model("Business", businessSchema);