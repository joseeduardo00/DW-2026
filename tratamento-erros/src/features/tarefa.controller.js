// @file: src/features/tarefas/tarefa.controller.js
export class TarefaController {
  constructor(service) {
    this.service = service
  }

  async listar(request, reply) {
    const { busca, status } = request.query
    const tarefas = await this.service.listarTarefas({ busca, status })
    return reply.send(tarefas)
  }

  async buscar(request, reply) {
    const { id } = request.params
    const tarefa = await this.service.buscarPorId(id) // Se der erro, o código para aqui mesmo
    return reply.send(tarefa)
  }

  async criar(request, reply) {
    const tarefa = await this.service.criarTarefa(request.body)
    return reply.status(201).send(tarefa)
  }

  async atualizar(request, reply) {
    const { id } = request.params
    const tarefa = await this.service.atualizarTarefa(id, request.body)
    return reply.send(tarefa)
  }

  async concluir(request, reply) {
    const { id } = request.params
    const tarefa = await this.service.concluirTarefa(id)
    return reply.send(tarefa)
  }

  async remover(request, reply) {
    const { id } = request.params
    await this.service.removerTarefa(id)
    return reply.status(204).send() // Se chegou aqui, deu certo! Devolve status 204 (Sem conteúdo)
  }
}