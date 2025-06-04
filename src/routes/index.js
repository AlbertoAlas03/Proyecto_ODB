const { Router } = require('express');
const router = Router();
//const dataController = require('../controllers/dataController');
const JugadorController = require('../controllers/JugadorController')
const CategoriaController = require('../controllers/CategoriaController')
const OrientadorController = require('../controllers/OrientadorController')
const EquipoController = require('../controllers/EquipoController')
const { Api_key } = require('../middlewares/Api_key');

//routes
//endpoint for test
router.get('/api/test', (req, res) => {
    const data = {
        "id": "1",
        "name": "API is working"
    }
    res.json(data);
});

//endpoints for data
//endpoint for list all data
// router.get('/api/list_jugadores', dataController.list_jugadores);
//router.get('/api/list_orientadores', dataController.list_orientadores);
//router.get('/api/list_equipo', dataController.list_equipo)
//router.get('/api/list_categorias', dataController.list_categorias)

//router.post('/api/add_jugadores', dataController.add_jugadores);
//router.post('/api/add_orientadores', dataController.add_orientadores);

// router.get('/api/prueba', Api_key, (request, response) => {
//     response.send({
//         'success': true,
//         'message': 'Estas en la ruta protegida'
//     })
// });

//endpoints para jugadores
router.get('/api/list_jugadores', Api_key, JugadorController.getJugadores)
router.post('/api/add_jugador', Api_key, JugadorController.addJugador)
router.put('/api/update_jugador', Api_key, JugadorController.updateJugador)
router.delete('/api/delete_jugador', Api_key, JugadorController.deleteJugador)

//endpoint para cambio de equipo
router.post('/api/change_jugador_equipo', JugadorController.ChangeJugadorEquipo)

//enpoints para buscar jugadores
router.post('/api/search_by_id_jugador', Api_key, JugadorController.JugadorByID)
router.post('/api/search_by_name_jugador', Api_key, JugadorController.JugadorByFullName)
router.post('/api/search_by_equipo_jugador', Api_key, JugadorController.JugadorByEquipo)
router.post('/api/search_by_categoria_equipo_jugador', Api_key, JugadorController.JugadorByCategoria)

//endpoints para categorias
router.get('/api/list_categorias', Api_key, CategoriaController.getCategorias)
router.post('/api/add_categoria', Api_key, CategoriaController.addCategoria)
router.put('/api/update_categoria', Api_key, CategoriaController.updateCategoria)
router.delete('/api/delete_categoria', Api_key, CategoriaController.deleteCategoria)

//endpoints para orientadores
router.get('/api/list_orientadores', Api_key, OrientadorController.getOrientadores)
router.post('/api/add_orientador', Api_key, OrientadorController.addOrientador)
router.put('/api/update_orientador', Api_key, OrientadorController.updateOrientador)
router.delete('/api/delete_orientador', Api_key, OrientadorController.deleteOrientador)

//endpoints para equipos
router.get('/api/list_equipos', Api_key, EquipoController.getEquipos);
router.post('/api/add_equipo', Api_key, EquipoController.addEquipo);
router.put('/api/update_equipo', Api_key, EquipoController.updateEquipo);
router.delete('/api/delete_equipo', Api_key, EquipoController.deleteEquipo);

module.exports = router;