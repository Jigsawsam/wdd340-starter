// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view ;;
router.get("/detail/:invId", invController.buildByInventoryId);

// Route for inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to deliver classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to deliver add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to get inventory by classification id (AJAX)
router.get(
    "/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON))

// Route to display the edit inventory item view
router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invController.editInventoryView))

// Display the delete confirmation view
  router.get(
    "/delete/:inv_id",
    utilities.handleErrors(invController.buildDeleteInventoryView))

// Process add-classification form
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Process add-inventory form
router.post(
    "/add-inventory", 
    invValidate.inventoryRules(), 
    invValidate.checkInventoryData, 
    utilities.handleErrors(invController.addInventory)
)

// handle update form
router.post(
    "/update/", 
    invValidate.inventoryRules(), 
    invValidate.checkUpdateData,
    invController.updateInventory)

// handle the delete POST request
router.post(
    "/delete/",
    invController.deleteInventory)

module.exports = router;