import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from '../controllers/jobsController';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router
  .route('/')
  .post(authMiddleware, createJob)
  .get(authMiddleware, getAllJobs);
router
  .route('/:id')
  .delete(authMiddleware, deleteJob)
  .patch(authMiddleware, updateJob);
router.route('/stats').get(authMiddleware, showStats);

export default router;
