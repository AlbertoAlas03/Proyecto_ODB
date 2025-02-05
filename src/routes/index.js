const { Router } = require('express');
const router = Router();
const dataController = require('../controllers/dataController');

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
router.get('/api/list_jugadores', dataController.list_jugadores);
router.get('/api/list_orientadores', dataController.list_orientadores);
router.post('/api/add_jugadores', dataController.add_jugadores);
router.post('/api/add_orientadores', dataController.add_orientadores);

module.exports = router;