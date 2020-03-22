import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import DestController from './app/controllers/DestController';
import FileController from './app/controllers/FileController';
import SignaturesController from './app/controllers/SignaturesController';

import DeliveriesController from './app/controllers/DeliveriesController';
import OrdersController from './app/controllers/OrdersController';
import ProblemsController from './app/controllers/ProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/login', LoginController.store);
routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.post('/dest', DestController.store);
routes.put('/dest', DestController.update);
routes.post('/deliveries', DeliveriesController.store);
routes.put('/deliveries', DeliveriesController.update);
routes.get('/deliveries', DeliveriesController.index);
routes.delete('/deliveries', DeliveriesController.delete);
routes.post('/orders', OrdersController.store);
routes.get('/orders/:id', OrdersController.index);
routes.put('/orders', OrdersController.update);
routes.delete('/orders', OrdersController.delete);
routes.post('/problems/:id', ProblemsController.store);
routes.get('/problems/:id', ProblemsController.index);
routes.delete('/problems/:id', ProblemsController.delete);

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/signatures', upload.single('file'), SignaturesController.store);
export default routes;
