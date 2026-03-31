import Infracciones_jugador from "../models/Infracciones_jugador.js";
import Infracciones from "../models/Infracciones.js";
import Jugador from '../models/Jugador.js'
import Equipo from '../models/Equipo.js'
import Categoria from '../models/Categoria.js'

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

export const list_infracciones_jugadores = async (req, res, next) => {
    try {

        const infracciones_jugadores = await Infracciones_jugador.findAll({
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
            }]
        })

        return res.status(200).json({
            message: 'Jugadores con infracciones',
            data: infracciones_jugadores
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