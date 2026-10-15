import express from "express";
import "dotenv/config";
import locaisRoutes from "./routes/locaisRoutes.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import { testarConexao } from "./database/conexao.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());
app.use("/locais", locaisRoutes);
app.get("/", function (req, res) {
    res.status(200).json({ mensagem: "API ok" });
});

async function iniciarServidor() {
    try {
        await testarConexao();
        app.listen(PORT, function () {
            console.log("Servidor rodando em http://localhost:" + PORT);
        });
    } catch (erro) {
        console.log("Não foi possível iniciar o servidor");
        console.log(erro.message);
    }
}
iniciarServidor();
