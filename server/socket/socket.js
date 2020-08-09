const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { createMessage } = require('../utils/utils');

const usuarios =  new Usuarios();

// Conexion de usuario al server (el io.on coneection se ejecuta cada vez que se recarga la pagina)
io.on("connection", (client) => {
  // client contiene toda la info de la computadora que se conecta al server
  console.log("Usuario Conectado");

  client.on('joinChat', (user, callback) => {
    // Cuando un usuario nuevo se une al chat lo agrego a mi clase de usuarios
    // y retorno todos los usuarios coenectados;
    if (!user.nombre || !user.sala) {
      return callback({
        error: true,
        message: 'El nombre/sala es necesario'
      })
    }

    // TODO:  con client.join puedo unir a un usuario a una SALA ESPECIFICA

    client.join(user.sala);

    // el client.id tiene el id unico del socket
    usuarios.addUser(client.id, user.nombre, user.sala);

    // Notificar usuario conectado, solamente a la sala que pertenece
    client.broadcast.to(user.sala).emit('userList', usuarios.getUsersByRoom(user.sala));
    callback(usuarios.getUsersByRoom(user.sala));
  });

  // cuando un usuario envia un mensaje a todos los demas
  client.on('sendMessage', (data) => {
    
    const sender = usuarios.findUser(client.id);
    if (sender === undefined) {
      return `No existe el usuario con el id dado`;
    }

    let message = createMessage(sender.nombre, data.message);
    client.broadcast.to(sender.sala).emit('sendMessage', message);
  });

  // detectar desconexion del cliente/usuario
  client.on("disconnect", () => {
    // Cuando se desconecta un usuario debemos borrarlo del listado de usuarios 
    // Para evitarr "duplicados" en las instancias del socket
    // una vez el usuario salga del chat NOTIFICO al resto que abondono la sala

    console.log(`Usuario Desconectado`);
    const removedUser = usuarios.removeUser(client.id);
    client.broadcast.to(removedUser.sala).emit('sendMessage', createMessage('Administrador', `${removedUser.nombre} abandono el chat`));

    client.broadcast.to(removedUser.sala).emit('userList', usuarios.getUsersByRoom(removedUser.sala));
  });
  
  // escuchar evento mensaje privado (cuando un usuario quiera enviar alguno)
  client.on('privateMessage', (data) => {

    if (!data.to || !data.message) {
      throw new Error ('No se esta enviando el destinatario y/o mensaje');
    };
    const sender = usuarios.findUser(client.id);
    const reciever = usuarios.findUserByName(data.to);

    if (sender === undefined || reciever === undefined) {
      throw new Error ('Los daots del emisor o el destinatario son incorrectos');
    }

    // enviar el mensaje privado
    //client.broadcast.emit('sendMessage', createMessage(sender.nombre, data.message));
    client.broadcast.to(reciever.id).emit('privateMessage', createMessage(sender.nombre, data.message));

  });

});