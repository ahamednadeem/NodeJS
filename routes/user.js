const express = require('express');
const app = express();
app.use(express.json())

const router = express.Router();
const userController = require('../controllers/userController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

// Routes
router.get('/', authenticationMiddleware.validateToken, userController.view);
router.get('/find', authenticationMiddleware.validateToken, userController.find);
router.post('/add', authenticationMiddleware.validateToken, userController.create);
router.put('/edit/:id', authenticationMiddleware.validateToken, userController.update);
router.get('/view/:id', authenticationMiddleware.validateToken, userController.viewById);
router.delete('/:id',authenticationMiddleware.validateToken, userController.delete);


router.post('/auth', authenticationMiddleware.authenticate);
router.post('/login', authenticationMiddleware.login);

module.exports = router;