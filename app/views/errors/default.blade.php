@extends('layouts.errors')

@section('main')
<div class="container-error">
	<div class="body">
		<p class="legenda">
			<span class="icon icon-notification"></span>
			Houve um erro em nosso servidor.
		</p>	
		<div class="code-error">
			<strong>{{ $code }}</strong>
		</div>	
	</div>	
</div>
@stop