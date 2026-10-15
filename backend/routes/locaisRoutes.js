import express from "express";
import {
    listarLocais,
    buscarLocalPorID,
    cadastrarLocal,
    atualizarLocal,
    excluirLocal
} from "../controllers/locaisController.js";

const router = express.Router();
router.get("/", listarLocais);
router.post("/", cadastrarLocal);
router.put("/:id", atualizarLocal);
router.get("/:id", buscarLocalPorID);
router.delete("/:id", excluirLocal);

export default router;
