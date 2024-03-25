const express = require('express');
const router = express.Router();
const interviewsController = require('../controllers/interviewsController');
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(interviewsController.getAllInterviews)
    .post(interviewsController.createNewInterview)
    .patch(interviewsController.updateInterview)
    .delete(interviewsController.deleteInterview)

module.exports = router;