import Infracciones_jugador from "../models/Infracciones_jugador.js";
import Infracciones from "../models/Infracciones.js";
import Jugador from '../models/Jugador.js'
import Equipo from '../models/Equipo.js'
import Categoria from '../models/Categoria.js'
import Orientador from "../models/Orientador.js";
import OrientadorEquipo from "../models/OrientadorEquipo.js";
import InfraccionesOrientador from "../models/InfraccionesOrientador.js";

export const list_infracciones = async (req, res, next) => {
    try {

        const infracciones = await Infracciones.findAll()

        return res.status(200).json({
            message: 'Infracciones registradas',
            infracciones: infracciones
        })
    } catch (error) {

        console.error('Error al listar las infracciones: ', error.message)

        return res.status(500).json({
            message: 'Error al listar las infracciones',
            error: error.message
        })
    }
}

// "update_infraccion" con campos provicionales que se cambiaran cuando estén reflejados en la API
// Los campos provicionales son "nombre_infraccion" y "descripcion_infraccion"
export const update_infraccion = async (req, res, next) => {
    try {

        const { id_infraccion, nombre_infraccion, descripcion_infraccion, cantidad_fechas_suspencion } = req.body

        if ( !id_infraccion || !nombre_infraccion ) {
            return res.status(400).json({
                message: 'El id y el nombre de la infracción son obligatorios, por favor verifique'
            })
        }

        if ( cantidad_fechas_suspencion === undefined || cantidad_fechas_suspencion === null
            || cantidad_fechas_suspencion === '' ) {
            return res.status(400).json({
                message: 'La cantidad de fechas de suspensión es obligatoria, por favor verifique'
            })
        }

        if ( isNaN(cantidad_fechas_suspencion) ) {
            return res.status(400).json({
                message: 'La cantidad de fechas de suspensión debe ser un valor numérico, por favor verifique'
            })
        }

        if ( Number(cantidad_fechas_suspencion) < 0 ) {
            return res.status(400).json({
                message: 'La cantidad de fechas de suspensión no puede ser negativa, por favor verifique'
            })
        }

        const infraccion = await Infracciones.findOne({
            where: { id_infraccion: id_infraccion }
        })

        if (!infraccion) {
            return res.status(404).json({
                message: 'Esta infracción no está registrada, por favor verifique'
            })
        }

        const datos_actualizados = {
            nombre_infraccion: nombre_infraccion,
            cantidad_fechas_suspencion: Number(cantidad_fechas_suspencion)
        }

        // la descripción es opcional en la BD, solo se actualiza si viene en la petición
        if (descripcion_infraccion !== undefined) {
            datos_actualizados.descripcion_infraccion = descripcion_infraccion
        }

        await infraccion.update(datos_actualizados)

        return res.status(200).json({
            message: '¡Infracción actualizada con éxito!'
        })

    } catch (error) {

        console.error('Error al actualizar la infracción: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar la infracción',
            error: error.message
        })
    }
}

export const list_infracciones_jugadores = async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        const { count, rows: infracciones_jugadores } = await Infracciones_jugador.findAndCountAll({
            include: [{
                model: Jugador,
                as: 'jugador',
                attributes: ['id_jugador', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'id_equipo'],
                include: [{
                    model: Equipo,
                    as: 'equipo',
                    include: [{
                        model: Categoria,
                        as: 'categoria'
                    }]
                }]
            },
            {
                model: Infracciones,
                as: 'infraccion',
                attributes: ['nombre_infraccion', 'cantidad_fechas_suspencion']
            }
        ],
            limit,
            offset,
            order: [['fecha_amonestacion', 'DESC']]
        })

        return res.status(200).json({
            message: 'Jugadores con infracciones',
            data: infracciones_jugadores,
            total: count,
            page,
            totalPaginas: Math.ceil(count / limit)
        })

    } catch (error) {

        console.error('Error al listar las infracciones de los jugadores: ', error.message)

        return res.status(500).json({
            message: 'Error al listar las infracciones de los jugadores',
            error: error.message
        })
    }
}

