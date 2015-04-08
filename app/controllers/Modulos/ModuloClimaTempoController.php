<?php
namespace Modulos;
class ModuloClimaTempoController extends BaseController {

    public $tempo_label;

	public function __construct(){
		$this->tempo_label = $this->tempoLabel();
	}
    public function getTempo(){
    	try{
	    	$input = \Input::all();
	    	$latitude = $input['latitude'];
	    	$longitude = $input['longitude'];
	    	$url = "http://servicos.cptec.inpe.br/XML/cidade/7dias/$latitude/$longitude/previsaoLatLon.xml";
	    	$xml = simplexml_load_string(file_get_contents($url));
	    	$itens = array();

	    	foreach ($xml[0]->previsao as $key => $value) {
		   		$tempo = (string)$value->tempo;
		   		$item = array("dia" => $value->dia,"tempo"=>$this->tempo_label[$tempo],"maxima" => $value->maxima,"minima" => $value->minima);
		   	    array_push($itens,$item);
	    	}
	    	$data = array('data' => $itens,'status' => 1);
	    	return \Response::json($data);
	    }catch(Exception $e){
	    	$data = array('data' => $e->getMessage(),'status' => 0);
	    	return \Response::json($data);	
	    }	
    }
	public function tempoLabel(){
		$tempo_labels = array("ec"  => "Encoberto com Chuvas Isoladas",
          "ci"  => "Chuvas Isoladas",
          "c"  => "Chuva",
          "in"  => "Instável",
          "pp"  => "Poss. de Pancadas de Chuva",
          "cm"  => "Chuva pela Manha",
          "cn"  => "Chuva a Noite",
          "pt"  => "Pancadas de Chuva a Tarde",
          "pm"  => "Pancadas de Chuva pela Manhã",
          "np"  => "Nublado e Pancadas de Chuva",
          "pc"  => "Pancadas de Chuva",
          "pn"  => "Parcialmente Nublado",
          "cv"  => "Chuvisco",
          "ch"  => "Chuvoso",
          "t"  => "Tempestade",
          "ps"  => "Predomínio de Sol",
          "e"  => "Encoberto",
          "n"  => "Nublado",
          "cl"  => "Céu Claro",
          "nv"  => "Nevoeiro",
          "g"  => "Geada",
          "ne"  => "Neve",
          "nd"  => "Não Definido",
          "pnt" => "Pancadas de Chuva a Noite",
          "psc" => "Possibilidade de Chuva",
          "pcm" => "Possibilidade de Chuva pela Manhã",
          "pct" => "Possibilidade de Chuva a Tarde",
          "pcn" => "Possibilidade de Chuva a Noite",
          "npt" => "Nublado com Pancadas a Tarde",
          "npn" => "Nublado com Pancadas a Noite",
          "ncn" => "Nublado com Possibilidade de Chuva a Noite",
          "nct" => "Nublado com Possibilidade de Chuva a Tarde",
          "ncm" => "Nublado com Possibilidade de Chuva pela Manhã",
          "npm" => "Nublado com Pancadas pela Manhã",
          "npp" => "Nublado com Possibilidade de Chuva",
          "vn"  => "Variação de Nebulosidade",
          "ct"  => "Chuva a Tarde",
          "ppn" => "Possibilidade de Pancadas de Chuva a Noite",
          "ppt" => "Possibilidade de Pancadas de Chuva a Tarde",
          "ppm" => "Possibilidade de Pancadas de Chuva pela Manhã");
		return $tempo_labels;
	}

}
?>