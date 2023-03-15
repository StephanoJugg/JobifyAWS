import { createJob, deleteJob, getAllJobs, updateJob, showStats } from '../controllers/jobsController';
import { Router } from 'express';

const router = Router();

router.route('/').post(createJob).get(getAllJobs);;
router.route('/:id').delete(deleteJob).patch(updateJob);
router.route('/stats').get(showStats);


export default router;