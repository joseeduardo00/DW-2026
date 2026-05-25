// @file: src/features/tarefas/tarefa.service.js
import { AppError } from '../errors/AppError.js' // ◄ Importando o nosso erro novo

export class TarefaService {
  constructor(repository) {
    this.repository = repository
  }

  // Se não achar a tarefa, a API grita um erro 404 (Não Encontrado)
  async buscarPorId(id) {
    const tarefa = await this.repository.buscarPorId(id)
    if (!tarefa) {
      throw new AppError('Tarefa não encontrada', 404)
    }
    return tarefa
  }

  // Se tentar criar sem título ou com título repetido, grita erro 400
  async criarTarefa(dados) {
    if (!dados.titulo || dados.titulo.trim() === '') {
      throw new AppError('O título é obrigatório', 400)
    }

    const tarefas = await this.repository.listarTodos()
    const tituloJaExiste = tarefas.some(t => t.titulo.toLowerCase() === dados.titulo.toLowerCase().trim())

    if (tituloJaExiste) {
      throw new AppError('Já existe uma tarefa com esse título', 400)
    }

    return this.repository.salvar({ ...dados, status: 'pendente' })
  }

  // Não deixa atualizar se a tarefa já estiver concluída
  async atualizarTarefa(id, dados) {
    const tarefa = await this.buscarPorId(id)

    if (tarefa.status === 'concluida') {
      throw new AppError('Não é possível atualizar uma tarefa já concluída', 400)
    }

    return this.repository.atualizar(id, dados)
  }

  async concluirTarefa(id) {
    const tarefa = await this.buscarPorId(id)
    const novoStatus = tarefa.status === 'concluida' ? 'pendente' : 'concluida'
    return this.repository.atualizar(id, { status: novoStatus })
  }

  // Não deixa remover se a tarefa já estiver concluída
  async removerTarefa(id) {
    const tarefa = await this.buscarPorId(id)

    if (tarefa.status === 'concluida') {
      throw new AppError('Não é possível remover uma tarefa já concluída', 400)
    }

    return this.repository.remover(id)
  }
}