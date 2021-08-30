import React, { useState } from "react";
import {InputGroup, FormControl, Button, ToggleButton, ButtonGroup } from "react-bootstrap";
import TodoService from "../services/todoService";
import { TodoItem } from '../types/TodoItem';

//componente usado na SearchBar do app
//definição da função e tipagem da mesma
const TodoSearchbar = (props: {refreshList: VoidFunction, updateModel: (model: TodoItem[]) => void}) => {

  //useState é usado é usado para dar "toggle" no botão de filtragem "completed"
  const [searchStatus, setSearchStatus] = useState(false);
  //useState é usado para definir o que esta sendo pesquisado pelo usuário
  const [search, setSearch] = useState('');

  return (
    <>
      {/*form para enviar os valores a serem pesquisados*/}
      <form 
        onSubmit={(event) => {
        //previnindo o refresh da pagina
        event.preventDefault()
        //passando a pesquisa para o service
        TodoService.list({
          search,
          searchStatus
        })
        //recarregando a lista com a filtragem de pesquisa
        .then(data => props.updateModel(data))
        }}
      >
        <InputGroup className="inputText mb-3">
          {/*SearchBar usada para a pesquisa*/}
          <FormControl
            //colocando a string digitada para a const do useState
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            aria-label="Search"
            aria-describedby="SearchTodo"
            value={search}
          />
          <ButtonGroup>
            <Button variant="outline-light" type="submit">
              <i className="fa fa-search fa-lg"></i>
            </Button>
            {/*botão para a filtragem de pesquisa*/}
            <ToggleButton 
              onClick={() => {
                //dando toggle no filtro
                setSearchStatus(!searchStatus);
                props.refreshList()
              }}
              //ternário mudando o estilo do botão
              variant={searchStatus ? `light` : `outline-light`}
              type="checkbox"
              value=''
            >
              {/*um ternário é usado para mudar o estilo dos icones, deixando evidente que a filtragem selecionada*/}
              <span>
                <i id="completeButton" className={searchStatus ? `fa fa-check-circle-o fa-lg` : `fa fa-circle-o fa-lg`}></i>
                Only Completed
              </span>
            </ToggleButton>
          </ButtonGroup>
        </InputGroup>
      </form>
    </>
  )
}

export default TodoSearchbar;