export const asignar_infraccion_jugador = async (req, res, next) => {
    try {

        const { id_infraccion, id_jugador, observacion, fecha_amonestacion } = req.body

        if (!id_infraccion || !id_jugador || !observacion || !fecha_amonestacion) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const jugador_exists = await Jugador.findOne({
            where: {
                id_jugador: id_jugador
            }
        })

        if (!jugador_exists) {
            return res.status(404).json({
                message: 'Este jugador no esta registrado, por favor verifique'
            })
        }


        const infraccion_exists = await Infracciones.findOne({
            where: {
                id_infraccion: id_infraccion
            }
        })

        if (!infraccion_exists) {
            return res.status(404).json({
                message: 'Esta infracción no esta registrada, por favor verifique'
            })
        }

        await Infracciones_jugador.create({
            id_infraccion: id_infraccion,
            id_jugador: id_jugador,
            observacion: observacion,
            fecha_amonestacion: fecha_amonestacion
        })

        return res.status(200).json({
            message: '¡Infracción asignada con exito!'
        })

    } catch (error) {


        console.error('Error al asignar la infraccion al jugador: ', error.message)

        return res.status(500).json({
            message: 'Error al asignar la infraccion al jugador',
            error: error.message
        })
    }
}

export const update_infraccion_jugador = async (req, res, next) => {
    try {

        const { id_infraccion, id_jugador, observacion, fecha_amonestacion } = req.body

        if (!id_infraccion || !id_jugador || !observacion || !fecha_amonestacion) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const jugador_exists = await Jugador.findOne({
            where: {
                id_jugador: id_jugador
            }
        })

        if (!jugador_exists) {
            return res.status(404).json({
                message: 'Este jugador no esta registrado, por favor verifique'
            })
        }

        const infraccion = await Infracciones_jugador.findOne({
            where: {
                id_infraccion: id_infraccion,
                id_jugador: id_jugador
            }
        })

        if (!infraccion) {
            return res.status(404).json({
                message: 'Esta infracción no existe para este jugador, por favor verifique'
            })
        }

        await infraccion.update({
            observacion: observacion,
            fecha_amonestacion: fecha_amonestacion
        })

        return res.status(200).json({
            message: '¡Infracción actualizada con exito!'
        })

    } catch (error) {

        console.error('Error al actualizar la infraccion al jugador: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar la infraccion al jugador',
            error: error.message
        })
    }
}

export const delete_infraccion_jugador = async (req, res, next) => {
    try {

        const { id_infraccion, id_jugador } = req.body

        if (!id_infraccion || !id_jugador) {
            return res.status(400).json({
                message: 'El id de la infraccion y el id del jugador son obligatorios, por favor verifique'
            })
        }

        const infraccion = await Infracciones_jugador.findOne({
            where: {
                id_infraccion: id_infraccion,
                id_jugador: id_jugador
            }
        })

        if (!infraccion) {
            return res.status(404).json({
                message: 'Esta infracción no existe para este jugador, por favor verifique'
            })
        }

        await infraccion.destroy()

        return res.status(200).json({
            message: '¡Infracción eliminada con exito!'
        })
    } catch (error) {

        console.error('Error al eliminar la infracción del jugador: ', error.message)

        return res.status(500).json({
            message: 'Error al eliminar la infracción del jugador',
            error: error.message
        })
    }
}

//Listar todas las infracciones de los orientadores
export const list_infracciones_orientadores = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;
        const { dui } = req.query;

        const where = dui ? { dui_orientador: dui } : {};

        const { count, rows: infracciones_orientadores } = await InfraccionesOrientador.findAndCountAll({
            where,
            include: [{
                model: Orientador,
                as: 'orientador',
                attributes: ['dui_orientador', 'nombre_orientador'],
                include: [{
                    model: OrientadorEquipo,
                    as: 'equipos_asignados',
                    include: [{
                        model: Equipo,
                        as: 'equipo',
                        include: [{
                            model: Categoria,
                            as: 'categoria'
                        }]
                    }]
                }]
            }, {
                model: Infracciones,
                as: 'infraccion',
                attributes: ['nombre_infraccion', 'cantidad_fechas_suspencion']
            }],
            limit,
            offset,
            subQuery: false,
            order: [['fecha_amonestacion', 'DESC']]
        });

        return res.status(200).json({
            message: 'Orientadores con infracciones',
            data: infracciones_orientadores,
            total: count,
            page,
            totalPaginas: Math.ceil(count / limit)
        });

    } catch (error) {
        const errorMsg = error.original?.errors?.[0]?.message || error.original?.message || error.message || error.toString();
        console.error('Error al listar las infracciones de los orientadores: ', errorMsg);
        return res.status(500).json({
            message: 'Error al listar las infracciones de los orientadores',
            error: errorMsg
        });
    }
};

