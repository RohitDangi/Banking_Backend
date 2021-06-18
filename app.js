import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import http from "http"; 
import { knex } from "./db/db";
import logger from "./server/utils/logger";
import { normalizePort, onError, onListening } from "./appHelperFunctions";
import config from "config";
import { AUTH_ROUTES, LEDGER_ROUTES, USER_ROUTES } from "./server/routes";
import cors from "cors";
import fs from "fs";

const port = normalizePort(process.env.PORT || config.get("port") || '8080');

const app = express();

// Allow cors
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', AUTH_ROUTES)
app.use('/user', USER_ROUTES)
app.use('/ledger', LEDGER_ROUTES)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

(async () => {
  try {
    // Sync database model
    if(!(process.env.NODE_ENV === "production")) {
      
      logger.info("DB upgrade start.");
      await knex.migrate.latest();
      await knex.seed.run();
      logger.info("DB upgrade finished sucessfully.");
    }

    // Listen on provided port, on all network interfaces.
    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError(port));
    server.on('listening', onListening(server));

  } catch(err) {
      logger.error("DB upgrade finished with error.", err);
  }
})();

