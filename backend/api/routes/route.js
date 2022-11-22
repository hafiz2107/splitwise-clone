const express = require('express')
const router = express.Router()
const controller = require('../controller/main_controller')

// Get Methods
router.get('/get-dashboard',controller.getDashboard)
router.get('/get-transactions',controller.getTransaction)

// Post methods
router.post("/create-user",controller.createUser)
router.post("/get-user",controller.getUser)
router.post('/add-friends',controller.addFriends)
router.post('/add-individual-expenses',controller.createIndividualExpense)
router.post('/add-group-expenses',controller.createGroupExpense)

// Lookups
router.post('/lookup',controller.lookup)


module.exports = router