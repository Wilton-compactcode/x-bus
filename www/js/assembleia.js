
$("#btnSalvar").click(function () {
    adicionarRegistro();
});

function limparCampos() {
    // Lista de IDs dos campos a serem limpos
    var campos = ['input-congregacao', 'input-nome', 'input-rg', 'input-poltrona', 'input-responsavel', 'input-pagamento'];

    // Limpar os campos
    campos.forEach(function (campoId) {
        $('#' + campoId).val('');
    });
}

// Add Registro
function adicionarRegistro() {
    // Recuperando os dados dos inputs
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var rg = $('#input-rg').val();
    var poltrona = $('#input-poltrona').val();
    var responsavel = $('#input-responsavel').val();
    var pagamento = $('#input-pagamento').val();

    // Verificação se há campos vazios
    if (!nome.trim()) {
        app.dialog.alert('Por favor, informe o nome!');
        return;
    }

    // Inserir dados no banco
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO assembleia (congregacao, nome, rg, poltrona, responsavel, pagamento) VALUES (?, ?, ?, ?, ?, ?)',
            [congregacao, nome, rg, poltrona, responsavel, pagamento],
            function (tx, res) {
                app.dialog.alert('Registro salvo com sucesso!', function () {
                    // Limpar os campos após o salvamento
                    limparCampos();
                });
            },
            function (tx, error) {
                app.dialog.alert('Erro ao inserir registro: ' + error.message);
            });
    });
}

function ListarPessoas() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM assembleia', [], function (tx, res) {
            // Quantas linhas de registros
            var len = res.rows.length;
            $("#miolo").empty();

            // Verificar quantidade
            if (len === 0) {
                $("#miolo").append(`
                    <div class="card card-outline">
                        <div class="card-content card-content-padding">Não existem registros</div>
                    </div>
                `);
            } else {
                for (var i = 0; i < len; i++) {
                    $("#miolo2").append(`
                        <div class="card">
                            <div class="card-header">Passageiro</div>
                            <div class="card-content card-content-padding">
                                <p><b>Id:</b> ${res.rows.item(i).id}</p>
                                <p><b>Congregação:</b> ${res.rows.item(i).congregacao}</p>
                                <p><b>Nome:</b> ${res.rows.item(i).nome}</p>
                                <p><b>RG:</b> ${res.rows.item(i).rg}</p>
                                <p><b>Poltrona:</b> ${res.rows.item(i).poltrona}</p>
                                <p><b>Responsável:</b> ${res.rows.item(i).responsavel}</p>
                                <p><b>Pagamento:</b> ${res.rows.item(i).pagamento}</p>
                            </div>
                        </div>
                    `);
                }
            }
        }, function (tx, error) {
            console.error('Erro na consulta SQL:', error);
        });
    }, function (error) {
        console.error('Erro na transação:', error);
    });
}


$(document).on('deviceready', function () {
    ListarPessoas();
});

$(document).on('click', '#btnConsultar', function () {
    // Navega para a outra página
    app.views.main.router.navigate('/listAssembPessoas/');
});

// Função para deletar a tabela congresso
function deletarTabelaCongresso() {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS assembleia', [], function (tx, res) {

            app.dialog.confirm('Tem certeza que quer deletar todos os dados dessa tabela?', function () {
                app.dialog.alert('Tabela "congresso" deletada com sucesso!', function () {
                    // Navegar de volta à página anterior
                    app.views.main.router.refreshPage();
                });
            });
            
        }, function (tx, error) {
            app.dialog.alert('Erro ao deletar tabela "assembleia": ' + error.message);
        });
    });
}

// função botão delete
$(document).on('click', '#drop', function () {
    // Chame o método para deletar a tabela congresso
    deletarTabelaCongresso();
});

// Função para preencher o formulário com os dados existentes
function preencherFormularioAtualizar(id, congregacao, nome, rg, dias, poltrona, responsavel, pagamento) {
    $('#input-id').val(id);
    $('#input-congregacao').val(congregacao);
    $('#input-nome').val(nome);
    $('#input-rg').val(rg);
    $('#input-poltrona').val(poltrona);
    $('#input-responsavel').val(responsavel);
    $('#input-pagamento').val(pagamento);
}

// Adicionando um evento de inicialização da página para preencher o formulário
$(document).on('page:init', '.page[data-name="assembleia"]', function (e) {
    var id = e.detail.route.params.id;
    var congregacao = e.detail.route.params.congregacao;
    var nome = e.detail.route.params.nome;
    var rg = e.detail.route.params.rg;
    var poltrona = e.detail.route.params.poltrona;
    var responsavel = e.detail.route.params.responsavel;
    var pagamento = e.detail.route.params.pagamento;

    // Chame a função para preencher o formulário com os dados passados
    preencherFormularioAtualizar(id, congregacao, nome, rg, dias, poltrona, responsavel, pagamento);
});

