<!DOCTYPE html>
<html lang="pt-BR">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h2>Contato:  {{ $nome_remetente }} </h2>
		<strong>Nome: </strong><span>{{ $nome }}</span><br>
		<strong>Email: </strong><span>{{ $email }}</span><br>
		<strong>Telefone: </strong><span>{{ $telefone }}</span><br>
		<strong>Assunto: </strong><span>{{ $assunto }}</span><br><br>
		<strong>Mensagem: </strong><br><br>
		<span>{{ $mensagem }}</span><br>
	</body>
</html>
