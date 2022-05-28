const path = require('path');
const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'build'),
  prefex: '/',
});

function serveIndex(_request, reply) {
  reply.sendFile('index.html');
}

fastify.get('/', serveIndex);

fastify.get('/health', () => 'all good');

fastify.setNotFoundHandler(serveIndex);

async function start() {
  try {
    await fastify.listen(8080);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();
