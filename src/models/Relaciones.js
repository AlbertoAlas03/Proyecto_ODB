const { Jugador } = require('./Jugador');
const { Equipo } = require('./Equipo');
const { Categoria } = require('./Categoria');

// relaciones entre las tablas jugadores y equipo
Equipo.hasMany(Jugador, {
    foreignKey: 'id_equipo'
});

Jugador.belongsTo(Equipo, {
    foreignKey: 'id_equipo',
    targetKey: 'id_equipo'
});

//realaciones entre las tablas equipo y categorias
Categoria.hasMany(Equipo, {
    foreignKey: 'id_categoria'
})

Equipo.belongsTo(Categoria, {
    foreignKey: 'id_categoria',
    targetKey: 'id_categoria'
})
