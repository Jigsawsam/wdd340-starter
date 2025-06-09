const accountModel = require("../models/account-model")

const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists) {
            throw new Error("Email exists. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* **********************************
 *  Login Data Validation Rules ***---?
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
          throw new Error("Email does not exist. Please correct or use a different email.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}

/* ******************************
 * Check login data and return errors or continue ***---?
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * check update account
 * ***************************** */
validate.updateRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("Please provide a first name."),
    body("account_lastname").trim().notEmpty().withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
  ]
}

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({ minLength: 12 })
      .withMessage("Password must be at least 12 characters and contain a number, special character, uppercase and lowercase letter.")
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const account_id = req.body.account_id
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/update", {
      title: "Edit Account",
      nav: await utilities.getNav(),
      errors,
      accountData,
    })
  }
  next()
}

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const account_id = req.body.account_id
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/update", {
      title: "Edit Account",
      nav: await utilities.getNav(),
      errors,
      accountData,
    })
  }
  next()
}

module.exports = validate