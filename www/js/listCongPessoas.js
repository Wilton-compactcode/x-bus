

function ListarPessoas() {

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM congresso',[], function (tx, res) {
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
                            <div class="card-header">${res.rows.item(i).congregacao}</div>
                            <div class="card-content card-content-padding">
                                <p><b>Congregação:</b> ${res.rows.item(i).congregacao}</p>
                                <p><b>Nome:</b> ${res.rows.item(i).nome}</p>
                                <p><b>RG:</b> ${res.rows.item(i).rg}</p>
                                <p><b>Dias:</b> ${res.rows.item(i).dias}</p>
                                <p><b>Poltrona:</b> ${res.rows.item(i).poltrona}</p>
                                <p><b>Responsável:</b> ${res.rows.item(i).responsavel}</p>
                                <p><b>Pagamento:</b> ${res.rows.item(i).pagamento}</p>
                            </div>
                            <div class="card-footer">
                                <button class="button">Atualizar</button>
                                <button class="button">Deletar</button>
                            </div>
                        </div>
                    `);
                }
            }
        });
    });
}



$(document).on('deviceready', function() {
    ListarPessoas();
});
