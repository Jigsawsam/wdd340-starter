const { body, validationResult } = require("express-validator")
const utilities = require("./index")
const validate = {}



/*  **********************************
 *  classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Classification name must not be empty and contain no special characters.")
  ]
}

/*  **********************************
 *  inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
      body("classification_id")
          .isInt()
          .withMessage("Classification is required."),

      body("inv_make")
          .trim()
          .notEmpty()
          .withMessage("Make is required."),

      body("inv_model")
          .trim()
          .notEmpty()
          .withMessage("Model is required."),

      body("inv_year")
          .isInt({ min: 1900 })
          .withMessage("Valid year is required."),

      body("inv_description")
          .trim()
          .notEmpty()
          .withMessage("Description is required."),

      body("inv_image")
          .trim()
          .notEmpty()
          .withMessage("Image path is required."),

      body("inv_thumbnail")
          .trim()
          .notEmpty()
          .withMessage("Thumbnail path is required."),

      body("inv_price")
          .isFloat({ min: 0 })
          .withMessage("Price must be a positive number."),

      body("inv_miles")
          .isInt({ min: 0 })
          .withMessage("Miles must be a positive integer."),

      body("inv_color")
          .trim()
          .notEmpty()
          .withMessage("Color is required.")
    ]
}


/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  let nav = await require("../utilities").getNav()

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name
    })
  }
  next()
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      } = req.body
  
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(
        parseInt(classification_id)
      )
  
      return res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors,             
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      })
    }
    next()
}

/* ******************************
 * Check inventory data and redirect errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    } = req.body

    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      parseInt(classification_id)
    )

    return res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      errors,             
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    })
  }
  next()
}

module.exports = validate