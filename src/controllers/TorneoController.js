import Torneo from "../models/Torneo.js";
import { Op } from "sequelize";

export const getTorneos = async (req, res, next) => {
    try {
        const torneos = await Torneo.findAll();
        if (torneos.length === 0) {
            return res.status(404).json({
                message: 'No hay torneos registrados'
            });
        }
        return res.status(200).json({
            message: 'Torneos registrados',
            torneos: torneos
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los torneos',
            error: error.message
        });
    }
};

export const addTorneo = async (req, res, next) => {
    try {
        const { nombre_torneo, anio, fecha_inicio, fecha_cierre } = req.body;

        if (!nombre_torneo || !anio) {
            return res.status(400).json({
                message: 'El nombre del torneo y el año son campos obligatorios, por favor verifique'
            });
        }

        const anioNum = parseInt(anio);
        const anioActual = new Date().getFullYear();

        if (isNaN(anioNum) || anioNum < 2000 || anioNum > anioActual + 5) {
            return res.status(400).json({
                message: `El año debe ser un valor válido entre 2000 y ${anioActual + 5}`
            });
        }

        if (fecha_inicio && isNaN(new Date(fecha_inicio).getTime())) {
            return res.status(400).json({ message: 'La fecha de inicio no es válida' });
        }

        if (fecha_cierre && isNaN(new Date(fecha_cierre).getTime())) {
            return res.status(400).json({ message: 'La fecha de cierre no es válida' });
        }

        if (fecha_inicio && fecha_cierre && new Date(fecha_cierre) <= new Date(fecha_inicio)) {
            return res.status(400).json({
                message: 'La fecha de cierre debe ser posterior a la fecha de inicio'
            });
        }

        const torneoExistente = await Torneo.findOne({
            where: { nombre_torneo, anio: anioNum }
        });

        if (torneoExistente) {
            return res.status(409).json({
                message: 'Ya existe un torneo con ese nombre para el año indicado'
            });
        }

        const lastTorneo = await Torneo.findOne({
            order: [['id_torneo', 'DESC']]
        });

        let nextNumber = 1;
        if (lastTorneo) {
            const num = parseInt(lastTorneo.id_torneo.slice(1));
            nextNumber = num + 1;
        }

        const id_torneo = `T${nextNumber.toString().padStart(5, '0')}`;

        await Torneo.create({
            id_torneo,
            nombre_torneo,
            anio: anioNum,
            fecha_inicio: fecha_inicio || null,
            fecha_cierre: fecha_cierre || null,
            estado: 'activo'
        });

        return res.status(201).json({
            message: 'Torneo registrado con exito'
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Ya existe un torneo con ese identificador, intente de nuevo'
            });
        }
        return res.status(500).json({
            message: 'Error al agregar el torneo',
            error: error.message
        });
    }
};

export const updateTorneo = async (req, res, next) => {
    try {
        const { id_torneo, nombre_torneo, anio, fecha_inicio, fecha_cierre, estado } = req.body;

        if (!id_torneo || !nombre_torneo || !anio) {
            return res.status(400).json({
                message: 'El id, nombre y año del torneo son campos obligatorios, por favor verifique'
            });
        }

        const torneo = await Torneo.findOne({ where: { id_torneo } });

        if (!torneo) {
            return res.status(404).json({
                message: 'Este torneo no está registrado, por favor verifique'
            });
        }

        if (torneo.estado?.trim() === 'finalizado') {
            return res.status(422).json({
                message: 'No se puede modificar un torneo finalizado'
            });
        }

        const anioNum = parseInt(anio);
        const anioActual = new Date().getFullYear();

        if (isNaN(anioNum) || anioNum < 2000 || anioNum > anioActual + 5) {
            return res.status(400).json({
                message: `El año debe ser un valor válido entre 2000 y ${anioActual + 5}`
            });
        }

        const inicioDate = fecha_inicio ? new Date(fecha_inicio) : null;
        const cierreDate = fecha_cierre ? new Date(fecha_cierre) : null;

        if (inicioDate && isNaN(inicioDate.getTime())) {
            return res.status(400).json({ message: 'La fecha de inicio no es válida' });
        }

        if (cierreDate && isNaN(cierreDate.getTime())) {
            return res.status(400).json({ message: 'La fecha de cierre no es válida' });
        }

        if (inicioDate && cierreDate && cierreDate <= inicioDate) {
            return res.status(400).json({
                message: 'La fecha de cierre debe ser posterior a la fecha de inicio'
            });
        }

        const estadosValidos = ['activo', 'inactivo', 'finalizado'];
        if (estado && !estadosValidos.includes(estado)) {
            return res.status(400).json({
                message: 'El estado debe ser "activo", "inactivo" o "finalizado"'
            });
        }

        const duplicado = await Torneo.findOne({
            where: {
                nombre_torneo,
                anio: anioNum,
                id_torneo: { [Op.ne]: id_torneo }
            }
        });

        if (duplicado) {
            return res.status(409).json({
                message: 'Ya existe otro torneo con ese nombre para el año indicado'
            });
        }

        await torneo.update({
            nombre_torneo,
            anio: anioNum,
            fecha_inicio: fecha_inicio || null,
            fecha_cierre: fecha_cierre || null,
            estado: estado || torneo.estado
        });

        return res.status(200).json({
            message: 'Torneo actualizado con exito'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el torneo',
            error: error.message
        });
    }
};
