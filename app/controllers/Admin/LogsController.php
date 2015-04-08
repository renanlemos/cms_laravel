<?php

namespace admin;

class LogsController extends BaseController {

    protected $log;

    public function __construct(Log $log){
        $this->log = $log;
    }
    public function grid(){
        $input = \Input::all();
        $where = "";
        $sort_campo = "id";
        $sort_dir = "desc";
        $data = array();

        if(isset($input['sort'])){
            $sort_campo = $input['sort'][0]['field'];
            $sort_dir = $input['sort'][0]['dir'];
        }
        if(isset($input["filter"]) and !empty($input["filter"])){
            $where = $this->filters($input["filter"]);
            $dados = \DB::table('logs')->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->log->whereRaw($where)->get());
        }else{
            $dados = Log::orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = $this->log->selectRaw('count(id) as count')->get();
            $total = $total[0]->count;

        }
        $data = array("data" => $dados,"total" => $total,'tabelas'=>$this->comboTabelas(),"usuarios"=>$this->comboUsuarios());
        return \Response::json($data);

    }
    public function comboTabelas(){
        $data = $this->log->select('tabela as value','tabela as text')->distinct()->get();
        return $data;
    }
    public function comboUsuarios(){
        $data = $this->log->select('nome_usuario as value','nome_usuario as text')->distinct()->get();
        return $data;
    }

}
