import { Router } from 'express';

const router = Router();


router.get('/status', (req, res) => {
  res.json({ statusOK: 'true' });
});

export default router;
