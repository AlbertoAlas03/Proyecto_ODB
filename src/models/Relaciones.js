const { Jugador } = require('./Jugador');
const { Equipo } = require('./Equipo');
const { Categoria } = require('./Categoria');
const { Infracciones_jugador } = require('./Infracciones_jugador');
const { Infracciones } = require('./Infracciones');

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

//relaciones entre las tablas infracciones_jugador y infracciones
    Infracciones_jugador.belongsTo(Infracciones, {
        foreignKey: 'id_infraccion',
        as: 'infraccion'
    })

    Infracciones.hasMany(Infracciones_jugador, {
        foreignKey: 'id_infraccion',
        as: 'jugadores_infractores'
    })

    //relaciones entre las tablas jugadores y infracciones_jugador
    Jugador.hasMany(Infracciones_jugador, {
        foreignKey: 'id_jugador',
        as: 'infracciones_recibidas'
    })

    Infracciones_jugador.belongsTo(Jugador, {
        foreignKey: 'id_jugador',
        as: 'jugador'
    })
