class Usuario {
    constructor(id, nombre, sala) {
        this.id = id;
        this.nombre = nombre;
        this.sala = sala
    }
};

class Usuarios { // Clase para manejar todos los usuarios conectados

    constructor() {
        this.personas = [];
    }

    // Metodos de la clase;

    addUser(id, nombre, sala) {
        let newUser = new Usuario(id, nombre, sala);
        this.personas.push(newUser);

        return [newUser, this.personas];
    };

    findUser(id) {
        let user = this.personas.find((p) => p.id === id);
        return user;
    };

    findUserByName(nombre){
        let user = this.personas.find((p) => p.nombre === nombre);
        return user;
    }

    getAllUsers() {
        return this.personas;
    };

    getUsersByRoom(room) {
        return this.personas.filter((p) => p.sala === room);
    };

    removeUser(id) {
        let removedUser = this.findUser(id);
        this.personas = this.personas.filter((p) => p.id !== id);
        
        return removedUser;
    }
};

module.exports = { Usuarios };