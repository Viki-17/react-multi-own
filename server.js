import express from "express";
import fs from "fs";
import Router from "express-promise-router";
import { createServer } from "vite";
import viteConfig from "./vite.config.js";
import { Server } from "socket.io";

const router = Router();

const vite = await createServer({
  configFile: false,
  server: {
    middlewareMode: true,
  },
  ...viteConfig,
});

router.get("/", async (req, res, next) => {
  let html = fs.readFileSync("index.html", "utf-8");
  html = await vite.transformIndexHtml(req.url, html);
  res.send(html);
});

router.use(vite.middlewares);

router.use("*", (req, res) => {
  res.status(404).send({ message: "Not founs" });
});

//express
const app = express();
app.use(router);
const server = app.listen(process.env.PORT || 4444, () => {
  console.log("Listening on port 4444");
});

const ioServer = new Server(server);

let clients = {};

ioServer.on("connection", (client) => {
  console.log(
    `User ${client.id} connected, there are currently ${ioServer.engine.clientsCount} users connected`
  );

  clients[client.id] = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  };

  ioServer.sockets.emit("move", clients);

  client.on("move", ({ id, rotation, position }) => {
    clients[id].position = position;
    clients[id].rotation = rotation;

    ioServer.sockets.emit("move", clients);
  });

  client.on("disconnect", () => {
    console.log(
      `User ${client.id} disconnected, there are currently ${ioServer.engine.clientsCount} users connected`
    );

    //Delete this client from the object
    delete clients[client.id];

    ioServer.sockets.emit("move", clients);
  });
});
