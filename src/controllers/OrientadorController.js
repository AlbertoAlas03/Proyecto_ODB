const { Orientador } = require('../models/Orientador')
const { Op } = require('sequelize');

exports.getOrientadores = async (req, res, next) => {
    try {
        const orientadores = await Orientador.findAll()
        if (orientadores.length === 0) {
            return res.status(404).json({
                message: 'No existen orientadores registrados'
            })
        }
        return res.status(200).json({
            message: 'Orientadores registrados',
            orientadores: orientadores
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los orientadores',
            error: error.message
        })
    }
}

exports.addOrientador = async (req, res, next) => {
    try {
        const {
            dui_orientador,
            nombre_orientador,
            direccion_orientador,
            telefono_fijo_orientador,
            fecha_nacimiento,
            lugar_nacimiento,
            nombre_madre,
            nombre_padre,
            nombre_esposo,
            correo_electronico,
            facebook,
            grupo_familiar,
            religion,
            asiste_iglesia,
            bautizo,
            comunion,
            confirmacion,
            primera_dosis,
            segunda_dosis,
            tercera_dosis,
            estudios_academicos,
            otros_estudios,
            lugar_trabajo
        } = req.body

        if (!nombre_orientador || !dui_orientador || !asiste_iglesia || !confirmacion) {
            return res.status(400).json({
                message: 'el nombre, dui, asiste a iglesia y confirmacion son campos obligatorios, por favor verifique'
            })
        }

        const duiRegex = /^\d{8}-\d{1}$/;
        if (!duiRegex.test(dui_orientador)) {
            return res.status(400).json({
                message: 'Formato de DUI inválido. Debe ser "########-#", por favor verifique',
            });
        }

        const orientador = await Orientador.findOne({
            where: {
                dui_orientador: dui_orientador
            }
        })

        if (orientador) {
            return res.status(400).json({
                message: 'Este dui ya esta registrado'
            })
        }

        await Orientador.create({
            dui_orientador: dui_orientador,
            nombre_orientador: nombre_orientador,
            direccion_orientador: direccion_orientador,
            telefono_fijo_orientador: telefono_fijo_orientador,
            fecha_nacimiento: fecha_nacimiento,
            lugar_nacimiento: lugar_nacimiento,
            nombre_madre: nombre_madre,
            nombre_padre: nombre_padre,
            nombre_esposo: nombre_esposo,
            correo_electronico: correo_electronico,
            facebook: facebook,
            grupo_familiar: grupo_familiar,
            religion: religion,
            asiste_iglesia: asiste_iglesia,
            bautizo: bautizo,
            comunion: comunion,
            confirmacion: confirmacion,
            primera_dosis: primera_dosis,
            segunda_dosis: segunda_dosis,
            tercera_dosis: tercera_dosis,
            estudios_academicos: estudios_academicos,
            otros_estudios: otros_estudios,
            lugar_trabajo: lugar_trabajo
        })

        return res.status(200).json({
            message: 'Orientador registrado con exito'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el orientador',
            error: error.message
        })
    }
}

exports.updateOrientador = async (req, res, next) => {
    try {
        const {
            dui_orientador,
            nombre_orientador,
            direccion_orientador,
            telefono_fijo_orientador,
            fecha_nacimiento,
            lugar_nacimiento,
            nombre_madre,
            nombre_padre,
            nombre_esposo,
            correo_electronico,
            facebook,
            grupo_familiar,
            religion,
            asiste_iglesia,
            bautizo,
            comunion,
            confirmacion,
            primera_dosis,
            segunda_dosis,
            tercera_dosis,
            estudios_academicos,
            otros_estudios,
            lugar_trabajo
        } = req.body

        if (!nombre_orientador || !dui_orientador || !asiste_iglesia || !confirmacion) {
            return res.status(400).json({
                message: 'el nombre, dui, asiste a iglesia y confirmacion son campos obligatorios'
            })
        }

        const orientador = await Orientador.findOne({
            where: { dui_orientador: dui_orientador }
        });

        if (!orientador) {
            return res.status(404).json({
                message: 'Orientador no encontrado con el DUI proporcionado, por favor verifique'
            });
        }

        await orientador.update({
            nombre_orientador: nombre_orientador,
            direccion_orientador: direccion_orientador,
            telefono_fijo_orientador: telefono_fijo_orientador,
            fecha_nacimiento: fecha_nacimiento,
            lugar_nacimiento: lugar_nacimiento,
            nombre_madre: nombre_madre,
            nombre_padre: nombre_padre,
            nombre_esposo: nombre_esposo,
            correo_electronico: correo_electronico,
            facebook: facebook,
            grupo_familiar: grupo_familiar,
            religion: religion,
            asiste_iglesia: asiste_iglesia,
            bautizo: bautizo,
            comunion: comunion,
            confirmacion: confirmacion,
            primera_dosis: primera_dosis,
            segunda_dosis: segunda_dosis,
            tercera_dosis: tercera_dosis,
            estudios_academicos: estudios_academicos,
            otros_estudios: otros_estudios,
            lugar_trabajo: lugar_trabajo
        })
        return res.status(200).json({
            message: 'Orientador actualizado con exito'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el orientador',
            error: error.message
        })
    }
}

exports.deleteOrientador = async (req, res, next) => {
    try {
        const { dui_orientador } = req.body

        if (!dui_orientador) {
            return res.status(400).json({
                message: 'El dui del orientador es un campo obligatorio'
            })
        }

        const orientador = await Orientador.findOne({
            where: {
                dui_orientador: dui_orientador
            }
        })

        if (!orientador) {
            return res.status(404).json({
                message: 'Orientador no encontrado con el DUI proporcionado, por favor verifique'
            })
        }

        await orientador.destroy()
        return res.status(200).json({
            message: 'Orientador eliminado con exito'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el orientador',
            error: error.message
        })
    }
}
