
// document.addEventListener("deviceready", onDeviceReady, false);

// Criar ou abrir o banco sqLite
var db = window.sqlitePlugin.openDatabase({ name: 'alibus.db', location: 'default' });

// Criar as tabelas
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS congresso (id INTEGER PRIMARY KEY, congregacao TEXT, nome TEXT, rg TEXT UNIQUE, dias TEXT, poltrona TEXT, responsavel TEXT, pagamento TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS assembleia (id INTEGER PRIMARY KEY, congregacao TEXT, nome TEXT, rg TEXT UNIQUE, poltrona TEXT, responsavel TEXT, pagamento TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS indicadores (id INTEGER PRIMARY KEY, congregacao TEXT, nome TEXT, designacao TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS limpeza (id INTEGER PRIMARY KEY, congregacao TEXT, nome TEXT, designacao TEXT)');
});


// Adicionar a view principal
//var mainView = app.views.create('.view-main');

// Evento deviceready do Cordova
document.addEventListener('deviceready', onDeviceReady, false);

// Função chamada quando o dispositivo estiver pronto
function onDeviceReady() {
    // Preencher as tabelas ao clicar nos botões
    $('#btnCongresso').on('click', function () {
        mainView.router.navigate('/tabelasHTML/');
        consultarSQLite('congresso', 'tabela1');
    });

    $('#btnAssembleia').on('click', function () {
        mainView.router.navigate('/tabelasHTML/');
        consultarSQLite('assembleia', 'tabela2');
    });

    $('#btnIndicador').on('click', function () {
        mainView.router.navigate('/tabelasHTML/');
        consultarSQLite('indicadores', 'tabela3');
    });

    $('#btnLimpeza').on('click', function () {
        mainView.router.navigate('/tabelasHTML/');
        consultarSQLite('limpeza', 'tabela4');
    });
}

// ...

function consultarSQLite(tabelaNome, elementoID) {
    var db = window.sqlitePlugin.openDatabase({ name: 'alibus.db', location: 'default' });

    db.transaction(function (tx) {
        var query = 'SELECT * FROM ' + tabelaNome;

        tx.executeSql(query, [], function (tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var tabelaHTML = '<table>';
                for (var i = 0; i < len; i++) {
                    tabelaHTML += '<tr>';
                    for (var col in results.rows.item(i)) {
                        tabelaHTML += '<td>' + results.rows.item(i)[col] + '</td>';
                    }
                    tabelaHTML += '</tr>';
                }
                tabelaHTML += '</table>';

                // Inserir a tabela dinamicamente no elemento com o ID correspondente
                $('#' + elementoID).html(tabelaHTML);
            } else {
                // Exibir mensagem se nenhum dado for encontrado
                $('#' + elementoID).html('<p>Nenhum dado encontrado para ' + tabelaNome + '.</p>');
            }
        }, function (tx, error) {
            // Exibir mensagem de erro, se aplicável
            $('#' + elementoID).html('<p>Erro na consulta para ' + tabelaNome + '.</p>');
        });
    });
}




//Congresso

$("#btnSalvar").click(function () {
    adicionarRegistro();
});

