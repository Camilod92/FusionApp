"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require("mongoose");

process.env.SECRET_KEY = "secret";

exports.plugin = {
  register: (server, options, next) => {
    // Registrar usuario
    server.route({
      method: "POST",
      path: "/register",
      handler: (req, h) => {
        const today = new Date();
        const userData = {
          first_name: req.payload.first_name,
          last_name: req.payload.last_name,
          email: req.payload.email,
          password: req.payload.password,
          created: today,
        };

        return User.findOne({
          email: req.payload.email,
        })
          .then((user) => {
            if (!user) {
              bcrypt.hash(req.payload.password, 10, (err, hash) => {
                userData.password = hash;
                return User.create(userData)
                  .then((user) => {
                    return { status: (user.email = "Registrado!!") };
                  })
                  .catch((err) => {
                    return "error:" + err;
                  });
              });
              return userData;
            } else {
              return { error: "El Usuario ya existe!!" };
            }
          })
          .catch((err) => {
            return "error: " + err;
          });
      },
    });

    // Iniciar Sesion
    server.route({
      method: "POST",
      path: "/login",
      handler: (req, h) => {
        return User.findOne({
          email: req.payload.email,
        })
          .then((user) => {
            if (user) {
              if (bcrypt.compareSync(req.payload.password, user.password)) {
                const payload = {
                  id: user._id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                };

                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                  expiresIn: 1440,
                });

                return { token: token };
              } else {
                return { error: "El Usuario no existe" };
              }
            } else {
              return { error: "El Usuario no existe" };
            }
          })
          .catch((err) => {
            return { error: err };
          });
      },
    });
    // obtener perfil
    server.route({
      method: "GET",
      path: "/profile",
      handler: (req, h) => {
        var decoded = jwt.verify(
          req.headers.authorization,
          process.env.SECRET_KEY
        );

        return User.findOne({
          _id: mongoose.Types.ObjectId(decoded.id),
        })
          .then((user) => {
            if (user) {
              return user;
            } else {
              return "El Usuario no existe";
            }
          })
          .catch((err) => {
            return "error: " + err;
          });
      },
    });

    // Get numero de usuarios
    server.route({
      method: "GET",
      path: "/all",
      handler: async (request, h) => {
        try {
          const tasks = await User.find();
          return h.response(tasks.length);
        } catch (error) {
          return h.response(error).code(500);
        }
      },
    });
  },
  name: "users",
};
