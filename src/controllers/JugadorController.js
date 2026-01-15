import Jugador from '../models/Jugador.js';
import Equipo from '../models/Equipo.js';
import Categoria from '../models/Categoria.js';
import Op from 'sequelize';
import validations from '../utils/validations.js';

const { validate_DUI } = validations()

export const getJugadores = async (req, res, next) => {
    try {
        const jugadores = await Jugador.findAll({
            include: [
                {
                    model: Equipo,
                    as: 'equipo',
                    include: [{
                        model: Categoria,
                        as: 'categoria'
                    }
                    ]
                }
            ]
        })
        if (jugadores.length === 0) {
            return res.status(404).json({
                message: 'No hay jugadores registrados'
            })
        }
        return res.status(200).json({
            message: "Jugadores registrados",
            jugadores: jugadores
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los jugadores'
        })
    }
}

export const addJugador = async (req, res, next) => {
    try {
        const {
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            fecha_nacimiento,
            genero,
            centro_estudio,
            direccion,
            telefono_fijo,
            telefono_movil,
            religion,
            foto_actual,
            madre,
            numero_partida,
            numero_folio,
            numero_libro,
            año_partida,
            lugar_nacimiento,
            nombre_madre,
            nombre_padre,
            correo,
            facebook,
            asiste_iglesia,
            grupo_familiar,
            primera_dosis,
            segunda_dosis,
            tercera_dosis,
            autorizacion_traslado,
            grado_estudio,
            turno_estudio,
            direccion_centro_estudio,
            bautizo,
            comunion,
            confirmacion,
            dui_jugador,
            id_equipo
        } = req.body

        if (!nombre1 || !apellido1 || !fecha_nacimiento || !genero || !id_equipo) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios, por favor verifique'
            })
        }

        if (dui_jugador) {

            if (!validate_DUI(dui_jugador)) {
                return res.status(400).json({
                    message: 'Formato de DUI inválido. Debe ser "########-#", por favor verifique',
                });
            }

            const verifyDUI = await Jugador.findOne({
                where: {
                    dui_jugador: dui_jugador
                }
            })

            if (verifyDUI) {
                return res.status(400).json({
                    message: 'Este dui ya esta registrado'
                })
            }
        }

        const equipo = await Equipo.findOne({
            where: {
                id_equipo: id_equipo
            }
        })

        if (!equipo) {
            return res.status(404).json({
                message: 'Este equipo no esta registrado, por favor verifique'
            })
        }

        var iniciales

        if (apellido1 && apellido2 && apellido2.trim() !== "") {
            iniciales = apellido1.charAt(0).toUpperCase() + apellido2.charAt(0).toUpperCase();
        } else {
            iniciales = apellido1.substring(0, 2).toUpperCase();
        }

        const prefijo = `J${iniciales}`;

        const count = await Jugador.count({
            where: {
                id_jugador: {
                    [Op.like]: `${prefijo}%`
                }
            }
        });

        const id_jugador = `${prefijo}${(count + 1).toString().padStart(4, "0")}`;

        await Jugador.create({
            id_jugador: id_jugador,
            nombre1: nombre1,
            nombre2: nombre2,
            apellido1: apellido1,
            apellido2: apellido2,
            fecha_nacimiento: fecha_nacimiento,
            genero: genero,
            centro_estudio: centro_estudio,
            direccion: direccion,
            telefono_fijo: telefono_fijo,
            telefono_movil: telefono_movil,
            religion: religion,
            foto_actual: foto_actual,
            madre: madre,
            numero_partida: numero_partida,
            numero_folio: numero_folio,
            numero_libro: numero_libro,
            año_partida: año_partida,
            lugar_nacimiento: lugar_nacimiento,
            nombre_madre: nombre_madre,
            nombre_padre: nombre_padre,
            correo: correo,
            facebook: facebook,
            asiste_iglesia: asiste_iglesia,
            grupo_familiar: grupo_familiar,
            primera_dosis: primera_dosis,
            segunda_dosis: segunda_dosis,
            tercera_dosis: tercera_dosis,
            autorizacion_traslado: autorizacion_traslado,
            grado_estudio: grado_estudio,
            turno_estudio: turno_estudio,
            direccion_centro_estudio: direccion_centro_estudio,
            bautizo: bautizo,
            comunion: comunion,
            confirmacion: confirmacion,
            dui_jugador: dui_jugador,
            id_equipo: id_equipo
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el jugador',
            error: error.message
        })
    }
}


