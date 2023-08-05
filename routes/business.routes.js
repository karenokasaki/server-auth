import express from "express";
import BusinessModel from "../model/business.model.js";
import isAuth from "../middlewares/isAuth.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

const businessRouter = express.Router();

const SALT_ROUNDS = 10; // quão complexo queremos que o salt seja criado || maior o numero MAIOR a demora na criação da hash

businessRouter.post("/signup-business", async (req, res) => {
   try {
      const form = req.body;

      if (!form.email || !form.password) {
         throw new Error("Por favor, envie um email e uma senha");
      }

      if (
         form.password.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
         ) === false
      ) {
         throw new Error(
            "A senha não preenche os requisitos básicos. 8 caracteres. Maiuscula e minuscula. Numeros e caracteres especiais."
         );
      }

      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(form.password, salt);

      const business = await BusinessModel.create({
         ...form,
         passwordHash: hashedPassword,
      });

      business.passwordHash = undefined;
      return res.status(201).json(business);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

businessRouter.post("/login", async (req, res) => {
   try {
      const form = req.body;

      if (!form.email || !form.password) {
         throw new Error("Por favor, preencha todos os dados!");
      }

      // procuro o user pelo email dentro do banco de dados
      const business = await BusinessModel.findOne({ email: form.email });

      //compare() também retorna TRUE se for igual as senhas e retorna FALSE se a senha não foi igual!!
      if (await bcrypt.compare(form.password, business.passwordHash)) {
         //senhas iguais, pode fazer login

         //gerar um token
         const token = generateToken(business);

         business.passwordHash = undefined;

         return res.status(200).json({
            business: business,
            token: token,
         });
      } else {
         //senhas diferentes, não pode fazer login
         throw new Error(
            "Email ou senha não são válidos. Por favor tenta novamente."
         );
      }
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

businessRouter.get("/profile", isAuth, async (req, res) => {
   try {
      const id_business = req.auth._id;

      const business = await BusinessModel.findById(id_business).select(
         "-passwordHash"
      );

      return res.status(200).json(business);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

businessRouter.put("/edit", isAuth, async (req, res) => {
   try {
      const id_business = req.auth._id;

      const updatedBusiness = await BusinessModel.findByIdAndUpdate(
         id_business,
         { ...req.body },
         { new: true, runValidators: true }
      );

      return res.status(200).json(updatedBusiness);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

businessRouter.delete("/delete", isAuth, async (req, res) => {
   try {
      const id_business = req.auth._id;

      //soft delete
      const deletedBusiness = await BusinessModel.findByIdAndUpdate(
         id_business,
         { active: false },
         { new: true }
      );

      return res.status(200).json(deletedBusiness);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
   }
});

export default businessRouter;
