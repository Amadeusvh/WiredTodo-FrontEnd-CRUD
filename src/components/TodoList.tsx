import React, { ReactElement, useEffect, useReducer } from "react";
import TodoService from "../services/todoService";
import { TodoItem } from '../types/TodoItem';
import "./TodoList.css";
import { Container, Row, Col, FormControl, Button, ListGroup, FormCheck, CloseButton } from "react-bootstrap";
import TodoSearchbar from "./TodoSearchbar";
import TodoCreate from "./TodoCreate";

//tipagem da model, sendo uma lista de tarefas
export type TodoModel = {
  readonly dataSet: readonly TodoItem[];
}

//tipagem dos props da função, recebendo o tipo da Model
type TodoListProps = {
  readonly model: TodoModel;
}

//estados iniciais para serem usados no reducer
const initialState = {
  //estado inicial da model, sendo uma lista vazia
  model: [],
  //estado inicial para a atualização das tarefas, sendo um objeto vazio
  editing: {},
  //estado inicial da pesquisa da lista, sendo uma string vazia, para não procurar nenhum nome
  //e um boolean falso, para não procurar por tarefas completas
  lastQuery: ['', false],
}

//o reducer é utilizado para facilitar o uso do componente, não precisando usar
//as classes do REACT, dividindo as ações necessárias no front
//chamando elas quando necessário
const reducer = (state: any, action: any) => {
  switch (action.type) {
    //ação para atualizar a lista
    case 'SET_MODEL':
      return  { ...state, model: action.newModel}
    //ação para atualizar uma tarefa
    case 'UPDATING_EDITING_STATE':
      return { ...state, editing: { ...state.editing, [action.id]: action.currentValue} };
    //ação para finalizar a atualização de uma tarefa
    case 'FINISH_EDITING_TODO':
      return  { ...state, editing: Object.entries(state.editing)
        .filter(([key, _value]) => key !== action.id)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}) }
    //ação para colocar a ultima pesquisa feita
    case 'SET_LAST_QUERY':
        return { ...state, lastQuery: action.lastQuery}
  }
}

//função do componente principal da lista, junto com sua tipagem
const TodoList = (): ReactElement<TodoListProps> => {
  
  //useReducer do REACT, para usar a função reducer acima
  const [state, dispatch] = useReducer(reducer, initialState);

  //função para a atualização da lista, é utilizada na "TodoSearchBar"
  const dispatchUpdateModel = (newModel: TodoItem[]) => {
    dispatch ({type: 'SET_MODEL', newModel})
  }
  
  //função para a atualização de uma tarefa, utilizando a função de dentro do service
  //e utilizando a ação de dentro do reducer
  const updateDescription = (data: TodoItem) => {
    const newDescription = state.editing[data.id];
    TodoService.change(data.id, {...data, description: newDescription})
    .then(() =>updateState())

    dispatch({type: 'FINISH_EDITING_TODO', id: data.id});
  }

  //função para dar "refresh" na lista e trazer a lista para o front
  //utilizando o reducer
  const updateState = () => {
    TodoService.list()
    .then((data) => {
      dispatch({type: 'SET_MODEL',newModel: data })
    })
  }

  //usando useEffect para mostrar a lista na pagina, é passado uma lista vazia
  //para evitar um loop no request
  useEffect(updateState, []);

  return (
      <Container>
        <Row>
          <Col>
            {/*
              chamando o componente de de pesquisa e passando as funções de
              atualização da model e refresh da pagina
            */}
            <TodoSearchbar updateModel={dispatchUpdateModel} refreshList={updateState}/>
            {/*
              chamando o componente de criação de uma tarefa, passando a função
              de refresh
            */}
            <TodoCreate refreshList={updateState}/>
          </Col>
        </Row>

        <Row>
          <ListGroup>
            {/*iterando a lista inteira para mostrar cada tarefa, para isso é utilizado um map*/}
            {state.model.map((data: TodoItem) => 
              <ListGroup.Item key={`todo-${data.id}`} id="list">
                {/*botão para deletar uma tarefa*/}
                <CloseButton
                  className="listButton" 
                  onClick={() => {
                    //service para a remoção da tarefa junto com a função de atualização
                    TodoService.remove(data.id)
                    .then(() =>updateState())
                  }}
                />
                {/*um checkbox é usado para atualizar o status da tarefa*/}
                <FormCheck 
                  onChange={
                      //chamando o service de atualização da tarefa e atualizando a lista
                      (event) => TodoService.change(data.id, {...data, status: event.target.checked})
                      .then(() =>updateState())
                    }
                  type="checkbox" 
                  className="checkButton" 
                  checked={data.status}
                />
                
                {/*
                  é usado um ternário para mudar entre o modo de edição da descrição da tarefa
                  utilizando "state.editing" para fazer esta mudança
                */}
                {Object.keys(state.editing).includes(data.id) ?
                
                <>
                  {/*botão utilizado para terminar a ação de atualização da descrição*/}
                  <Button variant="light" type="submit" className="editButton"
                    onClick={() => {
                      //chamando a função de atualizar a descrição
                      updateDescription(data)
                    }}>
                    <i className="fa fa-pencil fa-lg"></i>
                  </Button>
                  {/*Input de texto para a atualização da descrição*/}
                  <FormControl 
                    onChange={
                      //chamando a ação do reducer para fazer a atualização
                      //levando o valor digitado para o reducer
                      (event) => dispatch({type: 'UPDATING_EDITING_STATE', 
                      id: data.id, currentValue: event.target.value})
                    } 
                    //usando o id da tarefa para saber quando delas devera ser atualizada
                    key={data.id}
                    //o valor digitado sera mandado para ser a nova descrição
                    value={state.editing[data.id]}
                    className="todoEdit"
                  />
                </>
                :
                //como a descrição da tarefa sera mostrada normalmente
                <span 
                  //quando houver um click no texto, o usuário podera mudar 
                  //a descrição, mandando a antiga para ser mudada 
                  onClick={() => dispatch({type: 'UPDATING_EDITING_STATE', 
                    id: data.id, currentValue: data.description})
                  }
                  //mudando o estilo do texto, caso ele já esteja completo, uma linha passará por ele
                  className={ `todo ${data.status ? "true" : "false"}` }
                >
                    {data.description}
                </span>
                }
              </ListGroup.Item>
            )}
          </ListGroup>
        </Row>
      </Container>
  );
}

export default TodoList;
