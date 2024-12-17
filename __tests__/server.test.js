const { startServer } = require('../index');
const request = require('supertest');
const http = require('http');
 // Instancia de servidor usada en las pruebas

describe('Pruebas de inicio del servidor', () => {
  const originalPort = 8000;
  const nextPort = originalPort + 1;
  let server;
  let dummyServer

  afterEach((done) => {
    if (server) {
      server.close(() => done());
    } else {
      done();
    }
  });
  afterAll((done) => {
    if (dummyServer) dummyServer.close(() => done());
    else done();
  });

  it("Debe iniciar el servidor en el puerto especificado si está disponible", (done) => {
    server = startServer(originalPort, (err, port, srv) => {
      server = srv; // Guardar instancia para cerrar
      expect(err).toBeNull();
      expect(port).toBe(originalPort);

      request(server)
        .get("/")
        .expect(200) // Cambia según la respuesta esperada en `/`
        .end(done);
    });
  });

  it("Debe cambiar a un puerto alternativo si el puerto está ocupado", (done) => {
    dummyServer = http.createServer();

    dummyServer.listen(originalPort, () => {
      server = startServer(originalPort, (err, port, srv) => {
        server = srv; // Guardar instancia para cerrar
        expect(err).toBeNull();
        expect(port).toBe(nextPort);

        request(server)
          .get("/")
          .expect(200) // Cambia según la respuesta esperada en `/`
          .end(done);
      });
    });
  }, 20000);// Incrementa el tiempo de espera si es necesario
});
