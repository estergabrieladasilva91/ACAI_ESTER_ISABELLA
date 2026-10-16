function mascaraTelefone() {
    var telefone = document.getElementById("telefone");
    var numero = telefone.value.replace(/\D/g, "");

    if (numero.length > 11) {
        numero = numero.substring(0, 11);
    }

    if (numero.length > 7) {
        telefone.value = "(" + numero.substring(0, 2) + ") " +
            numero.substring(2, 7) + "-" + numero.substring(7);
    } else if (numero.length > 2) {
        telefone.value = "(" + numero.substring(0, 2) + ") " +
            numero.substring(2);
    } else if (numero.length > 0) {
        telefone.value = "(" + numero;
    }
}

function mascaraCEP() {
    var campo = document.getElementById("cep");
    var numero = campo.value.replace(/\D/g, "");

    if (numero.length > 8) {
        numero = numero.substring(0, 8);
    }

    if (numero.length > 5) {
        campo.value = numero.substring(0, 5) + "-" +
            numero.substring(5);
    } else {
        campo.value = numero;
    }

    document.getElementById("mensagemCEP").innerHTML = "";
}

async function buscarCEP() {
    var campo = document.getElementById("cep");
    var cep = campo.value.replace(/\D/g, "");
    var mensagem = document.getElementById("mensagemCEP");

    if (cep == "") {
        mensagem.innerHTML = "CEP opcional. Preencha a rua manualmente.";
        return;
    }

    if (cep.length != 8) {
        mensagem.innerHTML = "Digite um CEP com 8 números.";
        return;
    }

    mensagem.innerHTML = "Buscando endereço...";

    try {
        var resposta = await fetch(
            "https://viacep.com.br/ws/" + cep + "/json/"
        );

        var dados = await resposta.json();

        if (dados.erro) {
            mensagem.innerHTML = "CEP não encontrado. Digite a rua manualmente.";
            return;
        }

        document.getElementById("endereco").value = dados.logradouro || "";

        mensagem.innerHTML =
            "Endereço encontrado! Confira e complete o número.";

    } catch (erro) {
        mensagem.innerHTML =
            "Não foi possível consultar. Digite a rua manualmente.";
    }
}

function verificarAdicionais(caixa) {
    var tamanho = document.getElementById("tamanho").value;
    var adicionais = document.getElementsByClassName("adicional");
    var limite = 2;
    var quantidade = 0;

    if (tamanho == "15" || tamanho == "20") {
        limite = 4;
    }

    for (var i = 0; i < adicionais.length; i++) {
        if (adicionais[i].checked) {
            quantidade++;
        }
    }

    if (quantidade > limite) {
        caixa.checked = false;
        alert("Você atingiu o limite de adicionais!");
    }

    calcular();
}

function verificarTamanho() {
    var tamanho = document.getElementById("tamanho").value;
    var adicionais = document.getElementsByClassName("adicional");
    var limite = 2;
    var quantidade = 0;

    if (tamanho == "15" || tamanho == "20") {
        limite = 4;
    }

    for (var i = adicionais.length - 1; i >= 0; i--) {
        if (adicionais[i].checked) {
            quantidade++;

            if (quantidade > limite) {
                adicionais[i].checked = false;
                quantidade--;
            }
        }
    }

    if (tamanho == "10") {
        document.getElementById("limite").innerHTML =
            "Limite de 2 adicionais";
    } else {
        document.getElementById("limite").innerHTML =
            "Limite de 4 adicionais";
    }

    calcular();
}

function calcular() {
    var tamanho = Number(document.getElementById("tamanho").value);
    var adicionais = document.getElementsByClassName("adicional");
    var totalAcai = tamanho;

    for (var i = 0; i < adicionais.length; i++) {
        if (adicionais[i].checked) {
            totalAcai += Number(adicionais[i].value);
        }
    }

    var bairro = document.getElementById("bairro").value;
    var entrega = 0;

    if (bairro == "centro") {
        entrega = 5;
    } else if (bairro == "regiao") {
        entrega = 6;
    } else if (bairro == "aguas claras") {
        entrega = 8;
    } else if (bairro == "itaqui" || bairro == "partenope") {
        entrega = 10;
    }

    document.getElementById("valorAcai").innerHTML =
        "Açaí e adicionais: R$ " +
        totalAcai.toFixed(2).replace(".", ",");

    document.getElementById("valorEntrega").innerHTML =
        "Taxa de entrega: R$ " +
        entrega.toFixed(2).replace(".", ",");

    document.getElementById("resultado").innerHTML =
        "Total: R$ " +
        (totalAcai + entrega).toFixed(2).replace(".", ",");
}

function confirmar() {
    var nome = document.getElementById("nome").value.trim();
    var telefone = document.getElementById("telefone").value;
    var cep = document.getElementById("cep").value.trim();
    var endereco = document.getElementById("endereco").value.trim();
    var bairro = document.getElementById("bairro").value;

    if (nome == "" || telefone == "" ||
        endereco == "" || bairro == "") {
        alert("Preencha nome, telefone, rua e bairro!");
        return;
    }

    if (telefone.replace(/\D/g, "").length < 10) {
        alert("Digite o telefone com DDD!");
        return;
    }

    if (cep != "" && cep.replace(/\D/g, "").length != 8) {
        alert("Confira o CEP ou deixe o campo vazio.");
        return;
    }

    calcular();

    alert("Pedido confirmado!\n\n" +
        "Cliente: " + nome +
        "\nTelefone: " + telefone +
        "\nCEP: " + (cep || "Não informado") +
        "\nEndereço: " + endereco +
        "\nBairro: " + bairro + "\n" +
        document.getElementById("resultado").innerText);
}

var emojisAcai = [
    "🍧", "🫐", "🍇", "🥣", "🍨",
    "🍇", "🍧", "🫐", "🍨", "🥣"
];

for (var i = 0; i < 10; i++) {
    var emoji = document.createElement("div");

    emoji.className = "acai-caindo";
    emoji.innerHTML = emojisAcai[i];
    emoji.style.left = (i * 10) + "%";
    emoji.style.animationDelay = (i * 0.5) + "s";

    document.getElementById("chuva-acai").appendChild(emoji);
}

