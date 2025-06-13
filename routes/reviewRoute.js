const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const utilities = require('../utilities')

router.post('/add', utilities.checkLogin, reviewController.reviewValidationRules, reviewController.addReview)
router.get('/edit/:review_id', utilities.checkLogin, reviewController.editReviewView)
router.post('/update', utilities.checkLogin, reviewController.editReviewValidationRules, reviewController.updateReview)
router.get('/delete/:review_id', utilities.checkLogin, reviewController.deleteReviewView)
router.post("/delete", utilities.checkLogin, reviewController.deleteReview)

module.exports = router