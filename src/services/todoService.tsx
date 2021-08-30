import axios from "axios";
import { TodoItem } from '../types/TodoItem';

//serviços utilizados dentro do fronto, fazendo os request da API
//as funções são tipadas conforme o seu retorno e parametros, algumas usando o tipo TodoItem

//request para a criação
const create = async (description: string): Promise<TodoItem> => {
  return axios.post('http://localhost:3030/todo', {
    description, 
  })
  .then(res => res.data)
}

//request para a listagem e pesquisa 
//a tipagem dos parametros usa o Pipe | pois nem sempre o usuário está fazendo uma pesquisa
const list = async (options?: {search: string | undefined, searchStatus: boolean | undefined}): Promise<TodoItem[]> => {
  return axios.get('http://localhost:3030/todos', { params: {
    search: options?.search || '',
    searchStatus: options?.searchStatus || false,
  }})
  .then(res => res.data)
}

//request para a remoção de uma tarefa 
const remove = async (id: string): Promise<unknown> => {
  return axios.delete('http://localhost:3030/'+id)
  .then(res => res.data)
}

//request para a atualização de uma tarefa 
const change = async (id: string, data: TodoItem): Promise<TodoItem> => {   
  return axios.put('http://localhost:3030/todo', data)
  .then(res => res.data)
}

//exportando como um objeto
const TodoService = {
  create,
  list,
  remove,
  change
}

export default TodoService;