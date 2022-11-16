var bd = openDatabase("meuBD", "1.0", "Meu Banco de Dados", 4080);

bd.transaction(function (criar) {
    criar.executeSql(
        "CREATE TABLE formulario (nome TEXT, idade INTEGER, altura FLOAT(2, 4), dataNasc DATE, contatos JSON)"
    );
});

bd.transaction(function (ler) {
    ler.executeSql(
        "SELECT * FROM formulario ",[], function(ler, resultado){
            console.log(JSON.parse(resultado.rows.item(resultado.rows.length -1).contatos))
        }
    );
});


function salvarInfo() {
    const nomeUsuario = document
        .getElementById("nome-usuario")
        .value.toUpperCase();

    const idadeUsuario = parseInt(
        document.getElementById("idade-usuario").value
    );

    const alturaUsuario = parseFloat(
        document.getElementById("altura-usuario").value
    );
    const dataNascUsuario = document.getElementById("data-nasc-usuario").value;
    const emailUsuario = document.getElementById("email-usuario").value;
    const telefoneUsuario = document.getElementById("telefone-usuario").value;

    const contatos = { "e-mail": emailUsuario, "tel": telefoneUsuario };

    if (nomeUsuario === "" || isNaN(idadeUsuario)) {
        alert("Faltam informações!");
        return false;
    }
    bd.transaction(function (inserir) {
        inserir.executeSql(
            "INSERT INTO formulario (nome, idade, altura, dataNasc, contatos) VALUES (?, ?, ?, ?, ?)",
            [nomeUsuario, idadeUsuario, alturaUsuario, dataNascUsuario, JSON.stringify(contatos)]
        );
    });
    document.getElementById("nome-usuario").value = "";
    document.getElementById("idade-usuario").value = "";
}

function pesquisaPorNome() {
    const nomeUsuario = document
        .getElementById("pesquisa-nome-usuario")
        .value.toUpperCase();

    bd.transaction(function (ler) {
        ler.executeSql(
            `SELECT * FROM formulario WHERE nome LIKE "%${nomeUsuario}%"`,
            // "SELECT * FROM formalurio WHERE nome=\"" + nomeUsuario + "\"",
            [],
            function (ler, resultados) {
                console.log(resultados);
                const tamanho = resultados.rows.length;

                const msg = tamanho + " linhas encontradas";
                console.log(msg);

                const nome = resultados.rows.item(tamanho - 1).nome;
                const idade = resultados.rows.item(tamanho - 1).idade;
                document.getElementById("pesquisa-nome-usuario").value = nome;
                document.getElementById("resultado-pesquisa").value = idade;
            }
        );
    });
}

function exibeBD() {
    bd.transaction(function (exibe) {
        exibe.executeSql(
            "SELECT * FROM formulario",
            [],
            function (exibe, resultados) {
                const tamanho = resultados.rows.length;
                let item;

                document.getElementById("lista-bd").innerHTML = "";

                for (let i = 0; i < tamanho; i++) {
                    item = resultados.rows.item(i);
                    document.getElementById(
                        "lista-bd"
                    ).innerHTML += `<p onclick="mostrarCartaoAltera('${item.nome}', ${item.idade})">Nome: ${item.nome}, ${item.idade} anos</p>`;
                }
            }
        );
    });
}

function alteraInfo() {
    const novoNome = document.getElementById("nome-alteracao").value;
    const novaIdade = parseInt(
        document.getElementById("idade-alteracao").value
    );

    bd.transaction(function (altera) {
        altera.executeSql(
            `UPDATE formulario SET nome="${novoNome}", idade=${novaIdade} WHERE nome="${nomeAtualParaEditar}" AND idade=${idadeAtualParaEditar}`
        );
    });

    exibeBD();
}
