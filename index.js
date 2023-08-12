import cors from "cors"; // Cross Origin Resource Sharing - Quem vai poder fazer requisições para o meu servidor
import * as dotenv from "dotenv"; // esconder e acessar nossas variáveis de ambiente
import express from "express";
import connectToDB from "./config/db.config.js";

import userRouter from "./routes/user.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import businessRoute from "./routes/business.routes.js";
import jobRouter from "./routes/job.routes.js";

dotenv.config();

connectToDB();

const app = express();

app.use(cors()); // cors() => Aceita a requisição de TODO MUNDO
app.use(express.json()); // configuração do servidor para aceitar e receber arquivos em json

app.use("/user", userRouter);

// criar rota do business
app.use("/business", businessRoute);

// criar rota do job
app.use("/job", jobRouter);

app.use("/upload", uploadRoute);

app.listen(process.env.PORT, () => {
   console.log(`Server up and running at port ${process.env.PORT}`);
});
