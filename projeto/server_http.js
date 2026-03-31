import http from 'http'

const server = http.createServer((req, res) => {
  console.log("requisição para: " + req.url)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  if (req.url === '/') {
    res.end("Página inicial")
  } else if (req.url === '/sobre') {
    res.end("Sobre")
  } else if (req.url === '/contato') {
    res.end("Contato")
  } else {
    res.statusCode = 404
    res.end("Não encontrado")
  }
})

server.listen(3001)

console.log("Servidor rodando em http://localhost:3001")