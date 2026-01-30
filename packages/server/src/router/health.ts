import express from 'express';

import { getHealthStatus } from '../middleware/health';

import type { Router } from 'express';

export const healthRoutes: Router = express.Router();

healthRoutes.get('/', getHealthStatus);
