// Configuracion de SOCKET.IO en el frontEnd

// ON : Me permiten escuchar eventos
// EMIT: Para enviar informacion, uno a uno al servidor
// BroadCast: para enviar la informacion desde un cliente a todos los usuarios

var socket = io();
var params = new URLSearchParams(window.location.search);
if (!params.has('name') || !params.has('room')) {
  window.location = 'index.html';
  throw new Error ('El nombre  y la sala son necesarios');
}

const user = {
  nombre: params.get('name'),
  sala: params.get('room')
};

// se definen las funciones de interaccion entre front y back
// Conexion con el servidor
socket.on("connect", function () {
  console.log("Conectado al servidor");

  // cuando el usuario se conecta le envio al backend quien se conecto
  socket.emit('joinChat', user, function(resp) {
    console.log('Usuarios Conectados ', resp);
  });

});

// Desconexion del servidor
socket.on("disconnect", function () {
  console.log("Perdimos conexion con el servidor");

});

// Para enviar mensaje a todos los usuarios, esto deberia activarse con un EventLISTENER cuando se presione un boton "enviar"
// socket.emit("sendMessage", {
//     message: "Hola Mundo",
//     to: 'Juan'
//   },
//   function (resp) {
//     console.log("Respuesta server: ", resp);
//   }
// );

// Escuchar cambios de usuarios conectados, cuando entra o sale del chat
socket.on("sendMessage", function (data) {
  console.log("Servidor", data);
});


socket.on("userList", function(data) {
  console.log(data);
});

// Mensajes privados ... para enviar un mensaje privado es ESENCIAL el ID del socket del cliente destino
socket.on('privateMessage', function (message) {
  console.log('Mensaje privado: ', message);
})