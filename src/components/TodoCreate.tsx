import React, { useState } from "react";
import TodoService from "../services/todoService";
import "./TodoList.css";
import {InputGroup, FormControl, Button} from "react-bootstrap";

//função do componente para a criação de novas tarefas
const CreateTodo = (props: {refreshList: VoidFunction}) => {

  //useState é usado para fazer a criação de uma nova tarefa
  const [description, setDescription] = useState('');

  return (
    <>
      {/*form usado para mandar a nova tarefa para o request*/}
      <form onSubmit={(event) => {
        //função de create é chamada, passando para o service
        TodoService.create(description)
        //recarregando a lista, com o novo item
        .then(() => props.refreshList())
        //redefinindo a inputBar para vazia novamente
        .then(() => setDescription(''))
        //prevenção de refresh
        event.preventDefault();
        }
      }>
        <InputGroup className="inputText mt-5 mb-3">
          {/*inputBar*/}
          <FormControl
            onChange={
              //colocando o que foi digitado para o a const do useState
              (event) => {setDescription(event.target.value)}
            }
            placeholder="New Todo"
            aria-label="New Todo Input"
            aria-describedby="NewTodo"
            value={description}
          />
          {/*botão de submit*/}
          <Button variant="outline-light" type="submit">
            <i className="fa fa-plus-circle fa-lg"></i>
          </Button>
        </InputGroup>
      </form>
    </>
  )
}

export default CreateTodo;
