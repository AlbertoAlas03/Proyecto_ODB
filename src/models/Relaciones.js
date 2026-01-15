
import Jugador from "./Jugador.js";
import Equipo from "./Equipo.js";
import Categoria from "./Categoria.js";
import Infracciones_jugador from "./Infracciones_jugador.js";
import Infracciones from "./Infracciones.js";

const StartRelations = () => {
    // relaciones entre las tablas jugadores y equipo
    Equipo.hasMany(Jugador, {
        foreignKey: 'id_equipo',
        as: 'jugadores'
    });

    Jugador.belongsTo(Equipo, {
        foreignKey: 'id_equipo',
        as: 'equipo'
    });

    //realaciones entre las tablas equipo y categorias
    Categoria.hasMany(Equipo, {
        foreignKey: 'id_categoria',
        as: 'equipos'
    })

    Equipo.belongsTo(Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
    })

    //relaciones entre las tablas infracciones_jugador y infracciones
    Infracciones_jugador.belongsTo(Infracciones, {
        foreignKey: 'id_infraccion',
        as: 'infraccion'
    });

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

}

export default StartRelations
