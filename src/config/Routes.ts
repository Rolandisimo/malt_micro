import { Router } from 'express';
const router = Router();

import { IndexController } from '@controllers';


router.get('/health', IndexController.getHealth);

export default router;