export const updateJugador = async (req, res, next) => {
    try {
        const {
            id_jugador,
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            fecha_nacimiento,
            genero,
            centro_estudio,
            direccion,
            telefono_fijo,
            telefono_movil,
            religion,
            foto_actual,
            madre,
            numero_partida,
            numero_folio,
            numero_libro,
            año_partida,
            lugar_nacimiento,
            nombre_madre,
            nombre_padre,
            correo,
            facebook,
            asiste_iglesia,
            grupo_familiar,
            primera_dosis,
            segunda_dosis,
            tercera_dosis,
            autorizacion_traslado,
            grado_estudio,
            turno_estudio,
            direccion_centro_estudio,
            bautizo,
            comunion,
            confirmacion,
            activo,
            dui_jugador,
            id_equipo
        } = req.body

        if (!id_jugador || !nombre1 || !apellido1 || !fecha_nacimiento || !genero || !id_equipo) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios, por favor verifique'
            })
        }

        const jugador = await Jugador.findOne({
            where: {
                id_jugador: id_jugador
            }
        })

        if (!jugador) {
            return res.status(404).json({
                message: 'Este jugador no esta registrado, por favor verifique'
            })
        }

        const equipo = await Equipo.findOne({
            where: {
                id_equipo: id_equipo
            }
        })

        if (!equipo) {
            return res.status(404).json({
                message: 'Este equipo no esta registrado, por favor verifique'
            })
        }

        await jugador.update({
            nombre1: nombre1,
            nombre2: nombre2,
            apellido1: apellido1,
            apellido2: apellido2,
            fecha_nacimiento: fecha_nacimiento,
            genero: genero,
            centro_estudio: centro_estudio,
            direccion: direccion,
            telefono_fijo: telefono_fijo,
            telefono_movil: telefono_movil,
            religion: religion,
            foto_actual: foto_actual,
            madre: madre,
            numero_partida: numero_partida,
            numero_folio: numero_folio,
            numero_libro: numero_libro,
            año_partida: año_partida,
            lugar_nacimiento: lugar_nacimiento,
            nombre_madre: nombre_madre,
            nombre_padre: nombre_padre,
            correo: correo,
            facebook: facebook,
            asiste_iglesia: asiste_iglesia,
            grupo_familiar: grupo_familiar,
            primera_dosis: primera_dosis,
            segunda_dosis: segunda_dosis,
            tercera_dosis: tercera_dosis,
            autorizacion_traslado: autorizacion_traslado,
            grado_estudio: grado_estudio,
            turno_estudio: turno_estudio,
            direccion_centro_estudio: direccion_centro_estudio,
            bautizo: bautizo,
            comunion: comunion,
            confirmacion: confirmacion,
            activo: activo, // esto faltabaaaaa
            dui_jugador: dui_jugador,
            id_equipo: id_equipo
        })

// ✅ Devuelve el jugador actualizado
        return res.status(200).json({
            message: 'Jugador actualizado correctamente',
            jugador: jugador // aquí está el jugador actualizado
        })


    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el jugador',
            error: error.message
        })
    }
}

export const deleteJugador = async (req, res, next) => {
    try {
        const { id_jugador } = req.body

        if (!id_jugador) {
            return res.status(400).json({
                message: 'El id del jugador es obligatorio, por favor verifique'
            })
        }

        const jugador = await Jugador.findOne({
            where: {
                id_jugador: id_jugador
            }
        })

        if (!jugador) {
            return res.status(404).json({
                message: 'Este jugador no esta registrado, por favor verifique'
            })
        }

        await jugador.destroy()

        return res.status(200).json({
            message: 'Jugador eliminado con exito'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el jugador',
            error: error.message
        })
    }
}

export const JugadorByID = async (req, res, next) => {
    try {
        const { id_jugador } = req.body
        if (!id_jugador) {
            return res.status(400).json({
                message: 'Debes ingresar el id del jugador que andas buscando, por favor verifique'
            })
        }

        const jugador = await Jugador.findOne({
            where: {
                id_jugador: id_jugador
            },
            include: [
                {
                    model: Equipo
                }
            ]
        })

        if (!jugador) {
            return res.status(404).json({
                message: 'Jugador no encontrado'
            })
        }

        return res.status(200).json({
            message: 'Jugador encontrado!',
            jugador: [jugador]
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el jugador por su id',
            error: error.message
        })
    }
}

