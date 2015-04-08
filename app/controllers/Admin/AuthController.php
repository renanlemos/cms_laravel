<?php

namespace Admin;
class AuthController extends BaseController {

    
    public function __construct(){
    	$this->beforeFilter('csrf', array('on' => 'post'));
    }
    public function token(){
      return csrf_token();
    }
	public function verify(){
		
		$value = \Session::get('login_admin',false);

		if($value == true){
			$data = array("data" => $this->user(),"status" => $value);
		}else{
			$data = array("data" => "","status" => $value);
		}
		
		return \Response::json($data);	
	}
	public function user(){
		
		$id = \Session::get("id_usuario_admin");
		$user = Usuario::find($id);

		return $user;
	}
	public function login(){
		$input = \Input::all();
		$validation = \Validator::make($input,Auth::rules(),Auth::messages());

		$nome = $input["nome_usuario"];
		$senha = md5($input["senha"]);

		if($validation->passes()){
			$user = Usuario::where("nome_usuario",$nome)->where("senha",$senha)->get();
			if(count($user) == 0){
				return \Response::json(array("data" => ["Error"=>array("- Usuário e senha não conferem.")],"status" => 0));
			}elseif($user[0]->ativo == false){
				return \Response::json(array("data" => ["Error"=>array("- Usuário bloqueado.")],"status" => 0));
			}else{
				\Session::set("login_admin",true);
				\Session::set("id_usuario_admin",$user[0]->id);
				\Session::set("nome_usuario_admin",$user[0]->nome_usuario);
				\Session::set("email_usuario_admin",$user[0]->email);

				return \Response::json(array("data" => $user,"status" => 1));
			}
    	}else{
			return \Response::json(array("data" => $validation->messages(),"status" => 0));
		}
	}
	public function logout(){
		
		\Session::forget('login_admin');
		\Session::forget('id_usuario_admin');
		\Session::forget('nome_usuario_admin');
		\Session::forget('email_usuario_admin');
		
		return \Response::json(array("data"=>"true"));
	}
    
}

?>
