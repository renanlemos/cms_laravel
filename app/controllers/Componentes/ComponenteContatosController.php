<?php
namespace Componentes;
class ComponenteContatosController extends BaseController {

	protected $contato;
	protected $site_config;

	public function __construct(\Admin\Contato $contato,\Admin\SiteConfig $site_config){
		$this->contato = $contato;
		$this->site_config = $site_config;
	}
    public function getContato(){
    	$input = \Input::all();
		$data = $this->contato->where('id',$input['contato'])->get();
		return \Response::json($data);
	}
	public function sendEmail(){
		$input = \Input::all();

		$validation = \Validator::make($input,$this->contato->rulesSendEmail(),$this->contato->messagesSendEmail());
		if($validation->passes()){
			$data = $this->contato->find($input['contato_id']);
			if($data->config_global){
				$data = $this->site_config->find(1);
			}
			$response = $this->mail($data,$input);

		}else{
			$response =  array('data' => $validation->messages(),'status' => 0);
		}	
		return \Response::json($response);
	}
	public function mail($data,$input){
		$contato = array('email_remetente' => $data->email_remetente,
						 'nome_remetente' => $data->nome_remetente,
						 'nome' => $input['nome'],
						 'assunto' => $input['assunto'],
						 'email' => $input['email'],
						 'telefone' => $input['telefone'],
						 'mensagem' => $input['mensagem']);

		$mail = new \PHPMailer;
		                                  
		$mail->Host = strlen($data['servidor_email']) > 0 ? $data['servidor_email'] : \Config::get('mail.host'); ; 
		$mail->Port = strlen($data['porta_email']) > 0 ? $data['porta_email'] : \Config::get('mail.porta');    

		if($data->autenticacao_email){
			$mail->isSMTP();    
			$mail->SMTPAuth = true;                               
			$mail->Username = $data['usuario_email'];                 
			$mail->Password = $data['senha_email'];                           
			$mail->SMTPSecure = 'tls';                            
		}
		$mail->From = $data->email_remetente;
		$mail->FromName = $data->nome_remetente;
		$mail->addAddress($data->email_remetente,$data->nome_remetente);     
  		$mail->isHTML(true);                                 

		$mail->Subject = $input['assunto'];
		$mail->Body    = \View::make('emails.componentes.contato.email',$contato);

		if(!$mail->send()) {
		    return array('data' => $mail->ErrorInfo,'status' => 3);
		} else {
		    return array('data' => 'Email enviado com sucesso','status' => 1);
		}
	}
	
}
?>