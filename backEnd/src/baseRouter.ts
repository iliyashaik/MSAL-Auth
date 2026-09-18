import { Router } from 'express';
import { AuthRequest, validateToken } from './verifyToken';

const baseRouter = Router();
console.log('Base router initialized');
baseRouter.use('/verifyToken', validateToken, (req: AuthRequest, res) => {

    res.json({
        message: "You successfully accessed the protected API",
        user: req.user?.preferred_username
    });
});

baseRouter.get("/health", (req, res) => {
  res.json({
    status: "UP"
  });
});

export { baseRouter };