export const JugadorByFullName = async (req, res, next) => {
    try {
        const { nombre_completo } = req.body
        if (!nombre_completo) {
            return res.status(400).json({
                message: 'Debes ingresar el nombre del jugador que andas buscando, por favor verifique'
            })
        }

        const partes = nombre_completo.trim().split(/\s+/).map(p => p.toLowerCase());

        if (partes.length < 2) {
            return res.status(400).json({ message: 'Debes ingresar al menos un nombre y un apellido del jugador, por favor verifique' });
        }

        const [nombre1, nombre2, apellido1, apellido2] = [
            partes[0] || '',
            partes[1] && partes.length === 4 ? partes[1] : '',
            partes.length === 4 ? partes[2] : (partes[1] || ''),
            partes.length === 4 ? partes[3] : (partes[2] || '')
        ];

        const jugador = await Jugador.findOne({
            where: {
                [Op.and]: [
                    { nombre1: { [Op.like]: nombre1 } },
                    { apellido1: { [Op.like]: apellido1 } },
                    ...(nombre2 ? [{ nombre2: { [Op.like]: nombre2 } }] : []),
                    ...(apellido2 ? [{ apellido2: { [Op.like]: apellido2 } }] : [])
                ]
            },
            include: [
                {
                    model: Equipo
                }
            ]
        });

        if (!jugador) {
            return res.status(404).json({
                message: 'Jugador no encontrado'
            })
        }

        return res.status(200).json({
            message: 'Jugador encontrado!',
            jugador: jugador
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el jugador por su nombre completo',
            error: error.message
        })
    }
}

export const JugadorByEquipo = async (req, res, next) => {
    try {
        const { id_equipo, id_jugador } = req.body
        if (!id_jugador || !id_equipo) {
            return res.status(400).json({
                message: 'El id del equipo y del jugador son obligatorios, por favor verifique'
            })
        }

        const jugador = await Jugador.findOne({
            where: {
                id_jugador: id_jugador,
                id_equipo: id_equipo
            }
        })

        if (!jugador) {
            return res.status(404).json({
                message: 'Jugador no encontrado'
            })
        }

        return res.status(200).json({
            message: 'Jugador encontrado!',
            jugador: [jugador]
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el jugador',
            error: error.message
        })
    }
}

export const JugadorByCategoria = async (req, res, next) => {
    try {
        const { id_categoria, id_equipo, id_jugador } = req.body
        if (!id_categoria || !id_jugador || !id_equipo) {
            return res.status(400).json({
                message: 'El id de la categoria, equipo y jugador son obligatorios, por favor verifique'
            })
        }

        const equipo = await Equipo.findOne({
            where: {
                id_categoria: id_categoria,
                id_equipo: id_equipo
            }
        })

        if (!equipo) {
            return res.status(400).json({
                message: 'Este equipo no esta registrado, por favor verifique'
            })
        }

        const jugador = await Jugador.findOne({
            where: {
                id_equipo: equipo.id_equipo,
                id_jugador: id_jugador
            }
        })

        if (!jugador) {
            return res.status(404).json({
                message: 'Jugador no encontrado'
            })
        }
        return res.status(200).json({
            message: 'Jugador encontrado!',
            jugador: [jugador]
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el jugador',
            error: error.message
        })
    }
}


export const ChangeJugadorEquipo = async (req, res, next) => {
    try {
        const { id_jugador, id_categoria, id_equipo } = req.body
        if (!id_jugador || !id_categoria || !id_equipo) {
            return res.status(400).json({
                message: 'El id del jugador, categoria y equipo son obligatorios'
            })
        }

        const categoria = await Categoria.findOne({
            where: {
                id_categoria: id_categoria
            }
        })

        const equipo = await Equipo.findOne({
            where: {
                id_equipo: id_equipo,
                id_categoria: id_categoria
            }
        })

        const jugador = await Jugador.findOne({
            where: {
                id_jugador: id_jugador
            }
        })

        if (!equipo) {
            return res.status(400).json({
                message: 'Este equipo no esta registrado en esta categoria, por favor verifique'
            })
        } else if (!categoria) {
            return res.status(400).json({
                message: 'Esta categoria no esta registrada, por favor verifique'
            })
        }

        const fechaNacimiento = new Date(jugador.fecha_nacimiento)
        const fechaActual = new Date()
        const edadJugador = fechaActual.getFullYear() - fechaNacimiento.getFullYear()

        const mesActual = fechaActual.getMonth();
        const diaActual = fechaActual.getDate();
        const mesNacimiento = fechaNacimiento.getMonth();
        const diaNacimiento = fechaNacimiento.getDate();

        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edadJugador--
        }

        if (categoria.edadmax < edadJugador) {
            return res.status(400).json({
                message: 'Este jugador sobrepasa la edad maxima requerida para esta categoria'
            })
        } else if (categoria.edadmin > edadJugador) {
            return res.status(400).json({
                message: 'Este jugador no tiene la edad minima requerida para ingresar a esta categoria'
            })
        }

        jugador.update({
            id_equipo: id_equipo
        })

        return res.status(200).json({
            message: 'Cambio de equipo exitoso'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al cambiar al jugador de equipo',
            error: error.message
        })
    }
}