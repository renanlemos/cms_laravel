<?php
class LogObserver extends BaseObserver {

  public function created(Eloquent $model){
    $this->create_log('create','','','',$model);
  }
  public function deleted(Eloquent $model){
     $this->create_log('delete','','','',$model);
  }
  public function updated(Eloquent $model){
      $model_original = $model->getOriginal();

      foreach($model->getDirty() as $attribute => $value){
        $original= $model->getOriginal($attribute);
        if($attribute != "updated_at"){
          $this->create_log('update',$attribute,$value,$original,$model);
        }
      }
  }
  public function create_log($acao,$campo,$valor_novo,$valor_antigo,$model){
      if($acao == 'update'){
        $dados = array(
          'tabela'         => $model->getTable(),
          'acao'           => $acao,
          'campo'          => $campo,
          'valor_antigo'   => $valor_antigo,
          'valor_novo'     => $valor_novo,
          'browser_nome'   => Useragent::browser(),
          'browser_versao' => Useragent::version(),
          'nome_usuario'   => Session::get("nome_usuario_admin"),
          'usuario_id'     => Session::get("id_usuario_admin"),
          'observacoes'    => $this->setData($model),
          'created_at'     => $model->created_at,
          'updated_at'     => $model->updated_at
        );
      }else{
         $dados = array(
          'tabela'         => $model->getTable(),
          'acao'           => $acao,
          'campo'          => "",
          'valor_antigo'   => "",
          'valor_novo'     => "",
          'nome_usuario'   => Session::get("nome_usuario_admin"),
          'usuario_id'     => Session::get("id_usuario_admin"),
          'browser_nome'   => Useragent::browser(),
          'browser_versao' => Useragent::version(),
          'observacoes'    => $this->setData($model),
          'created_at'     => $model->created_at,
          'updated_at'     => $model->updated_at
          );

      }
      
      DB::table('logs')->insert($dados);  
    }


}
?>