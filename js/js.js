carregarConvidados();
atualizarIndices();
verificarTipoListagem();

function addOuEdit () {
	if(isAdd() == true){
		inserirConvidado();
	}else{
		editarConvidado();
	}
}

function inserirConvidado () {
	var convidadoDe = $('#slcConvidadoDe').val();
	var tipoConvidado = $('#slcTipoConvidado').val();
	var nome = $('#txtNome').val();
	var email = $('#txtEmail').val();
	var telefone = $('#txtTelefone').val();
	var endereco = $('#txtEndereco').val();
	var cidade = $('#txtCidade').val();
	var cep = $('#txtCep').val();

	if(nome != ""){
		banco.transaction(function (tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep)', [],
				function () {
					tx.executeSql("INSERT INTO convidados (convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep]);
					carregarConvidados();
					atualizarIndices();
					limparFormulario();
					mostraMsg('#msgAddSucesso');

					var time = setInterval(function() { 
						someMsg('#msgAddSucesso');
						clearInterval(time);
					}, 2500);
				},
				function (tx, error)
				{
				    alert('Ops... ' + error.message);
				}
			);	
		});
	}else{
		mostraMsg('#msgErroValida');
		var time = setInterval(function() { 
						someMsg('#msgErroValida');
						clearInterval(time);
		}, 2500);
	}
		
}	

function visualizarConvidado (codigo) {
	banco.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep)', [],
			function () {
				tx.executeSql('SELECT * FROM convidados WHERE codigo="' + codigo + '"', [], function(tx, results) {
			      	var quant = results.rows.length;
			      	var i;
			      	for(i=0; i < quant; i++) {
			      	  	var convidado = results.rows.item(i);
			        	$('#slcConvidadoDe').val(convidado.convidadoDe);
						$('#slcTipoConvidado').val(convidado.tipoConvidado);
						$('#txtNome').val(convidado.nome);
						$('#txtEmail').val(convidado.email);
						$('#txtTelefone').val(convidado.telefone);
						$('#txtEndereco').val(convidado.endereco);
						$('#txtCidade').val(convidado.cidade);
						$('#txtCep').val(convidado.cep);
			     	}
			     	setEdit();
			     	$('#txtNome').attr("name", codigo);
			     	app.navigate('#addEdit', 'slide:up');
			    },
				function (tx, error)
				{
				    alert('Ops... ' + error.message);
				}
			);		
		});
	});	
}

function editarConvidado () {
	var codigo = $('#txtNome').attr("name");
	var convidadoDe = $('#slcConvidadoDe').val();
	var tipoConvidado = $('#slcTipoConvidado').val();
	var nome = $('#txtNome').val();
	var email = $('#txtEmail').val();
	var telefone = $('#txtTelefone').val();
	var endereco = $('#txtEndereco').val();
	var cidade = $('#txtCidade').val();
	var cep = $('#txtCep').val();

	if(nome != ""){
		banco.transaction(function (tx){
			tx.executeSql("UPDATE convidados SET convidadoDe=?, tipoConvidado=?, nome=?, email=?, telefone=?, endereco=?, cidade=?, cep=? WHERE codigo=?", [convidadoDe, tipoConvidado, nome, email, telefone, endereco, cidade, cep, codigo]);
			carregarConvidados();
			atualizarIndices();
			limparFormulario();
			mostraMsg('#msgEditSucesso');

			var time = setInterval(function() { 
				someMsg('#msgEditSucesso');
				clearInterval(time);
			}, 2500);	
		});
	}else{
		mostraMsg('#msgErroValida');
		var time = setInterval(function() { 
						someMsg('#msgErroValida');
						clearInterval(time);
		}, 2500);
	}
}

function excluirConvidado (codigo) {
	banco.transaction(function (tx){
		tx.executeSql("DELETE FROM convidados WHERE codigo=?", [codigo]);
		carregarConvidados();
		atualizarIndices();
		limparFormulario();
	    app.navigate('#ambos', 'slide:down');
	});
}

function limparFormulario () {
	$('#txtNome').val("");
	$('#txtEmail').val("");
	$('#txtTelefone').val("");
	$('#txtEndereco').val("");
	$('#txtCidade').val("");
	$('#txtCep').val("");
}

function someMsg (id) {
	$(id).attr("style", "display:none;color:rgb(16,196,178)");
}

function mostraMsg (id) {
	$(id).attr("style", "display:block;color:rgb(16,196,178)");
}

function setAdd () {
	$('#tituloForm').text("Add Convidado");
	$('#tituloForm').attr("name","add");
}

