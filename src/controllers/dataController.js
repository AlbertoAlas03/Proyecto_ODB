const config = require('../database/DB_connection');
const sql = require('mssql');

exports.list_equipo = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM equipo');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.list_jugadores = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM jugadores');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.list_orientadores = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM orientador');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.list_categorias = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM categorias');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.add_jugadores = async (req, res) => {


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
        bautizo, comunion,
        confirmacion,
        dui_jugador,
        activo,
        id_equipo
    } = req.body;




    try {
        const pool = await sql.connect(config);

        let iniciales;
        if (apellido1 && apellido2 && apellido2.trim() !== "") {
            iniciales = apellido1.charAt(0).toUpperCase() + apellido2.charAt(0).toUpperCase();
        } else {
            iniciales = apellido1.substring(0, 2).toUpperCase();
        }

        const fecha_inscripcion = new Date()

        const countResult = await pool.request()
            .input("iniciales", sql.VarChar, `J${iniciales}%`)
            .query("SELECT COUNT(*) as count FROM jugadores WHERE id_jugador LIKE @iniciales")
        const count = countResult.recordset[0].count + 1;
        const id_jugador = `J${iniciales}${count.toString().padStart(4, "0")}`;

        const result = await pool.request()
            .input("id_jugador", sql.Char, id_jugador)
            .input("nombre1", sql.VarChar, nombre1)
            .input("nombre2", sql.VarChar, nombre2)
            .input("apellido1", sql.VarChar, apellido1)
            .input("apellido2", sql.VarChar, apellido2)
            .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
            .input("genero", sql.VarChar, genero)
            .input("centro_estudio", sql.VarChar, centro_estudio)
            .input("direccion", sql.VarChar, direccion)
            .input("telefono_fijo", sql.VarChar, telefono_fijo)
            .input("telefono_movil", sql.VarChar, telefono_movil)
            .input("religion", sql.VarChar, religion)
            .input("foto_actual", sql.Image, foto_actual)
            .input("madre", sql.Bit, madre)
            .input("numero_partida", sql.VarChar, numero_partida)
            .input("numero_folio", sql.VarChar, numero_folio)
            .input("numero_libro", sql.VarChar, numero_libro)
            .input("año_partida", sql.Int, año_partida)
            .input("lugar_nacimiento", sql.VarChar, lugar_nacimiento)
            .input("nombre_madre", sql.VarChar, nombre_madre)
            .input("nombre_padre", sql.VarChar, nombre_padre)
            .input("correo", sql.VarChar, correo)
            .input("facebook", sql.VarChar, facebook)
            .input("asiste_iglesia", sql.Bit, asiste_iglesia)
            .input("grupo_familiar", sql.Int, grupo_familiar)
            .input("primera_dosis", sql.Bit, primera_dosis)
            .input("segunda_dosis", sql.Bit, segunda_dosis)
            .input("tercera_dosis", sql.Bit, tercera_dosis)
            .input("autorizacion_traslado", sql.Bit, autorizacion_traslado)
            .input("grado_estudio", sql.VarChar, grado_estudio)
            .input("turno_estudio", sql.VarChar, turno_estudio)
            .input("direccion_centro_estudio", sql.VarChar, direccion_centro_estudio)
            .input("bautizo", sql.Bit, bautizo)
            .input("comunion", sql.Bit, comunion)
            .input("confirmacion", sql.Bit, confirmacion)
            .input("dui_jugador", sql.VarChar, dui_jugador)
            .input("fecha_inscripcion", sql.Date, fecha_inscripcion)
            .input("activo", sql.Bit, activo)
            .input("id_equipo", sql.Char, id_equipo)
            .query("INSERT INTO jugadores (id_jugador, nombre1, nombre2, apellido1, apellido2, fecha_nacimiento, genero, centro_estudio, direccion, telefono_fijo, telefono_movil, religion, foto_actual, madre, numero_partida, numero_folio, numero_libro, año_partida, lugar_nacimiento, nombre_madre, nombre_padre, correo, facebook, asiste_iglesia, grupo_familiar, primera_dosis, segunda_dosis, tercera_dosis, autorizacion_traslado, grado_estudio, turno_estudio, direccion_centro_estudio, bautizo, comunion, confirmacion, dui_jugador, fecha_inscripcion, activo, id_equipo)"
                + "VALUES (@id_jugador, @nombre1, @nombre2, @apellido1, @apellido2, @fecha_nacimiento, @genero, @centro_estudio, @direccion, @telefono_fijo, @telefono_movil, @religion, @foto_actual, @madre, @numero_partida, @numero_folio, @numero_libro, @año_partida, @lugar_nacimiento, @nombre_madre, @nombre_padre, @correo, @facebook, @asiste_iglesia, @grupo_familiar, @primera_dosis, @segunda_dosis, @tercera_dosis, @autorizacion_traslado, @grado_estudio, @turno_estudio, @direccion_centro_estudio, @bautizo, @comunion, @confirmacion, @dui_jugador, @fecha_inscripcion, @activo, @id_equipo)");
        res.status(200).json({ message: "Jugador agregado exitosamente", id_jugador });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

exports.add_orientadores = async (req, res) => {
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
        lugar_trabajo,
    } = req.body;

    const fecha_inscripcion = new Date()

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("dui_orientador", sql.VarChar, dui_orientador)
            .input("nombre_orientador", sql.VarChar, nombre_orientador)
            .input("direccion_orientador", sql.VarChar, direccion_orientador)
            .input("telefono_fijo_orientador", sql.VarChar, telefono_fijo_orientador)
            .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
            .input("lugar_nacimiento", sql.VarChar, lugar_nacimiento)
            .input("nombre_madre", sql.VarChar, nombre_madre)
            .input("nombre_padre", sql.VarChar, nombre_padre)
            .input("nombre_espos@", sql.VarChar, nombre_esposo)
            .input("correo_electronico", sql.VarChar, correo_electronico)
            .input("facebook", sql.VarChar, facebook)
            .input("grupo_familiar", sql.Int, grupo_familiar)
            .input("religion", sql.VarChar, religion)
            .input("asiste_iglesia", sql.Bit, asiste_iglesia)
            .input("bautizo", sql.Bit, bautizo)
            .input("comunion", sql.Bit, comunion)
            .input("confirmacion", sql.Bit, confirmacion)
            .input("primera_dosis", sql.Bit, primera_dosis)
            .input("segunda_dosis", sql.Bit, segunda_dosis)
            .input("tercera_dosis", sql.Bit, tercera_dosis)
            .input("estudios_academicos", sql.VarChar, estudios_academicos)
            .input("otros_estudios", sql.VarChar, otros_estudios)
            .input("lugar_trabajo", sql.VarChar, lugar_trabajo)
            .input("fecha_inscripcion", sql.Date, fecha_inscripcion)
            .query("INSERT INTO orientador (dui_orientador, nombre_orientador, direccion_orientador, telefono_fijo_orientador, fecha_nacimiento, lugar_nacimiento, nombre_madre, nombre_padre, nombre_espos@, correo_electronico, facebook, grupo_familiar, religion, asiste_iglesia, bautizo, comunion, confirmacion, primera_dosis, segunda_dosis, tercera_dosis, estudios_academicos, otros_estudios, lugar_trabajo, fecha_inscripcion)"
                + "VALUES (@dui_orientador, @nombre_orientador, @direccion_orientador, @telefono_fijo_orientador, @fecha_nacimiento, @lugar_nacimiento, @nombre_madre, @nombre_padre, @nombre_espos@, @correo_electronico, @facebook, @grupo_familiar, @religion, @asiste_iglesia, @bautizo, @comunion, @confirmacion, @primera_dosis, @segunda_dosis, @tercera_dosis, @estudios_academicos, @otros_estudios, @lugar_trabajo, @fecha_inscripcion)");
        res.status(200).json({ message: "Orientador agregado exitosamente" });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

