import logger from "./server/utils/logger";

// Helper functions
const normalizePort = (val) => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
  const onError = (port) => {
    return (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
    
      let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
  }
  
  const onListening = (server) => {
    return () => {
        var addr = server.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
        logger.info('Listening on ' + bind);
    }  
  }

  module.exports = {
    normalizePort, 
    onError,
    onListening
  }