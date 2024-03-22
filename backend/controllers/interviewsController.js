const Interview = require('../models/Interview') 
const User = require('../models/User')
const asyncHandler = require('express-async-handler') 

// @desc Get all interviews
// @route GET /interviews
// @access Private
const getAllInterviews = asyncHandler(async (req, res) => {
    const interviews = await Interview.find().lean()

    if (!interviews?.length) {
        return res.status(400).json({ message: 'No interviews found' }) 
    }

    // Add username to each interview before sending the response 
    const interviewsWithUser = await Promise.all(interviews.map(async (interview) => {
        const user = await User.findById(interview.user).lean().exec()
        return { ...interview, username: user.username }
    }))

    res.json(interviewsWithUser)
}) 

// @desc Create new interview
// @route POST /interviews
// @access Private
const createNewInterview = asyncHandler(async (req, res) => {
    const { user, title, position, keySkills, experience, industry, company } = req.body 

    // Confirm data
    if (!user || !title|| !position || !Array.isArray(keySkills) || !keySkills.length) {
        return res.status(400).json({ message: 'All fields are required' }) 
    }

    // Check for duplicate
    const duplicate = await Interview.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate interview title' }) 
    }
    
    const interviewObject = { user, title, position, keySkills, experience, industry, company }

    // Create and store new interview
    const interview = await Interview.create(interviewObject) 
    if (interview) {
        res.status(201).json({ message: `New interview created` }) 
    } else {
        res.status(400).json({ message: 'Invalid interview data received' }) 
    } 
}) 

// @desc Update an interview
// @route PATCH /interviews
// @access Private
const updateInterview = asyncHandler(async (req, res) => {
    
    const { id, status, title, position, keySkills, experience, industry, company } = req.body 

    // Does the interview exist
    const interview = await Interview.findById(id).exec() 

    if (!interview) {
        return res.status(400).json({ message: 'Interview not found' }) 
    }

    // An interview cannot be updated if it is already started
    if (interview.status !== "Pending") {
        return res.status(400).json({ message: `${interview.status} interview cannot be modified` })
    }

    // Check for duplicate
    const duplicate = await Interview.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    // Allow updates to the original interview
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate interview title' }) 
    }

    // Confirm data
    if (!title|| !position || !Array.isArray(keySkills) || !keySkills.length || !status) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    interview.title = title
    interview.position = position
    interview.keySkills = keySkills 
    interview.status = status
    interview.experience = experience
    interview.industry = industry
    interview.company = company

    const updatedInterview = await interview.save() 

    res.json({ message: `${updatedInterview.title} updated` }) 
}) 

// @desc Delete new interview
// @route DELETE /interviews
// @access Private
const deleteInterview = asyncHandler(async (req, res) => {
    const { id } = req.body 

    if (!id) {
        return res.status(400).json({ message: 'Interview ID required' })
    }

    const interview = await Interview.findById(id).exec() 

    if (!interview) {
        return res.status(400).json({ message: 'Interview not found' }) 
    }

    // Store interview details for reply
    const { title, _id } = interview 

    // Delete the interview
    const result = await Interview.deleteOne({ _id }) 

    if (result.deletedCount !== 1) {
        return res.status(500).json({ message: 'Error deleting interview' }) 
    } else {
        res.json(`Interview ${title} with ID ${_id} deleted`) 
    }
}) 

module.exports = {
    getAllInterviews,
    createNewInterview,
    updateInterview,
    deleteInterview
} 
   