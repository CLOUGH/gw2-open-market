
import { Router, Request, Response } from 'express';
import { itemRouter } from './item.router';

const router = Router();

router.get('/health-check', (req, res) =>
  res.json({
    health: 'ok'
  })
);

router.use('/items', itemRouter);

router.get('**', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the GW2 Open Market API'
  });
});


export { router };
