<?php
namespace admin;

class BaseController extends \Controller {
	
	protected function setupLayout()
	{
		if (!is_null($this->layout))
		{
			$this->layout = \View::make($this->layout);
		}
	}
	public function filters($filtros){

    	$where = "";
    	$logic = $filtros['logic'];
    	$operador = "";
 		$value = "";
  		

 		foreach($filtros['filters'] as $key => $v){
 			if($v["field"] == "created_at"){
 				$data = $v["value"];
 				$search = array("GMT-0300", "(Hora oficial do Brasil)");
				$replace   = array("", "");
				$data = str_replace($search,$replace,$data);
				$timestamp = strtotime($data);
  				$v["value"] = "'".date('Y-m-d h:i:s', $timestamp)."'";
  			}
 			switch ($v["operator"]) {
 				case "startswith":
 				   $value = "LIKE '".$v["value"]."%'";
 				break;
 				case 'endswith': 
 					$value = "LIKE '%".$v["value"]."'";
 				case 'eq':
 				   if(!preg_match('/([0-9])/i',$v["value"])){
 				   	$value = "= '".$v["value"]."'";
 				   }else{
 				   	$value = "= ".$v["value"]."";
 				   }	 				    
 				break;
 				case 'neq':
 				   if(!preg_match('/([0-9])/i',$v["value"])){
 				   	 $value = "<> '%".$v["value"]."'";
 					}else{
 				   	  $value = "<> %".$v["value"]; 
					} 
 				break;	
 				case 'contains':
 					$value = "LIKE '%".$v["value"]."%' ";
 				break;
 				case 'doesnotcontain':
 					$value = "NOT LIKE '%".$v["value"]."%' ";
 				break;
 				case "gte":
 					$value = ">= ".$v["value"]." "; 
 				break;
 				case "gt":
 					$value = "> ".$v["value"]." ";
 				break;
 				case "lte":
 					$value = "<= ".$v["value"]." ";
 				break;
 				case "lt":
 					$value = "< ".$v["value"]." ";
 				break;
 				default:
 				   $value = "= '%".$v["value"]."'";
 				break;
 			}
 			if($key == 0){
 				$where .= $v["field"]." ".$value." ";
 			}else{
 				$where .= $logic." ".$v["field"]." ".$value." ";
 			}
 		}
 		return $where;
    }
    public function destroySingle($id,$nome,$model){

		if($model->find($id)->delete()){
			$data = array("data"=> $nome." deletado(a) com sucesso.","status" => 1);
			return \Response::json($data);	
		}else{
			$message = $model::$message_error;
			$data = array("data"=> "Error ao deletar ".$nome." : ".$message,"status" => 0);
			return \Response::json($data);
		}
	}
	public function destroyMultiples($ids,$nome,$model){

		$messages = array();
       
		foreach ($ids as $key => $value) {
			
			if($model->find($value)->delete()){
			    $item = $nome." ".$value." deletado(a) com sucesso.";
				array_push($messages,$item);
			}else{
				$message = $model::$message_error;
				$item = "Error ao deletar ".$nome." ".$value.": ".$message.".";
				array_push($messages,$item);
			}
		}
		$data = array("data" => $messages);
		return \Response::json($data);	
	}
	public function readFilesDir($path){
		$dir = public_path($path);
		$files_array = array();
		$files = \File::files($dir);

		foreach ($files as $key => $value) {
			$item = array('file' => basename($value));
			array_push($files_array,$item);
		}
		return $files_array;
	}

}
