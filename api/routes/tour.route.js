import express from 'express';
import { getDataWithEmptyLabels, getNumberDataWithEmptyLabels, getTour, updateInJunk, updateTour, searchTour, getGroupMapper, deleteTour } from '../controllers/tour.controller.js';
import { isAdmin, verifyToken } from '../utils/verifyUsers.js';


const router = express.Router();

router.get('/get_n_new_tour', getNumberDataWithEmptyLabels);
router.get('/get_new_tour', verifyToken, getDataWithEmptyLabels);
router.get('/get_tour/:id', verifyToken, getTour);
router.patch('/update_in_junk/:id', verifyToken, isAdmin, updateInJunk);
router.patch('/update_tour/:id', verifyToken, isAdmin, updateTour);
router.get('/search_tour/', verifyToken, searchTour);
router.get('/get_group_mapper/', getGroupMapper)
router.delete('/delete_tour/:id', verifyToken, isAdmin, deleteTour);

export default router;