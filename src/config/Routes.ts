import { Router } from 'express';
const router = Router();

import {
    IndexController,
    RateController,
    RulesController,
} from '@controllers';


router.get('/health', IndexController.getHealth);

router.post('/rules', RulesController.postRule);
router.post('/rate', RateController.postRate);

export default router;
