<?php
namespace admin;
class FilesController extends BaseController{

	public function __construct(){
        $this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function read_dir(){
		$input = \Input::all();
		$directory = public_path($input['pasta']);
		$files = \File::files($directory);
		$arquivos = [];

        if(count($files) > 0){
    		foreach ($files as $key => $value) {
    			$ext = explode('.',$value);

    			$item = array("text" => basename($value,".".$ext[1]),"value" => basename($value));
    			array_push($arquivos,$item);
    		}
        }    
		return \Response::json($arquivos);

	}
	public function uploads(){
		$input = \Input::all();
    	$path = public_path($input['path']);
    	$files = \Input::file('files');
    	$array_data = array();
    	$qnt_files = $input['qnt_files'];

    	for($i=0; $i < $qnt_files; $i++) { 
    		$file = \Input::file('file-'.$i);
    		$name = \AppString::removeAcentos($file->getClientOriginalName());
    		$extension = $file->getClientOriginalExtension();
    		$size = $file->getSize();

      		if($extension != "png" && $extension != "jpg"){
    			$data = array("index" => $i,"file" => $file->getClientOriginalName(),"data"=>"- A imagem deve ser PNG ou JPG.","status"=>0);
    			array_push($array_data,$data);
    		}else if(\File::exists($path."/".$name)){
    			$data = array("index" => $i,"file" => $file->getClientOriginalName(),"data"=>"- Imagem já existe.","status"=>0);
    			array_push($array_data,$data);
    		}else if($file->move($path,$name)){
    			$data = array("index" => $i,"file" => $file->getClientOriginalName(),"data"=>"Upload com sucesso.","status"=>1);
    			array_push($array_data,$data);
    		}else{
    			$data = array("index" => $i,"file" => $file->getClientOriginalName(),"data"=>"Erro ao fazer upload.","status"=>0);
    			array_push($array_data,$data);
    		}
    	}

    	return \Response::json($array_data);
	}
    public function delete(){
        $input = \Input::all();
        $path = public_path($input['path']);
        
        if(\File::exists($path) == false){
            $data = array("data" => "- Arquivo não existe.","status" => 0);
        }else if(\File::delete($path)){
            $data = array("data" => "- Arquivo deletado com sucesso.","status" => 1);
        }else{
            $data = array("data" => "- Erro ao deletar arquivo.","status" => 0);
        }
        return \Response::json($data);
    }
}
?>