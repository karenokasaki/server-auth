import { Schema, model } from "mongoose";

const userSchema = new Schema(
   {
      name: { type: String, required: true, trim: true },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      },
      profilePicture: {
         type: String,
         default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
      },
      role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
      telefone: { type: String, required: true, trim: true },
      passwordHash: { type: String, required: true },
      jobHistory: [{ type: Schema.Types.ObjectId, ref: "Job" }],
      active: { type: Boolean, default: true },
   },
   { timestamps: true }
);

export default model("User", userSchema);
