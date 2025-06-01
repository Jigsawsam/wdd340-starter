const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  build inventory item detail view ;;
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryById(invId);
  const detail = await utilities.buildVehicleDetail(data[0]);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail
  });
}

/* ****************************************
*  build inventory management View
* *************************************** */
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  build invventory add-classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process add-classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash("notice", `Successfully added ${classification_name} classification.`)
    nav = await utilities.getNav() 
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  build add-inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
*  Process add-inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(parseInt(req.body.classification_id))

  const {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body

  const addResult = await invModel.addInventory({
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  })

  if (addResult) {
    req.flash("notice", `Successfully added ${inv_make} ${inv_model} to inventory.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add inventory.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body
    })
  }
}

module.exports = invCont