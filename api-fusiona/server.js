"user strict";

const Hapi = require("hapi");
const mongoose = require("mongoose");

const server = new Hapi.Server({
  // host: "localhost",
  port: process.env.PORT,
  routes: {
    cors: true,
  },
});

server.app.db = mongoose
  .connect(
    "mongodb+srv://User:Password@cluster0-oaqyi.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => console.log("DB conectada"))
  .catch((err) => console.log(err));

const init = async () => {
  await server
    .register(
      {
        plugin: require("./routes/User"),
      },
      {
        routes: {
          prefix: "/users",
        },
      }
    )
    .catch((err) => {
      console.log(err);
    });
  await server.start();
  console.log(`Servidor corriendo en:${server.info.uri}`);
};

init();
