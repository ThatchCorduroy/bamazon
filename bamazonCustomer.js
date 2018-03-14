var Inventory = require('./bamazon');

var OrderSession = function() {
    this.inventory = new Inventory();
    this.inquirer = require("inquirer");

    this.printProducts = function() {
        this.inventory.printCustomerTable();
    }

    this.getOrder = function() {
        var that = this;
        this.inventory.getItem_Ids().then(function(ids) {
            that.inquirer
                .prompt([
                    {
                        name: "item_id",
                        type: "input",
                        message: "What is the ID of the product you would like to buy?",
                        validate: function(value) {
                            if (ids.includes(parseInt(value))) {
                                return true;
                            }

                            return false;
                        }
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many would you like to purchase",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                            return true;
                            }
                            return false;
                        }
                    }
                ])
                .then(function(answer) {
                    that.inventory.checkInventory(answer.item_id, answer.quantity)
                    .then(function(enough) {
                        if (enough) {
                            that.inventory.adjustInventory(answer.item_id, answer.quantity, "-")
                            .then(function () {
                                console.log("CONGRATULATIONS YOUR ORDER WAS PLACED")
                                that.inventory.getItemPrice(answer.item_id).then(function(price) {
                                    var total = price * answer.quantity;
                                    
                                    that.inventory.addSale(answer.item_id, total);
                                    console.log("YOUR TOTAL IS ", total);
                                    that.continueShop();
                                });
                            });
                        } else {
                            console.log("I'M SORRY WE'RE OUT OF STOCK :(")
                            that.continueShop();
                        }
                        
                    });
                });
        })
    }

    this.calculateTotal = function (item_id, quantity) {
        this.inventory.getItemPrice(item_id).then(function(price) {
            return quantity * price;
        })
    }

    this.continueShop = function() {
        var that = this;
        this.inquirer
            .prompt(
                {
                    name: "continue",
                    type: "list",
                    message: "Would you like to continue shopping?",
                    choices: ["Yes", "No"]
                }
            )
            .then(function(answer) {
                if (answer.continue === "Yes") {
                    that.printProducts();
                    that.getOrder();
                } else {
                    that.orderComplete();
                    console.log("Thank you for shopping, please come again!")
                }
            })
    }

    this.orderComplete = function() {
        this.inventory.database.connectionEnd();
    }
};

module.exports = OrderSession;