function limparCampos() {
    // Lista de IDs dos campos a serem limpos
    var campos = ['input-congregacao', 'input-nome', 'input-rg', 'input-dias', 'input-poltrona', 'input-responsavel', 'input-pagamento'];

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
    var dias = $('#input-dias').val();
    var poltrona = $('#input-poltrona').val();
    var responsavel = $('#input-responsavel').val();
    var pagamento = $('#input-pagamento').val();

    // Verificação se há campos vazios
    if (!nome.trim()) {
        app.dialog.alert('Por favor, informe o nome!');
        return;
    }
    if (!dias.trim()) {
        app.dialog.alert('Por favor, informe os dias!');
        return;
    }

    // Inserir dados no banco
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO congresso (congregacao, nome, rg, dias, poltrona, responsavel, pagamento) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [congregacao, nome, rg, dias, poltrona, responsavel, pagamento],
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
        tx.executeSql('SELECT * FROM congresso', [], function (tx, res) {
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
                    $("#miolo").append(`
                        <div class="card">
                            <div class="card-header">Passageiro</div>
                            <div class="card-content card-content-padding">
                                <p><b>Id:</b> ${res.rows.item(i).id}</p>
                                <p><b>Congregação:</b> ${res.rows.item(i).congregacao}</p>
                                <p><b>Nome:</b> ${res.rows.item(i).nome}</p>
                                <p><b>RG:</b> ${res.rows.item(i).rg}</p>
                                <p><b>Dias:</b> ${res.rows.item(i).dias}</p>
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
    app.views.main.router.navigate('/listCongPessoas/');
});

// Função para deletar a tabela congresso
function deletarTabelaCongresso() {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS congresso', [], function (tx, res) {

            app.dialog.confirm('Tem certeza que quer deletar todos os dados dessa tabela?', function () {
                app.dialog.alert('Tabela "congresso" deletada com sucesso!', function () {
                    // Navegar de volta à página anterior
                    app.views.main.router.refreshPage();
                });
            });
            
        }, function (tx, error) {
            app.dialog.alert('Erro ao deletar tabela "congresso": ' + error.message);
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
    $('#input-dias').val(dias);
    $('#input-poltrona').val(poltrona);
    $('#input-responsavel').val(responsavel);
    $('#input-pagamento').val(pagamento);
}

// Adicionando um evento de inicialização da página para preencher o formulário
$(document).on('page:init', '.page[data-name="congresso"]', function (e) {
    var id = e.detail.route.params.id;
    var congregacao = e.detail.route.params.congregacao;
    var nome = e.detail.route.params.nome;
    var rg = e.detail.route.params.rg;
    var dias = e.detail.route.params.dias;
    var poltrona = e.detail.route.params.poltrona;
    var responsavel = e.detail.route.params.responsavel;
    var pagamento = e.detail.route.params.pagamento;

    // Chame a função para preencher o formulário com os dados passados
    preencherFormularioAtualizar(id, congregacao, nome, rg, dias, poltrona, responsavel, pagamento);
});

// Função para validar se os campos estão preenchidos
function validarCamposRegistro() {
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var rg = $('#input-rg').val();
    var dias = $('#input-dias').val();
    var poltrona = $('#input-poltrona').val();
    var responsavel = $('#input-responsavel').val();
    var pagamento = $('#input-pagamento').val();

    if (congregacao.trim() === '' || nome.trim() === '' || rg.trim() === '' || dias.trim() === '' || poltrona.trim() === '' || responsavel.trim() === '' || pagamento.trim() === '') {
        // Pelo menos um dos campos está vazio
        app.dialog.alert('Por favor, preencha todos os campos antes de atualizar.');
        return false;
    }

    return true;
}

// Função para atualizar o registro no banco de dados
function atualizarRegistro() {
    // Validar campos antes de prosseguir
    if (!validarCamposRegistro()) {
        return;
    }

    var id = $('#input-id').val();
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var rg = $('#input-rg').val();
    var dias = $('#input-dias').val();
    var poltrona = $('#input-poltrona').val();
    var responsavel = $('#input-responsavel').val();
    var pagamento = $('#input-pagamento').val();

    // Lógica para atualizar os dados no banco de dados
    db.transaction(function (tx) {
        tx.executeSql(
            'UPDATE congresso SET congregacao=?, nome=?, rg=?, dias=?, poltrona=?, responsavel=?, pagamento=? WHERE id=?',
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
    // Chama a função para validar os campos antes de atualizar
    if (validarCamposRegistro()) {
        // Se a validação for bem-sucedida, chama a função para atualizar
        atualizarRegistro();
    } else {
        // A validação falhou, você pode tomar alguma ação aqui se necessário
        console.log('A validação falhou. Não foi possível atualizar o registro.');
    }
});

// Evento de clique no botão Editar
$(document).on('click', '#btnEditarRegistro', function () {
    // Obtenha os dados do registro que você deseja editar
    var id = $('input#input-id').val();
    var congregacao = $('input#input-congregacao').val();
    var nome = $('input#input-nome').val();
    var rg = $('input#input-rg').val();
    var dias = $('select#input-dias').val();
    var poltrona = $('select#input-poltrona').val();
    var responsavel = $('input#input-responsavel').val();
    var pagamento = $('input#input-pagamento').val();

    // Use a função de navegação do Framework7 para ir para a página de edição
    app.views.main.router.navigate('/congresso/?id=' + id +
        '&congregacao=' + congregacao +
        '&nome=' + nome +
        '&rg=' + rg +
        '&dias=' + dias +
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
        tx.executeSql('SELECT * FROM congresso WHERE nome = ?', [nome], function (tx, res) {
            // Verificar se há resultados
            if (res.rows.length > 0) {
                var resultadoPesquisa = res.rows.item(0);

                // Preencher campos com os resultados da pesquisa
                $('#input-id').val(resultadoPesquisa.id);
                $('#input-congregacao').val(resultadoPesquisa.congregacao);
                $('#input-nome').val(resultadoPesquisa.nome);
                $('#input-rg').val(resultadoPesquisa.rg);
                $('#input-dias').val(resultadoPesquisa.dias);
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

////////////////////////////////////////////////////////////////////////////////////////////
// Assembléia

$("#btnAssembSalvar").click(function () {
    adicionarAssembRegistro();
});

function limparAssembCampos() {
    // Lista de IDs dos campos a serem limpos
    var campos = ['input-congregacao', 'input-nome', 'input-rg', 'input-poltrona', 'input-responsavel', 'input-pagamento'];

    // Limpar os campos
    campos.forEach(function (campoId) {
        $('#' + campoId).val('');
    });
}

// Add Registro
function adicionarAssembRegistro() {
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
                    limparAssembCampos();
                });
            },
            function (tx, error) {
                app.dialog.alert('Erro ao inserir registro: ' + error.message);
            });
    });
}

// Função para listar pessoas da assembleia
function ListarAssembPessoas() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM assembleia', [], function (tx, res) {
            var len = res.rows.length;
            $("#miolo2").empty();

            if (len === 0) {
                $("#miolo2").append(`
                    <div class="card card-outline">
                        <div class="card-content card-content-padding">Não existem registros</div>
                    </div>
                `);
            } else {
                for (var i = len - 1; i >= 0; i--) {
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

// Evento de clique no botão para listar pessoas da assembleia e navegar para outra página
$(document).on('click', '#btnListarAssembPessoas', function () {
    // Navega para a outra página
    app.views.main.router.navigate('/listAssebPessoas/');

    // Chama a função para listar pessoas da assembleia
    ListarAssembPessoas();
});





// Função para deletar a tabela congresso
function deletarTabelaAssembleia() {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS assembleia', [], function (tx, res) {

            app.dialog.confirm('Tem certeza que quer deletar todos os dados dessa tabela?', function () {
                app.dialog.alert('Tabela "Assembleia" deletada com sucesso!', function () {
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
$(document).on('click', '#drop2', function () {
    // Chame o método para deletar a tabela assembleia
    deletarTabelaAssembleia();
});

// Função para preencher o formulário com os dados existentes
function preencherFormularioAssembAtualizar(id, congregacao, nome, rg, poltrona, responsavel, pagamento) {
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
    preencherFormularioAssembAtualizar(id, congregacao, nome, rg, poltrona, responsavel, pagamento);
});

// Função para validar se os campos estão preenchidos
function validarCamposAssemb() {
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var rg = $('#input-rg').val();
    var poltrona = $('#input-poltrona').val();
    var responsavel = $('#input-responsavel').val();
    var pagamento = $('#input-pagamento').val();

    if (congregacao.trim() === '' || nome.trim() === '' || rg.trim() === '' || poltrona.trim() === '' || responsavel.trim() === '' || pagamento.trim() === '') {
        // Pelo menos um dos campos está vazio
        app.dialog.alert('Por favor, preencha todos os campos antes de atualizar.');
        return false;
    }

    return true;
}

// Função para atualizar o registro no banco de dados
function atualizarAssembRegistro() {
    // Validar campos antes de prosseguir
    if (!validarCamposAssemb()) {
        return;
    }

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
            [congregacao, nome, rg, poltrona, responsavel, pagamento, id],
            function (tx, res) {
                app.dialog.alert('Registro atualizado com sucesso!');
                // Atualizar a página em vez de retroceder
                app.views.main.router.refreshPage();
            },
            function (tx, error) {
                app.dialog.alert('Erro ao atualizar registro: ' + error.message);
            }
        );
    });
}

// Adicionando um evento de clique para o botão de atualizar
$(document).on('click', '#btnAtualizarAssembRegistro', function () {
    // Chama a função para validar os campos antes de atualizar
    if (validarCamposAssemb()) {
        // Se a validação for bem-sucedida, chama a função para atualizar
        atualizarAssembRegistro();
    } else {
        // A validação falhou, você pode tomar alguma ação aqui se necessário
        console.log('A validação falhou. Não foi possível atualizar o registro.');
    }
});

// Evento de clique no botão Editar
$(document).on('click', '#btnEditarAssembRegistro', function () {
    // Obtenha os dados do registro que você deseja editar
    var id = $('input#input-id').val();  
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
$(document).on('click', '#btnPesquisarAssembPorNome', function () {
    // Obter o nome da pesquisa
    var nomePesquisa = $('input#input-pesquisa-nome').val();

    // Chamar método de pesquisa por nome e preencher campos
    pesquisarAssembPorNome(nomePesquisa);
});

function pesquisarAssembPorNome(nome) {
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
function excluirAssembRegistro() {
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
$(document).on('click', '#btnAssembExcluir', function () {
    // Chame a função para excluir o registro
    excluirAssembRegistro();
});


/////////////////////////////////////////////////////////////////////////////////
// Indicador


$("#btnIndicadorSalvar").click(function () {
    adicionarIndicador();
});

function limparIndicadorCampos() {
    // Lista de IDs dos campos a serem limpos
    var campos = ['input-congregacao', 'input-nome', 'input-designacao'];

    // Limpar os campos
    campos.forEach(function (campoId) {
        $('#' + campoId).val('');
    });
}

// Add Registro
function adicionarIndicador() {
    // Recuperando os dados dos inputs
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var designacao = $('#input-designacao').val();

    // Verificação se há campos vazios
    if (!nome.trim()) {
        app.dialog.alert('Por favor, informe o nome!');
        return;
    }

    // Inserir dados no banco
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO indicadores (congregacao, nome, designacao) VALUES (?, ?, ?)',
            [congregacao, nome, designacao],
            function (tx, res) {
                app.dialog.alert('Registro salvo com sucesso!', function () {
                    // Limpar os campos após o salvamento
                    limparIndicadorCampos();
                });
            },
            function (tx, error) {
                app.dialog.alert('Erro ao inserir registro: ' + error.message);
            });
    });
}

// Função para listar pessoas da indicadores
function ListarIndicadores() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM indicadores', [], function (tx, res) {
            var len = res.rows.length;
            $("#miolo3").empty();

            if (len === 0) {
                $("#miolo3").append(`
                    <div class="card card-outline">
                        <div class="card-content card-content-padding">Não existem registros</div>
                    </div>
                `);
            } else {
                for (var i = 0; i < len; i++) {
                    $("#miolo3").append(`
                        <div class="card">
                            <div class="card-header">Voluntário</div>
                            <div class="card-content card-content-padding">
                                <p><b>Id:</b> ${res.rows.item(i).id}</p>
                                <p><b>Congregação:</b> ${res.rows.item(i).congregacao}</p>
                                <p><b>Nome:</b> ${res.rows.item(i).nome}</p>
                                <p><b>Designação:</b> ${res.rows.item(i).designacao}</p>
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

// Evento de clique no botão para listar pessoas da assembleia e navegar para outra página
$(document).on('click', '#btnListarIndicadores', function () {
    // Navega para a outra página
    app.views.main.router.navigate('/listIndicadores/');

    // Chama a função para listar pessoas da assembleia
    ListarIndicadores();
});





// Função para deletar a tabela congresso
function deletarTabelaIndicadores() {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS indicadores', [], function (tx, res) {

            app.dialog.confirm('Tem certeza que quer deletar todos os dados dessa tabela?', function () {
                app.dialog.alert('Tabela "Assembleia" deletada com sucesso!', function () {
                    // Navegar de volta à página anterior
                    app.views.main.router.refreshPage();
                });
            });
            
        }, function (tx, error) {
            app.dialog.alert('Erro ao deletar tabela "indicadores": ' + error.message);
        });
    });
}

