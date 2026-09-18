import { Router } from 'express';
import { validateToken } from './verifyToken';

const baseRouter = Router();

baseRouter.use('/verifyToken', validateToken);

export default baseRouter;