const pool = require('../database/')

// Add a new review
async function addReview(review_text, inv_id, account_id) {
  const sql = `
    INSERT INTO review (review_text, inv_id, account_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `
  return pool.query(sql, [review_text, inv_id, account_id])
}

// Get reviews by inventory ID
async function getReviewsByInvId(inv_id) {
  const sql = `
    SELECT r.review_id, r.review_text, r.review_date,
           a.account_firstname, a.account_lastname
    FROM review r
    JOIN account a ON r.account_id = a.account_id
    WHERE r.inv_id = $1
    ORDER BY r.review_date DESC;
  `
  const result = await pool.query(sql, [inv_id])
  return result.rows
}

// Get reviews by account ID
async function getReviewsByAccountId(account_id) {
  const sql = `
  SELECT r.review_id, r.review_text, r.review_date,
         i.inv_make, i.inv_model, i.inv_year, i.inv_id
  FROM review r
  JOIN inventory i ON r.inv_id = i.inv_id
  WHERE r.account_id = $1
  ORDER BY r.review_date DESC
`
  const result = await pool.query(sql, [account_id])
  return result.rows
}

// Get a single review
async function getReviewById(review_id) {
  const sql = `SELECT * FROM review WHERE review_id = $1`
  const result = await pool.query(sql, [review_id])
  return result.rows[0]
}

// Update review
async function updateReview(review_text, review_id) {
  const sql = `
    UPDATE review
    SET review_text = $1, review_date = NOW()
    WHERE review_id = $2
  `
  return pool.query(sql, [review_text, review_id])
}

// Delete review
async function deleteReview(review_id) {
  const sql = `DELETE FROM review WHERE review_id = $1`
  return pool.query(sql, [review_id])
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview
}