// função botão delete
$(document).on('click', '#drop3', function () {
    // Chame o método para deletar a tabela assembleia
    deletarTabelaIndicadores();
});

// Função para preencher o formulário com os dados existentes
function preencherFormularioIndicadorAtualizar(id, congregacao, nome, designacao) {
    $('#input-id').val(id);
    $('#input-congregacao').val(congregacao);
    $('#input-nome').val(nome);
    $('#input-designacao').val(designacao);
}

// Adicionando um evento de inicialização da página para preencher o formulário
$(document).on('page:init', '.page[data-name="indicadores"]', function (e) {
    var id = e.detail.route.params.id;
    var congregacao = e.detail.route.params.congregacao;
    var nome = e.detail.route.params.nome;
    var designacao = e.detail.route.params.designacao;

    // Chame a função para preencher o formulário com os dados passados
    preencherFormularioIndicadorAtualizar(id, congregacao, nome, designacao);
});

// Função para validar se os campos estão preenchidos
function validarCamposIndicador() {
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var designacao = $('#input-designacao').val();

    if (congregacao.trim() === '' || nome.trim() === '' || designacao.trim() === '') {
        // Pelo menos um dos campos está vazio
        app.dialog.alert('Por favor, preencha todos os campos antes de atualizar.');
        return false;
    }

    return true;
}

