//tipagem da lista de tarefa que é utilizada ao longo do código
export type TodoItem = {
  readonly id: string;
  readonly description: string;
  readonly status: boolean;
}
