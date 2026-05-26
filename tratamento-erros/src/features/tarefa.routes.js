// @file: src/features/tarefas/tarefa.routes.js
import { TarefaController } from './tarefa.controller.js'
import { TarefaService } from './tarefa.service.js'

// Como não temos um banco de dados real configurado aqui, 
// criamos um "repositório simulado" na memória apenas para o código rodar sem erros.
const repositorySimulado = {
  buscarPorId: async (id) => ({ id, titulo: 'Tarefa Teste', status: 'pendente' }),
  listarTodos: async () => [],
  salvar: async (dados) => dados,
  atualizar: async (id, dados) => dados,
  remover: async (id) => true
}

// Criamos as instâncias do Service e do Controller
const service = new TarefaService(repositorySimulado)
const controller = new TarefaController(service)

export default async function tarefaRoutes(fastify, options) {
  // Criamos as rotas que chamam as funções do seu Controller limpo
  fastify.get('/tarefas', (req, rep) => controller.listar(req, rep))
  fastify.get('/tarefas/:id', (req, rep) => controller.buscar(req, rep))
  fastify.post('/tarefas', (req, rep) => controller.criar(req, rep))
  fastify.put('/tarefas/:id', (req, rep) => controller.atualizar(req, rep))
  fastify.patch('/tarefas/:id/concluir', (req, rep) => controller.concluir(req, rep))
  fastify.delete('/tarefas/:id', (req, rep) => controller.remover(req, rep))
}