// Função para atualizar o registro no banco de dados
function atualizarIndicador() {
    // Validar campos antes de prosseguir
    if (!validarCamposIndicador()) {
        return;
    }

    var id = $('#input-id').val();
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var designacao = $('#input-designacao').val();

    // Lógica para atualizar os dados no banco de dados
    db.transaction(function (tx) {
        tx.executeSql(
            'UPDATE indicadores SET congregacao=?, nome=?, designacao=? WHERE id=?',
            [congregacao, nome, designacao, id],
            function (tx, res) {
                app.dialog.alert('Registro atualizado com sucesso!');
                // Navegar de volta à página anterior ou realizar outras ações necessárias
                app.views.main.router.refreshPage();
            },
            function (tx, error) {
                app.dialog.alert('Erro ao atualizar registro: ' + error.message);
            }
        );
    });
}

// Evento de clique no botão para editar o registro
$(document).on('click', '#btnEditarIndicador', function () {
    // Chama a função para validar os campos antes de atualizar
    if (validarCamposIndicador()) {
        // Se a validação for bem-sucedida, chama a função para atualizar
        atualizarIndicador();
    } else {
        // A validação falhou, você pode tomar alguma ação aqui se necessário
        console.log('A validação falhou. Não foi possível atualizar o registro.');
    }
});

