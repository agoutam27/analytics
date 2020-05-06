import express from 'express';
import { AnalyticsController } from '../controllers';

let router = express.Router();

router
 .post('/operations/analytics', AnalyticsController.analysis);

export default router;