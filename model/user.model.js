import { Schema, model } from "mongoose";

const userSchema = new Schema(
   {
      name: { type: String, required: true, trim: true },

      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, // match = regex
      },

      profilePicture: {
         type: String,
         default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
      },

      role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },

      telefone: { type: String, required: true, trim: true },

      passwordHash: { type: String, required: true },
   },
   // o que mais eu posso colocar nas opcoes do schema?
   { timestamps: true }
);

export default model("User", userSchema);
