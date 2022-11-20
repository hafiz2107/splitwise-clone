const express = require('express')
const router = express.Router()
const controller = require('../controller/main_controller')

// Get Methods
router.get('/get-dashboard',controller.getDashboard)

// Post methods
router.post("/create-user",controller.createUser)
router.post("/get-user",controller.getUser)
router.post('/add-friends',controller.addFriends)
router.post('/add-individual-expenses',controller.createIndividualExpense)

// Lookups
router.post('/lookup',controller.lookup)


module.exports = router