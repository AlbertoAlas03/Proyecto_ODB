import { Router } from 'express';
const router = Router();
//const dataController = require('../controllers/dataController');
import { getCategorias, addCategoria, updateCategoria, deleteCategoria } from '../controllers/CategoriaController.js';
import { getEquipos, addEquipo, updateEquipo, deleteEquipo } from '../controllers/EquipoController.js'
import {
    getJugadores,
    addJugador,
    updateJugador,
    deleteJugador,
    JugadorByID,
    JugadorByFullName,
    JugadorByEquipo,
    JugadorByCategoria,
    ChangeJugadorEquipo,
    updateFotoJugador,
    getFotoJugador,
    getJugadorParaEditar
} from '../controllers/JugadorController.js';
import {
    getOrientadores,
    addOrientador,
    updateOrientador,
    deleteOrientador,
    asignarOrientadorEquipo,
    removeOrientadorEquipo,
    getEquiposByOrientador,
    getOrientadoresByEquipo
} from '../controllers/OrientadorController.js'
import { getTorneos, addTorneo, updateTorneo } from '../controllers/TorneoController.js';
import {
    list_infracciones,
    list_infracciones_jugadores,
    asignar_infraccion_jugador,
    update_infraccion_jugador,
    delete_infraccion_jugador,
    list_infracciones_orientadores,
    asignar_infraccion_orientador,
    update_infraccion_orientador,
    delete_infraccion_orientador
} from '../controllers/InfraccionesController.js'
import Api_key from '../middlewares/Api_key.js';

//routes
//endpoint for test
router.get('/api/test', (req, res) => {
    const data = {
        "id": "1",
        "name": "API is working"
    }
    res.json(data);
});

//endpoints para jugadores
router.get('/api/list_jugadores', Api_key, getJugadores)
router.post('/api/add_jugador', Api_key, addJugador)
router.put('/api/update_jugador', Api_key, updateJugador)
router.put('/api/update_foto_jugador', Api_key, updateFotoJugador)
router.post('/api/get_foto_jugador', Api_key, getFotoJugador)
router.post('/api/get_jugador_editar', Api_key, getJugadorParaEditar)
router.delete('/api/delete_jugador', Api_key, deleteJugador)

//endpoint para cambio de equipo
router.post('/api/change_jugador_equipo', Api_key, ChangeJugadorEquipo)

//enpoints para buscar jugadores
router.post('/api/search_by_id_jugador', Api_key, JugadorByID)
router.post('/api/search_by_name_jugador', Api_key, JugadorByFullName)
router.post('/api/search_by_equipo_jugador', Api_key, JugadorByEquipo)
router.post('/api/search_by_categoria_equipo_jugador', Api_key, JugadorByCategoria)

//endpoints para categorias
router.get('/api/list_categorias', Api_key, getCategorias)
router.post('/api/add_categoria', Api_key, addCategoria)
router.put('/api/update_categoria', Api_key, updateCategoria)
router.delete('/api/delete_categoria', Api_key, deleteCategoria)

//endpoints para orientadores
router.get('/api/list_orientadores', Api_key, getOrientadores)
router.post('/api/add_orientador', Api_key, addOrientador)
router.put('/api/update_orientador', Api_key, updateOrientador)
router.delete('/api/delete_orientador', Api_key, deleteOrientador)

//endpoints para orientador-equipo
router.post('/api/asignar_orientador_equipo', Api_key, asignarOrientadorEquipo)
router.delete('/api/remove_orientador_equipo', Api_key, removeOrientadorEquipo)
router.post('/api/get_equipos_by_orientador', Api_key, getEquiposByOrientador)
router.post('/api/get_orientadores_by_equipo', Api_key, getOrientadoresByEquipo)

//endpoints para equipos
router.get('/api/list_equipos', Api_key, getEquipos);
router.post('/api/add_equipo', Api_key, addEquipo);
router.put('/api/update_equipo', Api_key, updateEquipo);
router.delete('/api/delete_equipo', Api_key, deleteEquipo);

//endpoints para torneos
router.get('/api/list_torneos', Api_key, getTorneos);
router.post('/api/add_torneo', Api_key, addTorneo);
router.put('/api/update_torneo', Api_key, updateTorneo);

//enpoints para infracciones
router.get('/api/list_infracciones', Api_key, list_infracciones);
router.get('/api/list_infracciones_jugadores', Api_key, list_infracciones_jugadores);
router.post('/api/asignar_infraccion', Api_key, asignar_infraccion_jugador);
router.put('/api/update_asignacion_infraccion_jugador', Api_key, update_infraccion_jugador);
router.delete('/api/delete_asignacion_infraccion_jugador', Api_key, delete_infraccion_jugador);

//endpoints para infracciones de orientadores
router.get('/api/list_infracciones_orientadores', Api_key, list_infracciones_orientadores);
router.post('/api/asignar_infraccion_orientador', Api_key, asignar_infraccion_orientador);
router.put('/api/update_asignacion_infraccion_orientador', Api_key, update_infraccion_orientador);
router.delete('/api/delete_asignacion_infraccion_orientador', Api_key, delete_infraccion_orientador);

export default router