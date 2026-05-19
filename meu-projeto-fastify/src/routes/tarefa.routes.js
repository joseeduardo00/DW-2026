export default async function tarefaRoutes(server, options) {
  const { controller } = options // Recebe o controller via options

  server.get('/tarefas', async (request, reply) => {
    console.log("Routes: GET /tarefas chamada")
    await controller.listarTarefas(request, reply)
  })

  // Rota do desafio estrategicamente posicionada antes de '/tarefas/:id'
  server.get('/tarefas/pendentes', async (request, reply) => {
    console.log("Routes: GET /tarefas/pendentes chamada")
    await controller.obterPendentes(request, reply)
  })

  server.post('/tarefas', async (request, reply) => {
    console.log("Routes: POST /tarefas chamada")
    await controller.criarTarefa(request, reply)
  })

  server.get('/tarefas/resumo', async (request, reply) => {
    console.log("Routes: GET /tarefas/resumo chamada")
    await controller.obterResumo(request, reply)
  })

  server.get('/tarefas/:id', async (request, reply) => {
    console.log("Routes: GET /tarefas/:id chamada")
    await controller.obterTarefa(request, reply)
  })

  server.patch('/tarefas/:id', async (request, reply) => {
    console.log("Routes: PATCH /tarefas/:id chamada")
    await controller.atualizarTarefa(request, reply)
  })

  server.patch('/tarefas/:id/concluir', async (request, reply) => {
    console.log("Routes: PATCH /tarefas/:id/concluir chamada")
    await controller.concluirTarefa(request, reply)
  })

  server.delete('/tarefas/:id', async (request, reply) => {
    console.log("Routes: DELETE /tarefas/:id chamada")
    await controller.removerTarefa(request, reply)
  })
}