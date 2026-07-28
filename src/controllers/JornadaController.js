import Torneo from "../models/Torneo.js";
import Jugador from "../models/Jugador.js";
import Orientador from "../models/Orientador.js";
import Infracciones from "../models/Infracciones.js";
import Infracciones_jugador from "../models/Infracciones_jugador.js";
import InfraccionesOrientador from "../models/InfraccionesOrientador.js";
import {
    calendarioDe,
    esJornadaValida,
    jornadaActual,
    jornadaDeFecha,
    pendientesDe,
    rangoDeJornada,
    totalJornadas,
    DIAS_POR_JORNADA
} from "../utils/jornadas.js";

// Busca el torneo y valida que tenga las fechas necesarias para derivar jornadas.
// Devuelve { torneo } o { error: { status, message } }.
const obtenerTorneoConFechas = async (id_torneo) => {
    if (!id_torneo) {
        return { error: { status: 400, message: 'El id_torneo es obligatorio, por favor verifique' } };
    }

    const torneo = await Torneo.findOne({ where: { id_torneo } });

    if (!torneo) {
        return { error: { status: 404, message: 'Este torneo no esta registrado, por favor verifique' } };
    }

    if (!torneo.fecha_inicio || !torneo.fecha_cierre) {
        return {
            error: {
                status: 400,
                message: 'El torneo no tiene fecha de inicio y cierre definidas, no es posible calcular las jornadas'
            }
        };
    }

    return { torneo };
};

// Acumula las suspensiones de un conjunto de infracciones, indexadas por infractor.
// Sirve igual para jugadores y orientadores: ambas tablas tienen fecha_amonestacion
// y comparten el catálogo de infracciones, así que solo cambia la clave.
const acumularSuspensiones = (filas, torneo, actual, claveDe) => {
    const suspensiones = {};
    let fuera_de_rango = 0;
    let sin_fecha = 0;

    for (const item of filas) {
        // En infracciones_orientador la fecha es nullable: sin fecha no hay jornada.
        if (!item.fecha_amonestacion) {
            sin_fecha++;
            continue;
        }

        const jornada = jornadaDeFecha(torneo.fecha_inicio, item.fecha_amonestacion);

        // La infracción no pertenece a este torneo: su fecha cae fuera del calendario.
        if (!esJornadaValida(torneo, jornada)) {
            fuera_de_rango++;
            continue;
        }

        const clave = claveDe(item);
        const cuesta = Number(item.infraccion?.cantidad_fechas_suspencion) || 0;
        const pendientes = pendientesDe(jornada, cuesta, actual);

        if (!suspensiones[clave]) {
            suspensiones[clave] = { pendientes: 0, total_historico: 0, detalle: [] };
        }

        const registro = suspensiones[clave];

        registro.pendientes += pendientes;
        registro.total_historico += cuesta;
        registro.detalle.push({
            nombre_infraccion: item.infraccion?.nombre_infraccion,
            fecha_amonestacion: item.fecha_amonestacion,
            jornada,
            cuesta,
            pendientes
        });
    }

    // El detalle más reciente primero, que es el que interesa al consultar.
    for (const registro of Object.values(suspensiones)) {
        registro.detalle.sort((a, b) => b.jornada - a.jornada);
    }

    return { suspensiones, fuera_de_rango, sin_fecha };
};

export const list_jornadas = async (req, res, next) => {
    try {
        const { torneo, error } = await obtenerTorneoConFechas(req.query.id_torneo);

        if (error) return res.status(error.status).json({ message: error.message });

        return res.status(200).json({
            message: 'Jornadas del torneo',
            id_torneo: torneo.id_torneo,
            dias_por_jornada: DIAS_POR_JORNADA,
            total_jornadas: totalJornadas(torneo),
            jornadas: calendarioDe(torneo)
        });

    } catch (error) {

        console.error('Error al listar las jornadas: ', error.message);

        return res.status(500).json({
            message: 'Error al listar las jornadas',
            error: error.message
        });
    }
};

export const jornada_actual = async (req, res, next) => {
    try {
        const { torneo, error } = await obtenerTorneoConFechas(req.query.id_torneo);

        if (error) return res.status(error.status).json({ message: error.message });

        const numero = jornadaActual(torneo);

        return res.status(200).json({
            message: 'Jornada actual del torneo',
            id_torneo: torneo.id_torneo,
            jornada_actual: numero,
            total_jornadas: totalJornadas(torneo),
            ...rangoDeJornada(torneo, numero)
        });

    } catch (error) {

        console.error('Error al obtener la jornada actual: ', error.message);

        return res.status(500).json({
            message: 'Error al obtener la jornada actual',
            error: error.message
        });
    }
};

export const suspensiones_jugadores = async (req, res, next) => {
    try {
        const { id_equipo } = req.query;

        const { torneo, error } = await obtenerTorneoConFechas(req.query.id_torneo);

        if (error) return res.status(error.status).json({ message: error.message });

        const actual = jornadaActual(torneo);

        const infracciones = await Infracciones_jugador.findAll({
            include: [
                {
                    model: Jugador,
                    as: 'jugador',
                    attributes: ['id_jugador', 'id_equipo'],
                    where: id_equipo ? { id_equipo } : undefined,
                    required: !!id_equipo
                },
                {
                    model: Infracciones,
                    as: 'infraccion',
                    attributes: ['nombre_infraccion', 'cantidad_fechas_suspencion']
                }
            ]
        });

        const { suspensiones, fuera_de_rango, sin_fecha } =
            acumularSuspensiones(infracciones, torneo, actual, (item) => item.id_jugador);

        return res.status(200).json({
            message: 'Suspensiones de los jugadores',
            id_torneo: torneo.id_torneo,
            jornada_actual: actual,
            total_jornadas: totalJornadas(torneo),
            infracciones_fuera_de_rango: fuera_de_rango,
            infracciones_sin_fecha: sin_fecha,
            suspensiones
        });

    } catch (error) {

        console.error('Error al calcular las suspensiones de los jugadores: ', error.message);

        return res.status(500).json({
            message: 'Error al calcular las suspensiones de los jugadores',
            error: error.message
        });
    }
};

export const suspensiones_orientadores = async (req, res, next) => {
    try {
        const { dui } = req.query;

        const { torneo, error } = await obtenerTorneoConFechas(req.query.id_torneo);

        if (error) return res.status(error.status).json({ message: error.message });

        const actual = jornadaActual(torneo);

        const infracciones = await InfraccionesOrientador.findAll({
            where: dui ? { dui_orientador: dui } : {},
            include: [
                {
                    model: Orientador,
                    as: 'orientador',
                    attributes: ['dui_orientador', 'nombre_orientador']
                },
                {
                    model: Infracciones,
                    as: 'infraccion',
                    attributes: ['nombre_infraccion', 'cantidad_fechas_suspencion']
                }
            ]
        });

        const { suspensiones, fuera_de_rango, sin_fecha } =
            acumularSuspensiones(infracciones, torneo, actual, (item) => item.dui_orientador);

        return res.status(200).json({
            message: 'Suspensiones de los orientadores',
            id_torneo: torneo.id_torneo,
            jornada_actual: actual,
            total_jornadas: totalJornadas(torneo),
            infracciones_fuera_de_rango: fuera_de_rango,
            infracciones_sin_fecha: sin_fecha,
            suspensiones
        });

    } catch (error) {

        console.error('Error al calcular las suspensiones de los orientadores: ', error.message);

        return res.status(500).json({
            message: 'Error al calcular las suspensiones de los orientadores',
            error: error.message
        });
    }
};