// Função para atualizar o registro no banco de dados
function atualizarRegistro() {
    var id = $('#input-id').val();
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var rg = $('#input-rg').val();
    var poltrona = $('#input-poltrona').val();
    var responsavel = $('#input-responsavel').val();
    var pagamento = $('#input-pagamento').val();

    // Lógica para atualizar os dados no banco de dados
    db.transaction(function (tx) {
        tx.executeSql(
            'UPDATE assembleia SET congregacao=?, nome=?, rg=?, poltrona=?, responsavel=?, pagamento=? WHERE id=?',
            [congregacao, nome, rg, dias, poltrona, responsavel, pagamento, id],
            function (tx, res) {
                app.dialog.alert('Registro atualizado com sucesso!');
                // Navegar de volta à página anterior
                app.views.main.router.refreshPage();
            },
            function (tx, error) {
                app.dialog.alert('Erro ao atualizar registro: ' + error.message);
            }
        );
    });
}

// Adicionando um evento de clique para o botão de atualizar
$(document).on('click', '#btnAtualizarRegistro', function () {
    // Chame a função para atualizar o registro
    atualizarRegistro();
});


// Evento de clique no botão Editar
$(document).on('click', '#btnEditarRegistro', function () {
    // Obtenha os dados do registro que você deseja editar
    var id = $('input#input-id').val();  // Substitua isso pelo ID real do registro que você deseja editar
    var congregacao = $('input#input-congregacao').val();
    var nome = $('input#input-nome').val();
    var rg = $('input#input-rg').val();
    var poltrona = $('select#input-poltrona').val();
    var responsavel = $('input#input-responsavel').val();
    var pagamento = $('input#input-pagamento').val();

    // Use a função de navegação do Framework7 para ir para a página de edição
    app.views.main.router.navigate('/assembleia/?id=' + id +
        '&congregacao=' + congregacao +
        '&nome=' + nome +
        '&rg=' + rg +
        '&poltrona=' + poltrona +
        '&responsavel=' + responsavel +
        '&pagamento=' + pagamento);
});

// Evento de clique no botão Pesquisar por Nome
$(document).on('click', '#btnPesquisarPorNome', function () {
    // Obter o nome da pesquisa
    var nomePesquisa = $('input#input-pesquisa-nome').val();

    // Chamar método de pesquisa por nome e preencher campos
    pesquisarPorNome(nomePesquisa);
});

function pesquisarPorNome(nome) {
    // Iniciar uma transação
    db.transaction(function (tx) {
        // Executar a consulta SQL
        tx.executeSql('SELECT * FROM assembleia WHERE nome = ?', [nome], function (tx, res) {
            // Verificar se há resultados
            if (res.rows.length > 0) {
                var resultadoPesquisa = res.rows.item(0);

                // Preencher campos com os resultados da pesquisa
                $('#input-id').val(resultadoPesquisa.id);
                $('#input-congregacao').val(resultadoPesquisa.congregacao);
                $('#input-nome').val(resultadoPesquisa.nome);
                $('#input-rg').val(resultadoPesquisa.rg);
                $('#input-poltrona').val(resultadoPesquisa.poltrona);
                $('#input-responsavel').val(resultadoPesquisa.responsavel);
                $('#input-pagamento').val(resultadoPesquisa.pagamento);
            } else {
                // Se nenhum resultado for encontrado, você pode lidar com isso aqui
                app.dialog.alert('Nenhum resultado encontrado para o nome: ' + nome);
            }
        }, function (tx, error) {
            // Lida com erros
            app.dialog.alert('Erro na consulta: ' + error.message);
        });
    });
}

// Função para excluir o registro com base no ID fornecido no campo input-id
// Função para excluir o registro
function excluirRegistro() {
    // Obter o ID do campo input-id
    var id = $('#input-id').val();

    // Verificar se o ID é válido (não está vazio)
    if (!id) {
        app.dialog.alert('Por favor, informe um ID válido para excluir o registro.');
        return;
    }

    // Mostrar um diálogo de confirmação
    app.dialog.confirm('Tem certeza que quer deletar esse registro?', function () {
        // Iniciar uma transação
        db.transaction(function (tx) {
            // Executar a instrução DELETE
            tx.executeSql('DELETE FROM congresso WHERE id = ?', [id], function (tx, res) {
                // Verificar se a exclusão foi bem-sucedida
                if (res.rowsAffected > 0) {
                    app.dialog.alert('Registro excluído com sucesso!');
                    // Redirecionar para a página anterior
                    app.views.main.router.back();
                } else {
                    app.dialog.alert('Nenhum registro foi excluído. Verifique o ID.');
                }
            }, function (tx, error) {
                // Lidar com erros
                app.dialog.alert('Erro ao excluir registro: ' + error.message);
            });
        });
    });
}

// Associar a função de exclusão ao clique no botão
$(document).on('click', '#btnExcluir', function () {
    // Chame a função para excluir o registro
    excluirRegistro();
});


