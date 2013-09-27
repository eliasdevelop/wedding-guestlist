//CREATE DB
var banco = openDatabase(
		'bancoDados',
		'1.0',
		'Banco de dados referente ao armazenamento mobile',
		2 * 1024 * 1024
);

localStorage.setItem('ordemListagem', "alfabetica");

function carregarConvidados () {
	carregarConvidadosDela();
	carregarConvidadosDele();
	carregarConvidadosAmbos();
}

function carregarConvidadosDele(){
	var selectSQL = "";
	var ordem = localStorage.getItem('ordemListagem');
	if(ordem == "alfabetica"){
		selectSQL = 'SELECT * FROM convidados WHERE convidadoDe = "dele" ORDER BY nome';
	}else{
		selectSQL = 'SELECT * FROM convidados WHERE convidadoDe = "dele"';
	}
	banco.transaction( function (tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, nome, convidadoDe, tipoConvidado, email, endereco, cidade, cep, telefone)', [],
			function () {	
			 tx.executeSql( selectSQL, [],
			        function (tx, results){    	  
			          	var quant = results.rows.length;
			          	var listaConvidado = "";
			          	var listaPadrinho = "";
			          	for (var i = 0; i < quant; i++)
			          	{
			           	  	var convidado = results.rows.item(i);
							if (convidado.tipoConvidado == "padrinho") {
								listaPadrinho = listaPadrinho + "<li data-icon='user'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user'></span>" + convidado.nome + "</a></li>";
							} else {
								listaConvidado = listaConvidado + "<li data-icon='user-special'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user-special'></span>" + convidado.nome + "</a></li>";
							}

			            }   
		          		$('#padrinhosDele').html(listaPadrinho); 
		          		$('#convidadosDele').html(listaConvidado);   
		          
					},
			        function (tx, error)
			        {
			         	alert('Ops.. ' + error.message);
			        });
			});
	});
}

function carregarConvidadosDela(){
	var selectSQL = "";
	var ordem = localStorage.getItem('ordemListagem');
	if(ordem == "alfabetica"){
		selectSQL = 'SELECT * FROM convidados WHERE convidadoDe = "dela" ORDER BY nome';
	}else{
		selectSQL = 'SELECT * FROM convidados WHERE convidadoDe = "dela"';
	}
	banco.transaction( function (tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, nome, convidadoDe, tipoConvidado, email, endereco, cidade, cep, telefone)', [],
			function () {
			 tx.executeSql( selectSQL, [],
			        function (tx, results){    	  
			          	var quant = results.rows.length;
			          	var listaConvidado = "";
			          	var listaPadrinho = "";
			          	for (var i = 0; i < quant; i++)
			          	{
			           	  	var convidado = results.rows.item(i);
							if (convidado.tipoConvidado == "padrinho") {
								listaPadrinho = listaPadrinho + "<li data-icon='user'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user'></span>" + convidado.nome + "</a></li>";
							} else {
								listaConvidado = listaConvidado + "<li data-icon='user-special'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user-special'></span>" + convidado.nome + "</a></li>";
							}
			            }   
		          		$('#padrinhosDela').html(listaPadrinho); 
		          		$('#convidadosDela').html(listaConvidado);   
		          
					},
			        function (tx, error)
			        {
			         	alert('Ops.. ' + error.message);
			        });
			});
	});
}

function carregarConvidadosAmbos(){
	var selectSQL = "";
	var ordem = localStorage.getItem('ordemListagem');
	if(ordem == "alfabetica"){
		selectSQL = 'SELECT * FROM convidados ORDER BY nome';
	}else{
		selectSQL = 'SELECT * FROM convidados';
	}
	banco.transaction( function (tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, nome, convidadoDe, tipoConvidado, email, endereco, cidade, cep, telefone)', [],
			function () {
			 tx.executeSql( selectSQL , [],
			        function (tx, results){    	  
			          	var quant = results.rows.length;
			          	var listaConvidado = "";
			          	var listaPadrinhoDele = "";
			          	var listaPadrinhoDela = "";
			          	for (var i = 0; i < quant; i++)
			          	{
			           	  	var convidado = results.rows.item(i);
							if (convidado.tipoConvidado == "padrinho") {
								if(convidado.convidadoDe == "dele"){
									listaPadrinhoDele = listaPadrinhoDele + "<li data-icon='user'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user'></span>" + convidado.nome + "</a></li>";
								}else{
									listaPadrinhoDela = listaPadrinhoDela + "<li data-icon='user'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user'></span>" + convidado.nome + "</a></li>";
								}								
							} else {
								listaConvidado = listaConvidado + "<li data-icon='user-special'><a onclick='abrirDetalhes("+ convidado.codigo +")' class='km-listview-link' data-role='listview-link'><span class='km-icon km-user-special'></span>" + convidado.nome + "</a></li>";
							}
			            }   
		          		$('#padrinhosDeleAmbos').html(listaPadrinhoDele);
		          		$('#padrinhosDelaAmbos').html(listaPadrinhoDela);  
		          		$('#convidadosAmbos').html(listaConvidado);   
					},
			        function (tx, error)
			        {
			         	alert('Ops.. ' + error.message);
			        });
			});
	});
}

function atualizarIndices () {
	atualizarIndiceDele();
	atualizarIndiceDela();
	atualizarIndiceTotal();
}

function atualizarIndiceDele(){
	banco.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep)', [],
			function () {
				tx.executeSql('SELECT * FROM convidados WHERE convidadoDe="dele"', [],
					 function (tx, results){    	  
				        var quant = results.rows.length;
				        $('#quantDele').text(quant);
			         },
			         function (tx, error)
			         {
			            alert('Ops...' + error.message);
			         }
			    );
			}
		);    
	});
}

function atualizarIndiceDela(){
	banco.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep)', [],
			function () {
				tx.executeSql('SELECT * FROM convidados WHERE convidadoDe="dela"', [],
					 function (tx, results){    	  
				        var quant = results.rows.length;
				        $('#quantDela').text(quant);
			         },
			         function (tx, error)
			         {
			            alert('Ops...' + error.message);
			         }
			    );
			}
		);    
	});
}

function atualizarIndiceTotal(){
	banco.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep)', [],
			function () {
				tx.executeSql('SELECT * FROM convidados', [],
					 function (tx, results){    	  
				        var quant = results.rows.length;
				        $('#quantTotal').text(quant);
			         },
			         function (tx, error)
			         {
			            alert('Ops...' + error.message);
			         }
			    );
			}
		);    
	});
}


