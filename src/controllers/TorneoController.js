import Torneo from "../models/Torneo.js";
import Catergoria from "../models/Categoria.js";
import TorneoCategoria from "../models/TorneoCategoria.js";
import { cast, Op } from "sequelize";

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

        if (isNaN(anioNum) || anioNum < anioActual || anioNum > anioActual + 5) {
            return res.status(400).json({
                message: `El año debe ser un valor válido a partir de ${anioActual} y no mayor a ${anioActual + 5}`
            });
        }

        if (fecha_inicio && isNaN(new Date(fecha_inicio).getTime())) {
            return res.status(400).json({ message: 'La fecha de inicio no es válida' });
        }

        if (fecha_cierre && isNaN(new Date(fecha_cierre).getTime())) {
            return res.status(400).json({ message: 'La fecha de cierre no es válida' });
        }

        // Las fechas pueden ser de años distintos, pero ambas deben ser >= año en curso
        if (fecha_inicio && new Date(fecha_inicio).getFullYear() < anioActual) {
            return res.status(400).json({ message: 'La fecha de inicio debe ser a partir del año en curso' });
        }

        if (fecha_cierre && new Date(fecha_cierre).getFullYear() < anioActual) {
            return res.status(400).json({ message: 'La fecha de cierre debe ser a partir del año en curso' });
        }

        // No se permite mismo día ni cierre anterior al inicio
        if (fecha_inicio && fecha_cierre) {
            const ini = new Date(fecha_inicio);
            const cie = new Date(fecha_cierre);
            if (cie <= ini) {
                return res.status(400).json({
                    message: 'La fecha de cierre debe ser posterior a la fecha de inicio (no puede ser el mismo día)'
                });
            }
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
            message: 'Torneo registrado con exito',
            id_torneo
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

        if (isNaN(anioNum) || anioNum < anioActual || anioNum > anioActual + 5) {
            return res.status(400).json({
                message: `El año debe ser un valor válido a partir de ${anioActual} y no mayor a ${anioActual + 5}`
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

        // Las fechas pueden ser de años distintos, pero ambas deben ser >= año en curso
        if (inicioDate && inicioDate.getFullYear() < anioActual) {
            return res.status(400).json({ message: 'La fecha de inicio debe ser a partir del año en curso' });
        }

        if (cierreDate && cierreDate.getFullYear() < anioActual) {
            return res.status(400).json({ message: 'La fecha de cierre debe ser a partir del año en curso' });
        }

        // No se permite mismo día ni cierre anterior al inicio
        if (inicioDate && cierreDate && cierreDate <= inicioDate) {
            return res.status(400).json({
                message: 'La fecha de cierre debe ser posterior a la fecha de inicio (no puede ser el mismo día)'
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

export const deleteTorneo = async (req, res, next) => {
    try {
        const { id_torneo } = req.body;

        if (!id_torneo) {
            return res.status(400).json({
                message: 'El id del torneo es obligatorio'
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
                message: 'No se puede eliminar un torneo que ya ha sido finalizado'
            });
        }

        await torneo.destroy();

        return res.status(200).json({
            message: 'Torneo eliminado con éxito'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el torneo',
            error: error.message
        });
    }
};

export const asignarCategoriaATorneo = async (req, res, next) => {
    try {
        const { id_torneo, id_categoria, participo } = req.body;

        if (!id_torneo || !id_categoria) {
            return res.status(400).json({
                message: 'El id del torneo y el id de la categoria son obligatorios, por favor verifique'
            });
        }

        const torneoExists = await Torneo.findOne({ where: { id_torneo } });
        if (!torneoExists) {
            return res.status(404).json({ message: 'El torneo indicado no existe' });
        }

        const categoriaExists = await Catergoria.findOne({ where: { id_categoria } });
        if (!categoriaExists) {
            return res.status(404).json({ message: 'La categoria indicada no existe' });
        }

        if (torneoExists.estado?.trim() === 'finalizado') {
            return res.status(422).json({ message: 'No se pueden asignar categoria a un torneo finalizado' });
        }

        const relacionExiste = await TorneoCategoria.findOne({
            where: { id_torneo, id_categoria }
        });

        if (relacionExiste) {
            return res.status(409).json({
                message: 'Esta categoría ya se encuentra asociada a este torneo'
            });
        }

        await TorneoCategoria.create({
            id_torneo,
            id_categoria,
            participo: participo !== undefined ? participo : true
        });

        return res.status(201).json({ message: 'Categoria asignada al torneo con exito' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al asignar la categoria al torneo',
            error: error.message
        });
    }
};

// removeCategoriaDeTorneo — elimina la asignación de una categoría a un torneo
export const removeCategoriaDeTorneo = async (req, res, next) => {
    try {
        const { id_torneo, id_categoria } = req.body;

        if (!id_torneo || !id_categoria) {
            return res.status(400).json({
                message: 'El id del torneo y el id de la categoría son obligatorios'
            });
        }

        const torneoExists = await Torneo.findOne({ where: { id_torneo } });
        if (!torneoExists) {
            return res.status(404).json({ message: 'El torneo indicado no existe' });
        }

        if (torneoExists.estado?.trim() === 'finalizado') {
            return res.status(422).json({ message: 'No se pueden modificar las categorías de un torneo finalizado' });
        }

        const relacion = await TorneoCategoria.findOne({ where: { id_torneo, id_categoria } });
        if (!relacion) {
            return res.status(404).json({
                message: 'Esta categoría no estaba asignada a este torneo'
            });
        }

        await relacion.destroy();

        return res.status(200).json({ message: 'Categoría desasignada del torneo con éxito' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al desasignar la categoría del torneo',
            error: error.message
        });
    }
};

export const updateParticipacion = async (req, res, next) => {
    try {
        const { id_torneo, id_categoria, participo } = req.body;

        if (!id_torneo || !id_categoria || participo === undefined) {
            return res.status(400).json({
                message: 'El id_torneo, id_categoria y el valor de participo son obligatorios'
            });
        }

        const relacion = await TorneoCategoria.findOne({ where: { id_torneo, id_categoria } });

        if (!relacion) {
            return res.status(404).json({
                message: 'No se encontró una asignación previa entre este torneo y la categoria'
            });
        }

        await relacion.update({ participo });

        return res.status(200).json({
            message: 'Participación de la categoria actualizada con éxito'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar la participación de la categoria',
            error: error.message
        });
    }
};

export const getCategoriasAsignadasTorneo = async (req, res, next) => {
    try {
        const { id_torneo } = req.body;

        if (!id_torneo) {
            return res.status(400).json({ message: 'El id del torneo es obligatorio' });
        }

        const torneoExists = await Torneo.findOne({ where: { id_torneo } });
        if (!torneoExists) {
            return res.status(404).json({ message: 'El torneo indicado no existe' });
        }

        const asignaciones = await TorneoCategoria.findAll({ where: { id_torneo } });

        return res.status(200).json({
            id_torneo,
            categorias: asignaciones.map((a) => ({
                id_categoria: a.id_categoria,
                participo: a.participo
            }))
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las categorías del torneo',
            error: error.message
        });
    }
};