function setEdit () {
	$('#tituloForm').text("Edit Convidado");
	$('#tituloForm').attr("name","edit");
}

function isAdd () {
	var tipo = $('#tituloForm').attr("name");
	if(tipo == "add"){
		return true;
	}else{
		return false;
	}
}

function maisOpcoesClick(e) {
    var id = e.target.context.id;
    switch (id) {
		case 'add':
			setAdd();
		break;
		case 'enviarEmail':
			enviarEmail();
		break;
		case 'sobre':
			console.log("sobre");
		break;
	}
}

function detalhesClick(e) {
    var id = e.target.context.id;
    var codigo = $('#editDelete').attr("name");
    switch (id) {
		case 'edit':
			visualizarConvidado(codigo);
		break;
		case 'delete':
			excluirConvidado(codigo);
		break;
	}
}

function abrirDetalhes(codigo){
	app.navigate('#detalhes', 'slide:up');
	$('#editDelete').attr("name", codigo);
}

function listarPor () {
	var tipoListagem = $('#slcListarPor').val();
	if(tipoListagem == "alfabetica"){
		localStorage.setItem('ordemListagem', "alfabetica");
	}else{
		localStorage.setItem('ordemListagem', "insercao");
	}
	carregarConvidados();
	mostraMsg('#msgAlteradoSucesso');
	var time = setInterval(function() { 
		someMsg('#msgAlteradoSucesso');
		clearInterval(time);
	}, 2500);	
}	

function enviarEmail(){
	
	var convidados;
	var space = "%09%0D%0A";
	banco.transaction( function (tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS convidados (codigo integer primary key autoincrement, nome, convidadoDe, tipoConvidado, email, endereco, cidade, cep, telefone)', [],
			function () {
			 tx.executeSql( 'SELECT * FROM convidados ORDER BY nome', [],
			        function (tx, results){    	  
			          	var quant = results.rows.length;
			          	var listaPadrinhoDele = "Padrinhos/Madrinhas do Noivo:" + space + "------------------------------------------";
			          	var listaPadrinhoDela = space + space +"Padrinhos/Madrinhas da Noiva:" + space + "------------------------------------------";
			          	var listaConvidado = space + space + "Convidados do Casamento:" + space + "------------------------------------";
			          	
			          	for (var i = 0; i < quant; i++)
			          	{
			           	  	var convidado = results.rows.item(i);
			           	  	var nome = "Nome: " + convidado.nome + space;
			           	  	var telefone = "";
			           	  	var email = "";
			           	  	var endereco = "";
			           	  	var cidade = "";
			           	  	var cep = "";

			           	  	if(convidado.telefone == ""){
			           	  		telefone = "";
			           	  	}else{
			           	  		telefone = "Telefone: " + convidado.telefone + space;
			           	  	}
			           	  	if(convidado.email == ""){
			           	  		email = "";
			           	  	}else{
			           	  		email = "Email: " + convidado.email + space;
			           	  	}
			           	  	if(convidado.endereco == ""){
			           	  		endereco = "";
			           	  	}else{
			           	  		endereco = "Endereco: " + convidado.endereco + space;
			           	  	}
			           	  	if(convidado.cidade == ""){
			           	  		cidade = "";
			           	  	}else{
			           	  		cidade = "Cidade: " + convidado.cidade + space;
			           	  	}
			           	  	if(convidado.cep == ""){
			           	  		cep = "";
			           	  	}else{
			           	  		cep = "CEP: " + convidado.cep;
			           	  	}

							if (convidado.tipoConvidado == "padrinho") {
								if(convidado.convidadoDe == "dele"){
									listaPadrinhoDele = listaPadrinhoDele + space + nome + telefone + email  + endereco + cidade + cep;
								}else{
									listaPadrinhoDela = listaPadrinhoDela + space + nome + telefone + email  + endereco + cidade + cep;
								}								
							} else {
								listaConvidado = listaConvidado + space + nome + telefone + email  + endereco + cidade + cep;
							}
			            }
			            convidados = listaPadrinhoDele + listaPadrinhoDela + listaConvidado;
			            
						var link = 'mailto:?subject=' + escape("Convidados Casamento @GuestList") + '&body=' + convidados; 
						window.location.href = link;  
		          		 
					},
			        function (tx, error)
			        {
			         	alert('Ops.. ' + error.message);
			        });
			});
	});
}

function verificarTipoListagem () {
	var tipoListagem = localStorage.getItem('ordemListagem');
	$('#slcListarPor').val(tipoListagem);
}