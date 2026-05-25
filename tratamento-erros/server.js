// @file: src/server.js
import Fastify from 'fastify'
import tarefaRoutes from './tratamento-erros/src/features/tarefas/tarefa.routes.js'
import { AppError } from './src/errors/AppError.js' // ◄ IMPORTANTE: Não esqueça de importar o AppError aqui!

const server = Fastify({ logger: true })

// =======================================================
// ESSA É A NOSSA REDE DE SEGURANÇA GLOBAL
// =======================================================
server.setErrorHandler((error, request, reply) => {
  // Se o erro for do tipo AppError (nossa regra de negócio violada)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    })
  }

  // Se for um erro misterioso do próprio javascript ou banco de dados
  console.error('🔥 ERRO INTERNO NÃO ESPERADO:', error)

  return reply.status(500).send({
    status: 'error',
    message: 'Internal Server Error'
  })
})
// =======================================================

server.register(tarefaRoutes)

const start = async () => {
  await server.listen({ port: 3000 })
}
start()