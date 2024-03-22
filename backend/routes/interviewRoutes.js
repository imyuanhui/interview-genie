const express = require('express');
const router = express.Router();
const interviewsController = require('../controllers/interviewsController');

router.route('/')
    .get(interviewsController.getAllInterviews)
    .post(interviewsController.createNewInterview)
    .patch(interviewsController.updateInterview)
    .delete(interviewsController.deleteInterview);

module.exports = router;