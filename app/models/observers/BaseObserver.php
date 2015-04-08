<?php
/**
 * Class BaseObserver
 */
class BaseObserver {

    protected $id;

    public function __construct(){
    
    }

    public function saving(Eloquent $model){}

    public function saved(Eloquent $model){}

    public function updating(Eloquent $model){}

    public function updated(Eloquent $model){}

    public function creating(Eloquent $model){}

    public function created(Eloquent $model){}

    public function deleting(Eloquent $model){}

    public function deleted(Eloquent $model){}

    public function restoring(Eloquent $model){}

    public function restored(Eloquent $model){}

    protected function setConditionalRules(Eloquent $model){}
    
    public function setData($model){

        switch($model->getTable()) {
            case 'modulos':
               $cliente = Admin\ModuloPosicao::find($model->modulo_posicao_id);
               $descricao = array("posicao_descricao" => $cliente['descricao']);
               $data = array_merge($model->getAttributes(),$descricao);
               return json_encode($data); 
            break;
            case 'banner_slider_fotos':
               $banner = Admin\BannerSlider::find($model->banner_slider_id);
               $descricao = array("banner_slider_descricao" => $banner['descricao']);
               $data = array_merge($model->getAttributes(),$descricao);
               return json_encode($data); 
            break;
            case 'artigos':
              $categoria = Admin\ArtigoCategoria::find($model->artigo_categoria_id);
              $descricao = array("artigo_categoria_descricao" => $categoria['descricao']);
              $data = array_merge($model->getAttributes(),$descricao);
              return json_encode($data); 
            break;
            case 'produtos':
              $categoria = Admin\ProdutoCategoria::find($model->produto_categoria_id);
              $titulo = array("categoria_titulo" => $categoria['titulo']);
              $data = array_merge($model->getAttributes(),$titulo);
              return json_encode($data); 
            break;
            case 'produto_fotos':
              $produto = Admin\Produto::find($model->produto_id);
              $titulo = array("produto_titulo" => $produto['titulo']);
              $data = array_merge($model->getAttributes(),$titulo);
              return json_encode($data); 
            break;
            case 'produto_produto_caracteristicas':
              $produto = Admin\Produto::find($model->produto_id);
              $caracteristica = Admin\ProdutoCaracteristica::find($model->produto_caracteristica_id);
              $tipo = Admin\ProdutoCaracteristicaTipo::find($model->produto_caracteristica_tipo_id);
              
              $produto_titulo = array("produto_titulo" => $produto['titulo']);
              $caracteristica_descricao = array("caracteristica_descricao" => $caracteristica['descricao']);
              $tipo_descricao = array("tipo_descricao" => $tipo['descricao']);

              $data = array_merge($model->getAttributes(),$produto_titulo,$caracteristica_descricao,$tipo_descricao);
              
              return json_encode($data); 
            break;
            case 'artigo_fotos':
              $data = Admin\Artigo::find($model->artigo_id);
              $titulo = array("artigo_titulo" => $data['titulo']);
              $data = array_merge($model->getAttributes(),$titulo);
              return json_encode($data); 
            break;
            case 'evento_hospedagems':
              $categoria = Admin\EventoHospedagemCategoria::find($model->evento_hospedagem_categoria_id);
              $cidade = Admin\EventoHospedagemCidade::find($model->evento_hospedagem_cidade_id);
              
              $categoria = array("categoria_descricao" => $categoria['descricao']);
              $cidade = array("cidade_descricao" => $cidade['descricao']);
              $data = array_merge($model->getAttributes(),$categoria,$cidade);
              return json_encode($data); 
            break;
            case 'evento_hospedagem_evento_hospedagem_inclusos':
              $hospedagem = Admin\EventoHospedagem::find($model->evento_hospedagem_id);
              $incluso = Admin\EventoHospedagemIncluso::find($model->evento_hospedagem_incluso_id);
              
              $hospedagem = array("hospedagem_nome" => $hospedagem['nome']);
              $incluso = array("incluso_descricao" => $incluso['descricao']);
              $data = array_merge($model->getAttributes(),$hospedagem,$incluso);
              return json_encode($data); 
            break;
            case 'evento_evento_servicos':
              $evento = Admin\Evento::find($model->evento_id);
              $servico = Admin\EventoServico::find($model->evento_servico_id);
              
              $evento = array("evento_nome" => $evento['titulo']);
              $servico = array("servico_descricao" => $servico['descricao']);
              $data = array_merge($model->getAttributes(),$evento,$servico);
              return json_encode($data); 
            break;
            case 'eventos':
              $categoria = Admin\EventoCategoria::find($model->evento_categoria_id);
              $contato = Admin\EventoContato::find($model->evento_contato_id);
              
              $categoria = array("categoria_titulo" => $categoria['titulo']);
              $contato = array("contato_nome" => $contato['nome']);
              $data = array_merge($model->getAttributes(),$categoria,$contato);
              return json_encode($data); 
            break;
            case 'evento_hospedagem_valors':
              $hospedagem = Admin\EventoEventoHospedagem::select('nome')->rightJoin('evento_hospedagems as ev','ev.id','=','evento_evento_hospedagems.evento_hospedagem_id')->where('evento_evento_hospedagems.id',$model->evento_evento_hospedagem_id)->get();

              $hospedagem = array("hospedagem_nome" => $hospedagem[0]->nome);
              $data = array_merge($model->getAttributes(),$hospedagem);
              return json_encode($data); 
            break;
            case 'evento_evento_hospedagems':
              $hospedagem = Admin\EventoHospedagem::find($model->evento_hospedagem_id);
              $categoria = Admin\EventoHospedagemCategoria::find($model->evento_hospedagem_categoria_id);
              
              $hospedagem = array("hospedagem_nome" => $hospedagem['nome']);
              $categoria = array("hospedagem_categoria" => $categoria['descricao']);
              $data = array_merge($model->getAttributes(),$hospedagem,$categoria);
              return json_encode($data); 
            break;
            case 'evento_textos':
              $evento = Admin\Evento::find($model->evento_id);
              
              $evento = array('evento_titulo' => $evento['titulo']);

              $data = array_merge($model->getAttributes(),$evento);
              return json_encode($data); 
            break;
            default:
               return json_encode($model);
            break;
        }
    }
}

?>