// Evento de clique no botão Pesquisar por Nome
$(document).on('click', '#btnPesqIndicadorPorNome', function () {
    // Obter o nome da pesquisa
    var nomePesquisa = $('input#input-pesquisa-nome').val();

    // Chamar método de pesquisa por nome e preencher campos
    pesquisarIndicadorPorNome(nomePesquisa);
});

function pesquisarIndicadorPorNome(nome) {
    // Iniciar uma transação
    db.transaction(function (tx) {
        // Executar a consulta SQL
        tx.executeSql('SELECT * FROM indicadores WHERE nome = ?', [nome], function (tx, res) {
            // Verificar se há resultados
            if (res.rows.length > 0) {
                var resultadoPesquisa = res.rows.item(0);

                // Preencher campos com os resultados da pesquisa
                $('#input-id').val(resultadoPesquisa.id);
                $('#input-congregacao').val(resultadoPesquisa.congregacao);
                $('#input-nome').val(resultadoPesquisa.nome);
                $('#input-designacao').val(resultadoPesquisa.designacao);
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
function excluirIndicador() {
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
            tx.executeSql('DELETE FROM indicadores WHERE id = ?', [id], function (tx, res) {
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
$(document).on('click', '#btnIndicadorExcluir', function () {
    // Chame a função para excluir o registro
    excluirIndicador();
});



/////////////////////////////////////////////////////////////////////////////////////////////////
//Limpeza



$("#btnLimpezaSalvar").click(function () {
    adicionarLimpeza();
});

function limparLimpezaCampos() {
    // Lista de IDs dos campos a serem limpos
    var campos = ['input-congregacao', 'input-nome', 'input-designacao'];

    // Limpar os campos
    campos.forEach(function (campoId) {
        $('#' + campoId).val('');
    });
}

// Add Registro
function adicionarLimpeza() {
    // Recuperando os dados dos inputs
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var designacao = $('#input-designacao').val();

    // Verificação se há campos vazios
    if (!nome.trim()) {
        app.dialog.alert('Por favor, informe o nome!');
        return;
    }

    // Inserir dados no banco
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO limpeza (congregacao, nome, designacao) VALUES (?, ?, ?)',
            [congregacao, nome, designacao],
            function (tx, res) {
                app.dialog.alert('Registro salvo com sucesso!', function () {
                    // Limpar os campos após o salvamento
                    limparLimpezaCampos();
                });
            },
            function (tx, error) {
                app.dialog.alert('Erro ao inserir registro: ' + error.message);
            });
    });
}

// Função para listar pessoas da indicadores
function ListarLimpeza() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM limpeza', [], function (tx, res) {
            var len = res.rows.length;
            $("#miolo4").empty();

            if (len === 0) {
                $("#miolo4").append(`
                    <div class="card card-outline">
                        <div class="card-content card-content-padding">Não existem registros</div>
                    </div>
                `);
            } else {
                for (var i = 0; i < len; i++) {
                    $("#miolo4").append(`
                        <div class="card">
                            <div class="card-header">Voluntário</div>
                            <div class="card-content card-content-padding">
                                <p><b>Id:</b> ${res.rows.item(i).id}</p>
                                <p><b>Congregação:</b> ${res.rows.item(i).congregacao}</p>
                                <p><b>Nome:</b> ${res.rows.item(i).nome}</p>
                                <p><b>Designação:</b> ${res.rows.item(i).designacao}</p>
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

// Evento de clique no botão para listar pessoas da assembleia e navegar para outra página
$(document).on('click', '#btnListarLimpeza', function () {
    // Navega para a outra página
    app.views.main.router.navigate('/listLimpeza/');

    // Chama a função para listar pessoas da assembleia
    ListarLimpeza();
});





// Função para deletar a tabela congresso
function deletarTabelaLimpeza() {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS limpeza', [], function (tx, res) {

            app.dialog.confirm('Tem certeza que quer deletar todos os dados dessa tabela?', function () {
                app.dialog.alert('Tabela "Assembleia" deletada com sucesso!', function () {
                    // Navegar de volta à página anterior
                    app.views.main.router.refreshPage();
                });
            });
            
        }, function (tx, error) {
            app.dialog.alert('Erro ao deletar tabela "limpeza": ' + error.message);
        });
    });
}

// função botão delete
$(document).on('click', '#drop3', function () {
    // Chame o método para deletar a tabela assembleia
    deletarTabelaLimpeza();
});

// Função para preencher o formulário com os dados existentes
function preencherFormularioLimpezaAtualizar(id, congregacao, nome, designacao) {
    $('#input-id').val(id);
    $('#input-congregacao').val(congregacao);
    $('#input-nome').val(nome);
    $('#input-designacao').val(designacao);
}

// Adicionando um evento de inicialização da página para preencher o formulário
$(document).on('page:init', '.page[data-name="limpeza"]', function (e) {
    var id = e.detail.route.params.id;
    var congregacao = e.detail.route.params.congregacao;
    var nome = e.detail.route.params.nome;
    var designacao = e.detail.route.params.designacao;

    // Chame a função para preencher o formulário com os dados passados
    preencherFormularioLimpezaAtualizar(id, congregacao, nome, designacao);
});



// Função para validar se os campos estão preenchidos
function validarCampos() {
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var designacao = $('#input-designacao').val();

    if (congregacao.trim() === '' || nome.trim() === '' || designacao.trim() === '') {
        // Pelo menos um dos campos está vazio
        app.dialog.alert('Por favor, preencha todos os campos antes de atualizar.');
        return false;
    }

    return true;
}

// Função para atualizar o registro no banco de dados
function atualizarLimpeza() {
    // Validar campos antes de prosseguir
    if (!validarCampos()) {
        return;
    }

    var id = $('#input-id').val();
    var congregacao = $('#input-congregacao').val();
    var nome = $('#input-nome').val();
    var designacao = $('#input-designacao').val();

    // Lógica para atualizar os dados no banco de dados
    db.transaction(function (tx) {
        tx.executeSql(
            'UPDATE limpeza SET congregacao=?, nome=?, designacao=? WHERE id=?',
            [congregacao, nome, designacao, id],
            function (tx, res) {
                app.dialog.alert('Registro atualizado com sucesso!');
                // Navegar de volta à página anterior ou realizar outras ações necessárias
                app.views.main.router.refreshPage();
            },
            function (tx, error) {
                app.dialog.alert('Erro ao atualizar registro: ' + error.message);
            }
        );
    });
}

// Evento de clique no botão para editar o registro
$(document).on('click', '#btnEditarLimpeza', function () {
    // Chama a função para validar os campos antes de atualizar
    if (validarCampos()) {
        // Se a validação for bem-sucedida, chama a função para atualizar
        atualizarLimpeza();
    } else {
        // A validação falhou, você pode tomar alguma ação aqui se necessário
        console.log('A validação falhou. Não foi possível atualizar o registro.');
    }
});





function pesquisarLimpezaPorNome(nome) {
    // Iniciar uma transação
    db.transaction(function (tx) {
        // Executar a consulta SQL
        tx.executeSql('SELECT * FROM limpeza WHERE nome = ?', [nome], function (tx, res) {
            // Verificar se há resultados
            if (res.rows.length > 0) {
                var resultadoPesquisa = res.rows.item(0);

                // Preencher campos com os resultados da pesquisa
                $('#input-id').val(resultadoPesquisa.id);
                $('#input-congregacao').val(resultadoPesquisa.congregacao);
                $('#input-nome').val(resultadoPesquisa.nome);
                $('#input-designacao').val(resultadoPesquisa.designacao);
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
// Evento de clique no botão Pesquisar por Nome
$(document).on('click', '#btnPesqLimpezaPorNome', function () {
    // Obter o nome da pesquisa
    var nomePesquisa = $('input#input-pesquisa-nome').val();

    // Chamar método de pesquisa por nome e preencher campos
    pesquisarLimpezaPorNome(nomePesquisa);
});

// Função para excluir o registro com base no ID fornecido no campo input-id
// Função para excluir o registro
function excluirLimpeza() {
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
            tx.executeSql('DELETE FROM limpeza WHERE id = ?', [id], function (tx, res) {
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
$(document).on('click', '#btnLimpezaExcluir', function () {
    // Chame a função para excluir o registro
    excluirLimpeza();
});
