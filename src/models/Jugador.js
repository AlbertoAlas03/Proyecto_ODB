import { DataTypes } from "sequelize";
import sequelize from "../database/DB_connection.js";

const Jugador = sequelize.define('jugadores', {
    id_jugador: {
        type: DataTypes.CHAR(7),
        primaryKey: true,
        allowNull: false
    },
    nombre1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apellido1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    centro_estudio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono_fijo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono_movil: {
        type: DataTypes.STRING,
        allowNull: true
    },
    religion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_actual: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    madre: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    numero_partida: {
        type: DataTypes.STRING,
        allowNull: true
    },
    numero_folio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    numero_libro: {
        type: DataTypes.STRING,
        allowNull: true
    },
    año_partida: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lugar_nacimiento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nombre_madre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nombre_padre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true
    },
    asiste_iglesia: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    grupo_familiar: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    primera_dosis: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    segunda_dosis: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    tercera_dosis: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    autorizacion_traslado: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    grado_estudio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    turno_estudio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion_centro_estudio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bautizo: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    comunion: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    confirmacion: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    dui_jugador: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_inscripcion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    id_equipo: {
        type: DataTypes.CHAR(5),
        allowNull: false,
        references: {
            model: 'equipo',
            key: 'id_equipo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'jugadores',
    timestamps: false
});


export default Jugador




