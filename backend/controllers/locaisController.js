import { pool } from "../database/conexao.js";

async function listarLocais(req, res) {
    try {
        const [locais] = await pool.query("SELECT * FROM locais");
        res.status(200).json(locais);
    } catch (erro) {
        console.log("Erro ao listar locais:", erro);
        res.status(500).json({ mensagem: "Erro ao listar locais" });
    }
}

async function buscarLocalPorID(req, res) {
    try {
        const [locais] = await pool.query("SELECT * FROM locais WHERE id = ?", [req.params.id]);
        if (locais.length === 0) {
            return res.status(404).json({ mensagem: "Local não encontrado" });
        }
        res.status(200).json(locais[0]);
    } catch (erro) {
        console.log("Erro ao buscar local:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar local" });
    }
}

async function cadastrarLocal(req, res) {
    try {
        const { nome, pais, ano, valor } = req.body;
        if (!nome || !pais || !ano || valor === undefined || valor === "") {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }
        const [resultado] = await pool.query(
            "INSERT INTO locais (nome, pais, ano, valor) VALUES (?, ?, ?, ?)",
            [nome, pais, ano, valor]
        );
        res.status(201).json({ mensagem: "Local cadastrado com sucesso", id: resultado.insertId });
    } catch (erro) {
        console.log("Erro ao cadastrar local:", erro);
        res.status(500).json({ mensagem: "Erro ao cadastrar local" });
    }
}

async function atualizarLocal(req, res) {
    try {
        const { nome, pais, ano, valor } = req.body;
        if (!nome || !pais || !ano || valor === undefined || valor === "") {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }
        const [resultado] = await pool.query(
            "UPDATE locais SET nome = ?, pais = ?, ano = ?, valor = ? WHERE id = ?",
            [nome, pais, ano, valor, req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Local não encontrado." });
        }
        res.status(200).json({ mensagem: "Local atualizado com sucesso" });
    } catch (erro) {
        console.log("Erro ao atualizar local:", erro);
        res.status(500).json({ mensagem: "Erro ao atualizar local" });
    }
}

async function excluirLocal(req, res) {
    try {
        const [resultado] = await pool.query("DELETE FROM locais WHERE id = ?", [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Local não encontrado." });
        }
        res.status(200).json({ mensagem: "Local concluído e removido da lista." });
    } catch (erro) {
        console.log("Erro ao concluir local:", erro);
        res.status(500).json({ mensagem: "Erro ao concluir local" });
    }
}

export { listarLocais, buscarLocalPorID, cadastrarLocal, atualizarLocal, excluirLocal };
