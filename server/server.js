const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Simple logger
server.use((req, res, next) => {
  console.log(`[JSON Server] ${req.method} ${req.url}`);
  next();
});

server.use(router);

const port = 5000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
