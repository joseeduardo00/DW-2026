import Fastify from 'fastify'

const server = Fastify()

const PORT = 3000

// "Banco de dados"
const tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true }
]

// GET - listar todas
server.get('/tarefas', async (request, reply) => {
  const concluido = request.query.concluido

  if (concluido !== undefined) {
    const filtradas = tarefas.filter(t => String(t.concluido) === concluido)
    return reply.send(filtradas)
  }

  return reply.send(tarefas)
})

// GET por ID
server.get('/tarefas/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const tarefa = tarefas.find(t => t.id === id)

  if (!tarefa) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  return reply.send(tarefa)
})

// POST - criar
server.post('/tarefas', async (request, reply) => {
  const tarefa = request.body

  const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1

  const novaTarefa = { id: novoId, ...tarefa }

  tarefas.push(novaTarefa)

  return reply.status(201).send(novaTarefa)
})

// PATCH - atualizar
server.patch('/tarefas/:id', async (request, reply) => {
  const id = Number(request.params.id)

  const index = tarefas.findIndex(t => t.id === id)

  if (index === -1) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  const dados = request.body

  tarefas[index] = { ...tarefas[index], ...dados, id }

  return reply.send(tarefas[index])
})

// DELETE
server.delete('/tarefas/:id', async (request, reply) => {
  const id = Number(request.params.id)

  const index = tarefas.findIndex(t => t.id === id)

  if (index === -1) {
    return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
  }

  tarefas.splice(index, 1)

  return reply.status(204).send()
})

// 404 personalizado
server.setNotFoundHandler((request, reply) => {
  return reply.status(404).send({
    status: 'error',
    message: 'Rota não encontrada'
  })
})

// iniciar servidor
const start = async () => {
  try {
    await server.listen({ port: PORT })
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()