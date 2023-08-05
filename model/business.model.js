import { Schema, model } from "mongoose";

const businessSchema = new Schema(
   {
      name: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      // Other business information, if necessary
      jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
      active: { type: Boolean, default: true },
      role: { type: String, enum: ["ADMIN", "BUSINESS"], default: "BUSINESS" },
   },
   { timestamps: true }
);

export default model("Business", businessSchema);
