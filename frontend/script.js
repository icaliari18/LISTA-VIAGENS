const URL_API = "http://localhost:3000/locais";
const botaoBuscar = document.getElementById("btnBuscar");
const listaLocais = document.getElementById("listaLocais");
const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("formLocal");
const campoNome = document.getElementById("nome");
const campoPais = document.getElementById("pais");
const campoAno = document.getElementById("ano");
const campoValor = document.getElementById("valor");
const botaoSalvar = document.getElementById("btnSalvar");
const tituloFormulario = document.getElementById("tituloFormulario");
let idEdicao = null;

botaoBuscar.addEventListener("click", buscarLocais);
formulario.addEventListener("submit", salvarLocal);

async function buscarLocais() {
    try {
        mensagem.textContent = "Buscando locais...";
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);

        const locais = await resposta.json();
        listaLocais.innerHTML = "";
        if (locais.length === 0) {
            mensagem.textContent = "Nenhum local cadastrado.";
            return;
        }

        for (let i = 0; i < locais.length; i++) {
            const local = locais[i];
            const linha = document.createElement("tr");
            adicionarCelula(linha, local.id);
            adicionarCelula(linha, local.nome);
            adicionarCelula(linha, local.pais);
            adicionarCelula(linha, local.ano);
            adicionarCelula(linha, Number(local.valor).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            const acoes = document.createElement("td");
            const editar = document.createElement("button");
            editar.textContent = "Editar";
            editar.addEventListener("click", function () { editarLocal(local.id); });

            const concluir = document.createElement("button");
            concluir.textContent = "Concluir";
            concluir.className = "btn-concluir";
            concluir.addEventListener("click", function () { concluirLocal(local.id); });
            acoes.append(editar, concluir);
            linha.appendChild(acoes);
            listaLocais.appendChild(linha);
        }
        mensagem.textContent = locais.length + " local(is) encontrado(s).";
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar os locais.";
        console.log("Erro ao buscar locais:", erro);
    }
}

function adicionarCelula(linha, valor) {
    const celula = document.createElement("td");
    celula.textContent = valor;
    linha.appendChild(celula);
}

async function salvarLocal(evento) {
    evento.preventDefault();
    if (idEdicao === null) await cadastrarLocal();
    else await atualizarLocal();
}

async function cadastrarLocal() {
    try {
        const local = {
            nome: campoNome.value,
            pais: campoPais.value,
            ano: campoAno.value,
            valor: campoValor.value
        };
        const resposta = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
        });
        if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);
        const dados = await resposta.json();
        formulario.reset();
        await buscarLocais();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível cadastrar o local.";
        console.log("Erro ao cadastrar local:", erro);
    }
}

async function editarLocal(id) {
    try {
        const resposta = await fetch(URL_API + "/" + id);
        if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);
        const local = await resposta.json();
        campoNome.value = local.nome;
        campoPais.value = local.pais;
        campoAno.value = local.ano;
        campoValor.value = local.valor;
        idEdicao = local.id;
        botaoSalvar.textContent = "Atualizar";
        tituloFormulario.textContent = "Editar local";
        mensagem.textContent = "Editando local de ID " + local.id + ".";
        campoNome.focus();
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar o local para edição.";
        console.log("Erro ao editar local:", erro);
    }
}

async function atualizarLocal() {
    try {
        const local = {
            nome: campoNome.value,
            pais: campoPais.value,
            ano: campoAno.value,
            valor: campoValor.value
        };
        const resposta = await fetch(URL_API + "/" + idEdicao, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
        });
        if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);
        const dados = await resposta.json();
        limparFormulario();
        await buscarLocais();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível atualizar o local.";
        console.log("Erro ao atualizar local:", erro);
    }
}

async function concluirLocal(id) {
    if (!confirm("Concluir este local? Ele será removido da sua lista.")) return;
    try {
        const resposta = await fetch(URL_API + "/" + id, { method: "DELETE" });
        if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);
        const dados = await resposta.json();
        await buscarLocais();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível concluir o local.";
        console.log("Erro ao concluir local:", erro);
    }
}

function limparFormulario() {
    formulario.reset();
    idEdicao = null;
    botaoSalvar.textContent = "Cadastrar";
    tituloFormulario.textContent = "Cadastrar local";
}
