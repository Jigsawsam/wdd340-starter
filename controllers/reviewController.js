const { body, validationResult } = require("express-validator")
const reviewModel = require('../models/reviewModel')
const utilities = require('../utilities')
const invModel = require('../models/inventory-model')

// Validation rules
const reviewValidationRules = [
  body("review_text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Review text cannot be empty."),
]

// Add a review
async function addReview(req, res) {
  const errors = validationResult(req)
  const { review_text, inv_id, account_id } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const vehicle = await invModel.getInventoryById(inv_id)
    const reviews = await reviewModel.getReviewsByInvId(inv_id)
    const detail = await utilities.buildVehicleDetail(vehicle[0])
    return res.render("inventory/detail", {
      title: `${vehicle[0].inv_year} ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      reviews,
      detail,
      vehicle: vehicle[0],
      accountData: res.locals.accountData,
      errors: errors.array(),
    })
  }

  try {
    await reviewModel.addReview(review_text, inv_id, account_id)
    req.flash("notice", "Review submitted successfully.")
  } catch {
    req.flash("notice", "Failed to submit review.")
  }
  res.redirect(`/inv/detail/${inv_id}`)
}

// Deliver edit review view
async function editReviewView(req, res) {
    const review_id = req.params.review_id
    const review = await reviewModel.getReviewById(review_id)
    const nav = await utilities.getNav()
    const vehicle = await invModel.getInventoryById(review.inv_id)
  
    res.render('review/edit-review', {
      title: `Edit Review for ${vehicle[0].inv_year} ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      review,
      vehicle: vehicle[0],
      errors: []
    })
}

// Validate rules
const editReviewValidationRules = [
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Review text cannot be empty."),
  ];

// Update review
async function updateReview(req, res) {
    const errors = validationResult(req);
    const { review_id, review_text } = req.body;
  
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      const data = await reviewModel.getReviewById(review_id);
      const vehicleData = await invModel.getInventoryById(data.inv_id);
      return res.render('review/edit-review', {
        title: "Edit Review",
        nav,
        review: data,
        vehicle: vehicleData[0],
        errors: errors.array()
      });
    }
  
    try {
      await reviewModel.updateReview(review_text, review_id);
      req.flash('notice', 'Review updated successfully.');
    } catch {
      req.flash('notice', 'Failed to update review.');
    }
  
    res.redirect("/account");
}

async function deleteReviewView(req, res) {
    const review_id = req.params.review_id
    const review = await reviewModel.getReviewById(review_id)
    const nav = await utilities.getNav()
    const vehicle = await invModel.getInventoryById(review.inv_id)
  
    res.render("review/delete-confirm", {
      title: `Delete Review for ${vehicle[0].inv_year} ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      review,
      vehicle: vehicle[0],
      errors: []
    })
}

// Delete review
async function deleteReview(req, res) {
  const review_id = req.body.review_id
  try {
    await reviewModel.deleteReview(review_id)
    req.flash('notice', 'Review deleted successfully.')
  } catch {
    req.flash('notice', 'Error deleting review.')
  }
  res.redirect("/account")
}

// Export
module.exports = {
  addReview,
  editReviewView,
  updateReview,
  deleteReviewView,
  deleteReview,
  reviewValidationRules,
  editReviewValidationRules,
}
