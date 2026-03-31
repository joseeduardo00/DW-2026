import Fastify from 'fastify'
import cors from '@fastify/cors'

const server = Fastify()


// Registramos o plugin de CORS para permitir que qualquer origem acesse nossa API
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})
const PORT = 3000

// "Banco de dados" em memória
let tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true }
]

// --- ROTAS GET ---

// Listar todas com filtros (busca e concluido)
server.get('/tarefas', async (request, reply) => {
  let resultado = [...tarefas]
  const { busca, concluido } = request.query

  if (busca) {
    resultado = resultado.filter(t =>
      t.descricao.toLowerCase().includes(busca.toLowerCase())
    )
  }

  if (concluido !== undefined) {
    const statusAlvo = concluido === 'true'
    resultado = resultado.filter(t => t.concluido === statusAlvo)
  }

  return reply.send(resultado)
})

// Resumo estatístico
server.get('/tarefas/resumo', async (request, reply) => {
  const total = tarefas.length
  const concluidas = tarefas.filter(t => t.concluido).length
  const pendentes = total - concluidas

  return reply.send({ total, concluidas, pendentes })
})

// Buscar por ID
server.get('/tarefas/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const tarefa = tarefas.find(t => t.id === id)

  if (!tarefa) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  return reply.send(tarefa)
})

// --- ROTAS POST ---

// Criar nova tarefa com validação
server.post('/tarefas', async (request, reply) => {
  const { descricao, concluido } = request.body

  if (!descricao || descricao.trim() === '') {
    return reply.status(400).send({
      status: 'error',
      message: 'Descrição é obrigatória'
    })
  }

  const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1

  const novaTarefa = {
    id: novoId,
    descricao,
    concluido: concluido ?? false
  }

  tarefas.push(novaTarefa)
  return reply.status(201).send(novaTarefa)
})

// --- ROTAS PATCH / DELETE ---

// Atualização parcial
server.patch('/tarefas/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const index = tarefas.findIndex(t => t.id === id)

  if (index === -1) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  const dados = request.body
  tarefas[index] = { ...tarefas[index], ...dados, id } // Mantém o ID original

  return reply.send(tarefas[index])
})

// Toggle (Inverter status concluído)
server.patch('/tarefas/:id/concluir', async (request, reply) => {
  const id = Number(request.params.id)
  const index = tarefas.findIndex(t => t.id === id)

  if (index === -1) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  tarefas[index].concluido = !tarefas[index].concluido
  return reply.send(tarefas[index])
})

// Excluir
server.delete('/tarefas/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const index = tarefas.findIndex(t => t.id === id)

  if (index === -1) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  tarefas.splice(index, 1)
  return reply.status(204).send()
})

// --- CONFIGURAÇÕES DO SERVIDOR ---

server.setNotFoundHandler((request, reply) => {
  return reply.status(404).send({
    status: 'error',
    message: 'Rota não encontrada'
  })
})

const start = async () => {
  try {
    await server.listen({ port: PORT })
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()