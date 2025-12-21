import express from 'express';
import type { Router } from 'express';

import { getHealthStatus } from '../middleware/health';

export const healthRoutes: Router = express.Router();

healthRoutes.get('/', getHealthStatus);
