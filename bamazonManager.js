var Inventory = require('./bamazon');

var ManagerSession = function() {
    this.inventory = new Inventory();
    this.inquirer = require("inquirer");

    this.getCommand = function() {
        that = this;
        this.inquirer
            .prompt(
                {
                name: "command",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale",
                          "View Low Inventory",
                          "Add to Inventory",
                          "Add New Product",
                          "End Session"]
                }
            )
            .then(function(answer) {
                switch(answer.command) {
                    case "View Products for Sale":
                        that.printProducts();
                        break;
                    case "View Low Inventory":
                        that.lowInv();
                        break;
                    case "Add to Inventory":
                        that.addInv();
                        break;
                    case "Add New Product":
                        that.addProduct();
                        break;
                    case "End Session":
                        that.endSession();
                }
            })
    };

    this.printProducts = function() {
        that = this;
        this.inventory.printManagerTable().then(function(table) {
            that.getCommand();
        });
    };

    this.lowInv = function() {
        that = this;
        this.inventory.getLowInventory().then(function(table) {
            that.getCommand();
        })
    };

    this.addInv = function() {
        var that = this;
        this.inventory.getItem_Ids().then(function(ids) {
            that.inquirer
                .prompt([
                    {
                        name: "item_id",
                        type: "input",
                        message: "Which item would you like to add inventory for?",
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
                        message: "How many would you like to add?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                            return true;
                            }
                            return false;
                        }
                    }
                ])
                .then(function(answer) {
                    that.inventory.adjustInventory(answer.item_id, answer.quantity, "+")
                    .then(function(done) {
                        that.getCommand();
                    });
                });
            });
    };

    this.addProduct = function() {
        that = this;
        this.inquirer
            .prompt([
                {
                    name: "product",
                    type: "input",
                    message: "What is the name of the product you'd like to add?"
                },
                {
                    name: "department",
                    type: "input",
                    message: "What department will sell this product"
                },
                {
                    name: "price",
                    type: "input",
                    message: "What price will the item sell for?"
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "What is the product quantity in stock?"
                }
            ])
            .then(function(answer) {
                that.inventory.addProduct(answer.product, answer.department, answer.price, answer.stock_quantity)
                    .then(function(done) {
                        that.getCommand();
                    });
                });      
    };

    this.endSession = function() {
        this.inventory.database.connectionEnd();
    };
};

module.exports = ManagerSession;