// Cálculo de jornadas y suspensiones sin persistir nada en la base.
//
// La jornada no existe como tabla: se deriva aritméticamente de torneo.fecha_inicio
// asumiendo una cadencia fija (por defecto semanal). La jornada 1 es la semana que
// arranca el día de inicio del torneo.
//
// Todas las fechas se normalizan a mediodía UTC antes de operar. Es deliberado: un
// corrimiento de zona horaria de pocas horas movería el día, y un día de corrimiento
// en el borde de la semana cambia la jornada.

const MS_POR_DIA = 86400000;

export const DIAS_POR_JORNADA = Number(process.env.DIAS_POR_JORNADA) || 7;

// Acepta un Date (como lo devuelve Sequelize para columnas DATE) o un string
// 'YYYY-MM-DD' (como lo devuelve para DATEONLY). Ambos caen en el mismo instante.
export const aUTC = (fecha) => {
    if (fecha instanceof Date) {
        return Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), 12);
    }

    const [anio, mes, dia] = String(fecha).slice(0, 10).split('-').map(Number);

    if (!anio || !mes || !dia) return NaN;

    return Date.UTC(anio, mes - 1, dia, 12);
};

// 'YYYY-MM-DD' a partir de un Date, leyendo la fecha local y no la UTC.
// Para "hoy" importa: a las 20:00 en El Salvador ya es el día siguiente en UTC.
export const aISOLocal = (fecha = new Date()) => {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${fecha.getFullYear()}-${mes}-${dia}`;
};

const aISOUTC = (ms) => new Date(ms).toISOString().slice(0, 10);

export const diffDias = (desde, hasta) => Math.round((aUTC(hasta) - aUTC(desde)) / MS_POR_DIA);

// Número de jornada al que pertenece una fecha. Puede dar <= 0 si la fecha es
// anterior al inicio del torneo; el llamador decide si eso es válido.
export const jornadaDeFecha = (fechaInicio, fecha) =>
    Math.floor(diffDias(fechaInicio, fecha) / DIAS_POR_JORNADA) + 1;

export const totalJornadas = (torneo) =>
    jornadaDeFecha(torneo.fecha_inicio, torneo.fecha_cierre);

// Jornada en curso, acotada al rango del torneo: antes de que empiece es la 1,
// después de que termina es la última.
export const jornadaActual = (torneo, hoy = new Date()) => {
    const cruda = jornadaDeFecha(torneo.fecha_inicio, aISOLocal(hoy));

    return Math.min(Math.max(cruda, 1), totalJornadas(torneo));
};

export const esJornadaValida = (torneo, numero) =>
    Number.isInteger(numero) && numero >= 1 && numero <= totalJornadas(torneo);

// Rango de fechas que cubre una jornada.
export const rangoDeJornada = (torneo, numero) => {
    const inicio = aUTC(torneo.fecha_inicio) + (numero - 1) * DIAS_POR_JORNADA * MS_POR_DIA;

    return {
        fecha_inicio: aISOUTC(inicio),
        fecha_fin: aISOUTC(inicio + (DIAS_POR_JORNADA - 1) * MS_POR_DIA)
    };
};

export const calendarioDe = (torneo) =>
    Array.from({ length: totalJornadas(torneo) }, (_, i) => ({
        numero: i + 1,
        ...rangoDeJornada(torneo, i + 1)
    }));

// Jornadas de suspensión que le quedan por cumplir a una infracción.
//
// Una infracción de N fechas recibida en la jornada J cubre las jornadas J+1 .. J+N.
// Estando en la jornada actual A, quedan pendientes las que todavía no pasaron.
// Ejemplo (N=2, J=5): en J5 debe 2, en J6 debe 2, en J7 debe 1, de J8 en adelante 0.
export const pendientesDe = (jornadaInfraccion, cantidadFechas, jornadaActualNumero) => {
    const N = Number(cantidadFechas) || 0;

    if (N <= 0) return 0;

    return Math.max(0, Math.min(N, jornadaInfraccion + N - jornadaActualNumero + 1));
};