// Asignar una infracción a un orientador
export const asignar_infraccion_orientador = async (req, res, next) => {
    try {
        const { id_infraccion, dui_orientador, observacion, fecha_amonestacion } = req.body;

        if (!id_infraccion || !dui_orientador || !observacion) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            });
        }

        const orientador_exists = await Orientador.findOne({
            where: { dui_orientador: dui_orientador }
        });

        if (!orientador_exists) {
            return res.status(404).json({
                message: 'Este orientador no está registrado, por favor verifique'
            });
        }

        const infraccion_exists = await Infracciones.findOne({
            where: { id_infraccion: id_infraccion }
        });

        if (!infraccion_exists) {
            return res.status(404).json({
                message: 'Esta infracción no está registrada, por favor verifique'
            });
        }

        await InfraccionesOrientador.create({
            id_infraccion,
            dui_orientador,
            observacion,
            fecha_amonestacion: fecha_amonestacion || null
        });

        return res.status(200).json({
            message: '¡Infracción asignada con éxito al orientador!'
        });

    } catch (error) {
        const errorMsg = error.original?.errors?.[0]?.message || error.original?.message || error.message || error.toString();
        console.error('Error al asignar la infracción al orientador: ', errorMsg);
        return res.status(500).json({
            message: 'Error al asignar la infracción al orientador',
            error: errorMsg
        });
    }
};

//  Actualizar infracción de un orientador
export const update_infraccion_orientador = async (req, res, next) => {
    try {
        const { id_infraccion, dui_orientador, observacion, fecha_amonestacion } = req.body;

        if (!id_infraccion || !dui_orientador || !observacion) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            });
        }

        const infraccion = await InfraccionesOrientador.findOne({
            where: {
                id_infraccion: id_infraccion,
                dui_orientador: dui_orientador
            }
        });

        if (!infraccion) {
            return res.status(404).json({
                message: 'Esta infracción no existe para este orientador, por favor verifique'
            });
        }

        await infraccion.update({ observacion, ...(fecha_amonestacion && { fecha_amonestacion }) });

        return res.status(200).json({
            message: '¡Infracción del orientador actualizada con éxito!'
        });

    } catch (error) {
        const errorMsg = error.original?.errors?.[0]?.message || error.original?.message || error.message || error.toString();
        console.error('Error al actualizar la infracción al orientador: ', errorMsg);
        return res.status(500).json({
            message: 'Error al actualizar la infracción al orientador',
            error: errorMsg
        });
    }
};

//Eliminar infracción de un orientador
export const delete_infraccion_orientador = async (req, res, next) => {
    try {
        const { id_infraccion, dui_orientador } = req.body;

        if (!id_infraccion || !dui_orientador) {
            return res.status(400).json({
                message: 'El id de la infracción y el dui del orientador son obligatorios'
            });
        }

        const infraccion = await InfraccionesOrientador.findOne({
            where: {
                id_infraccion: id_infraccion,
                dui_orientador: dui_orientador
            }
        });

        if (!infraccion) {
            return res.status(404).json({
                message: 'Esta infracción no existe para este orientador'
            });
        }

        await infraccion.destroy();

        return res.status(200).json({
            message: '¡Infracción del orientador eliminada con éxito!'
        });
    } catch (error) {
        const errorMsg = error.original?.errors?.[0]?.message || error.original?.message || error.message || error.toString();
        console.error('Error al eliminar la infracción del orientador: ', errorMsg);
        return res.status(500).json({
            message: 'Error al eliminar la infracción del orientador',
            error: errorMsg
        });
    }
};