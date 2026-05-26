import Fastify from 'fastify'
import { AppError } from './src/errors/AppError.js'

// Cria o servidor
const server = Fastify({ logger: false }) // Mudamos para false para a tela ficar mais limpa

// REDE DE SEGURANÇA GLOBAL
server.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    })
  }

  console.error('🔥 ERRO INTERNO NÃO ESPERADO:', error)

  return reply.status(500).send({
    status: 'error',
    message: 'Internal Server Error'
  })
})

// Função para ligar o servidor
const start = async () => {
  try {
    await server.listen({ port: 3000 })
    // ◄ ESSA LINHA ABAIXO VAI FAZER O LINK APARECER NA SUA TELA!
    console.log('🚀 Servidor rodando com sucesso em: http://localhost:3000')
  } catch (err) {
    console.error('Erro ao ligar o servidor:', err)
    process.exit(1)
  }
}

start()