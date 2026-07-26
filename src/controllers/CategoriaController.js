import Categoria from "../models/Categoria.js";

export const getCategorias = async (req, res, next) => {
    try {
        const categorias = await Categoria.findAll();
        if (categorias.length === 0) {
            return res.status(404).json({
                message: 'No hay categorias registradas'
            })
        }
        return res.status(200).json({
            message: "Categorias registradas",
            categorias: categorias
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las categorias'
        });
    }
};

export const addCategoria = async (req, res, next) => {
    try {

        const { nombre, edadmax, edadmin } = req.body;

        if (!nombre) {
            return res.status(400).json({
                message: 'el codigo de la categoria y el nombre son campos obligatorios, por favor verifique'
            })
        }

        if (edadmax != null && edadmin != null && edadmax < edadmin) {
            return res.status(400).json({
                message: 'La edad maxima debe ser mayor a la edad minima permitida, por favor verifique'
            })
        }

        const lastCategoria = await Categoria.findOne({
            order: [['id_categoria', 'DESC']]
        });

        let nextNumber = 1;

        if (lastCategoria) {
            const lastId = lastCategoria.id_categoria;
            const num = parseInt(lastId.slice(1));
            nextNumber = num + 1;
        }

        const id_categoria = `C${nextNumber.toString().padStart(3, "0")}`;

        await Categoria.create({
            id_categoria: id_categoria,
            nombre: nombre,
            edadmax: edadmax,
            edadmin: edadmin
        })

        return res.status(201).json({
            message: 'Categoria registrada con exito'
        })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Ya existe una categoría con ese identificador, intente de nuevo'
            })
        }
        return res.status(500).json({
            message: 'Error al agregar la categoria',
            error: error.message
        })
    }
}

export const updateCategoria = async (req, res, next) => {
    try {
        const { id_categoria, nombre, edadmax, edadmin, estado } = req.body

        if (!nombre || !id_categoria) {
            return res.status(400).json({
                message: 'El id y nombre de la categoria son campos obligatorios, por favor verifique'
            })
        }

        if (edadmax != null && edadmin != null && edadmax < edadmin) {
            return res.status(400).json({
                message: 'La edad maxima debe ser mayor a la edad minima permitida, por favor verifique'
            })
        }

        const categoria = await Categoria.findOne({
            where: {
                id_categoria: id_categoria
            }
        })

        if (!categoria) {
            return res.status(404).json({
                message: 'Esta categoria no esta registrada, por favor verifique'
            })
        }

        await categoria.update({
            nombre: nombre,
            edadmax: edadmax,
            edadmin: edadmin,
            estado: estado
        })

        return res.status(200).json({
            message: 'Categoria actualizada con exito'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar la categoria',
            error: error.message
        })
    }
}

export const deleteCategoria = async (req, res, next) => {
    try {
        const { id_categoria } = req.body

        if (!id_categoria) {
            return res.status(400).json({
                message: 'El id de la categoria es obligatorio, por favor verifique'
            })
        }

        const categoria = await Categoria.findOne({
            where: {
                id_categoria: id_categoria
            }
        })

        if (!categoria) {
            return res.status(404).json({
                message: 'Esta categoria no esta registrada, por favor verifique'
            })
        }

        await categoria.destroy()

        return res.status(200).json({
            message: 'Categoria eliminada con exito'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar la categoria',
            error: error.message
        })
    }
}