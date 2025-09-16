// server/routes/reportRoutes.js
import express from 'express';
import { createReport, getReportByTrackNumber, updateReportStatus, getAllReports } from '../controller/reportController.js';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route to create a new report with file upload - now protected with auth
router.post('/', auth, upload, createReport);

// Route to fetch all reports
router.get('/all', getAllReports);

// Route to fetch a report by track number
router.get('/:trackNumber', getReportByTrackNumber);

// Route to update the status of a report by track number
router.put('/:trackNumber/status', updateReportStatus);

export { router };
