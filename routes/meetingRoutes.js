import { Router } from 'express';
import { cancelMeeting, createBooking, getMeetings, getSlots } from '../controllers/meetingController.js';

const router = Router();
router.get('/slots', getSlots);
router.post('/bookings', createBooking);
router.get('/bookings', getMeetings);
router.delete('/bookings/:id', cancelMeeting);

export default router;
