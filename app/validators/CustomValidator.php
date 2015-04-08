<?php
//use Illuminate\Validation\Validator as IlluminateValidator;

class CustomValidator extends Illuminate\Validation\Validator{

	public function ValidateCpf($attribute, $value, $parameters){
	
        $cpf = preg_replace('/\D/', '', $value);
        $num = array();
 
        /* Cria um array com os valores */
        for($i=0; $i<(strlen($cpf)); $i++) {
 
            $num[]=$cpf[$i];
        }
 
        if(count($num)!=11) {
            return false;
        }else{
            /*
            Combinações como 00000000000 e 22222222222 embora
            não sejam cpfs reais resultariam em cpfs
            válidos após o calculo dos dígitos verificares e
            por isso precisam ser filtradas nesta parte.
            */
            for($i=0; $i<10; $i++)
            {
                if ($num[0]==$i && $num[1]==$i && $num[2]==$i
                 && $num[3]==$i && $num[4]==$i && $num[5]==$i
                 && $num[6]==$i && $num[7]==$i && $num[8]==$i)
                    {
                        return false;
                        break;
                    }
            }
        }
        /*
        Calcula e compara o
        primeiro dígito verificador.
        */
        $j=10;
        for($i=0; $i<9; $i++)
            {
                $multiplica[$i] = $num[$i]*$j;
                $j--;
            }
        $soma = array_sum($multiplica);
        $resto = $soma%11;
        if($resto<2)
            {
                $dg=0;
            }
        else
            {
                $dg=11-$resto;
            }
        if($dg!=$num[9])
            {
                return false;
            }
        /*
        Calcula e compara o
        segundo dígito verificador.
        */
        $j=11;
        for($i=0; $i<10; $i++)
            {
                $multiplica[$i]=$num[$i]*$j;
                $j--;
            }
        $soma = array_sum($multiplica);
        $resto = $soma%11;
        if($resto<2)
            {
                $dg=0;
            }
        else
            {
                $dg=11-$resto;
            }
        if($dg!=$num[10])
            {
                return false;
            }
        else
            {
                return true;
            }
	}
	public function ValidateCnpj($attribute, $value, $parameters)
    {
 
        /*
        Etapa 1: Cria um array com apenas os digitos numéricos,
        isso permite receber o cnpj em diferentes
        formatos como "00.000.000/0000-00", "00000000000000", "00 000 000 0000 00"
        etc...
        */
        $cnpj = preg_replace('/\D/', '', $value);
        $num = array();
 
        /* Cria um array com os valores */
        for($i=0; $i<(strlen($cnpj)); $i++) {
 
            $num[]=$cnpj[$i];
        }
 
         //Etapa 2: Conta os dígitos, um Cnpj válido possui 14 dígitos numéricos.
         if(count($num)!=14)
         {
             return false;
         }
         /*
         Etapa 3: O número 00000000000 embora não seja um cnpj real resultaria
         um cnpj válido após o calculo dos dígitos verificares
         e por isso precisa ser filtradas nesta etapa.
         */
         if ($num[0]==0 && $num[1]==0 && $num[2]==0
             && $num[3]==0 && $num[4]==0 && $num[5]==0
             && $num[6]==0 && $num[7]==0 && $num[8]==0
             && $num[9]==0 && $num[10]==0 && $num[11]==0)
         {
             return false;
         }
         //Etapa 4: Calcula e compara o primeiro dígito verificador.
         else
         {
                $j=5;
                for($i=0; $i<4; $i++)
                {
                    $multiplica[$i]=$num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $j=9;
                for($i=4; $i<12; $i++)
                {
                    $multiplica[$i]=$num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $resto = $soma%11;
                 if($resto<2)
                 {
                     $dg=0;
                 }
                 else
                 {
                    $dg=11-$resto;
                 }
                 if($dg!=$num[12])
                 {
                    return false;
                 }
        }
         //Etapa 5: Calcula e compara o segundo dígito verificador.
 
         $j=6;
         for($i=0; $i<5; $i++)
         {
             $multiplica[$i]=$num[$i]*$j;
             $j--;
         }
         $soma = array_sum($multiplica);
         $j=9;
         for($i=5; $i<13; $i++)
         {
            $multiplica[$i]=$num[$i]*$j;
            $j--;
         }
         $soma = array_sum($multiplica);
         $resto = $soma%11;
         if($resto<2)
         {
            $dg=0;
         }
         else
         {
            $dg=11-$resto;
         }
         if($dg!=$num[13])
         {
            return false;
         }
         else
         {
            return true;
         }
 
    }
    public function ValidateUniqueProdutoRelacionado($attribute,$value,$parameters){
        $id = $parameters[0];
        $produto_id = $parameters[1];
        $produto_relacionado_id = $parameters[2];
        
        $result = Admin\ProdutoRelacionado::where('id','<>',$id)->where('produto_id',$produto_id)->where('produto_relacionado_id',$produto_relacionado_id)->get();
        
        if(count($result) > 0){
            return false;  
        }else{
            return true;
        }    
              
    }
    public function ValidateUniqueInclusoHospedagem($attribute,$value,$parameters){
        $id = $parameters[0];
        $evento_hospedagem_id = $parameters[1];
        $evento_hospedagem_incluso_id = $parameters[2];
        $result = array();

        if($evento_hospedagem_incluso_id > 0){
            $result = Admin\EventoHospedagemEventoHospedagemIncluso::where('id','<>',$id)->where('evento_hospedagem_id',$evento_hospedagem_id)->where('evento_hospedagem_incluso_id',$evento_hospedagem_incluso_id)->get();
        }
        if(count($result) > 0){
            return false;  
        }else{
            return true;
        }    
              
    }
    public function ValidateUniqueServicoEvento($attribute,$value,$parameters){
        $id = $parameters[0];
        $evento_id = $parameters[1];
        $evento_servico_id = $parameters[2];
        $result = array();

        if($evento_servico_id > 0){
            $result = Admin\EventoEventoServico::where('id','<>',$id)->where('evento_id',$evento_id)->where('evento_servico_id',$evento_servico_id)->get();
        }
        if(count($result) > 0){
            return false;  
        }else{
            return true;
        }    
              
    }
    public function ValidateUniqueHospedagemCategoria($attribute,$value,$parameters){
        $id = $parameters[0];
        $evento_id = $parameters[1];
        $evento_hospedagem_id = $parameters[2];
        $evento_hospedagem_categoria_id = $parameters[3];
        $result = array();

        if($evento_hospedagem_categoria_id > 0){
            $result = Admin\EventoEventoHospedagem::where('id','<>',$id)->where('evento_id',$evento_id)->where('evento_hospedagem_id',$evento_hospedagem_id)->where('evento_hospedagem_categoria_id',$evento_hospedagem_categoria_id)->get();
        }
        if(count($result) > 0){
            return false;  
        }else{
            return true;
        }    
              
    }
    public function ValidateUniqueCampoCategoria($attribute,$value,$parameters){
        $tabela = $parameters[0];
        $campo = $parameters[1];
        $categoria = $parameters[2];
        $id = $parameters[3];
        $categoria_id = $parameters[4];
        $result = array();

        if($categoria_id > 0){
           $result = DB::table($tabela)->where('id','<>',$id)->where($campo,$value)->where($categoria,$categoria_id)->get();
        }

        if(count($result) > 0){
            return false;  
        }else{
            return true;
        }    
              
    }

}


?>