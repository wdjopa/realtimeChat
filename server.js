let http = require("http");
let server = http
  .createServer(function (req, res) {
    res.write("Le serveur tourne");
    res.end();
  })
  .listen(8080);
let socket = require("socket.io");

let io = socket.listen(server);

let users = {};

io.sockets.on("connection", (socket) => {
  let prenom;
  console.log("Un socket s'est ajouté");

  socket.on("nouveau message", function (prenom, message) {
    users[prenom].messages.push(message);
    io.sockets.emit("message recu", prenom, message, new Date());
  });

  socket.on("enregistrement", function (prenomClient) {
    if (!users[prenomClient]) {
      prenom = prenomClient;
      users[prenomClient] = {
        messages: [],
        date: new Date(),
      };
      io.sockets.emit("utilisateurs", users);
    }
  });

  socket.on("disconnect", () => {
      if(users[prenom]){
          delete users[prenom]
      }
  });
});
