var Inventory = require('./bamazon');

var SupervisorSession = function() {
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
                choices: ["View Product Sales by Department",
                          "Create New Department",
                          "End Session"]
                }
            )
            .then(function(answer) {
                switch(answer.command) {
                    case "View Product Sales by Department":
                        that.printTable();
                        break;
                    case "Create New Department":
                        that.addDepartment();
                        break;
                    case "End Session":
                        that.endSession();
                }
            })
    }
    
    this.printTable = function() {
        that = this;
        this.inventory.printSupervisorTable().then(function(table) {
            that.getCommand();
        });
    };

    this.addDepartment = function() {
        that = this;
        this.inquirer
            .prompt([
                {
                    name: "department",
                    type: "input",
                    message: "What is the name of the department you'd like to add?"
                },
                {
                    name: "over_head_costs",
                    type: "input",
                    message: "What are the over_head_costs for this department?"
                }
            ])
            .then(function(answer) {
                that.inventory.addDepartment(answer.department, answer.over_head_costs)
                    .then(function(done) {
                        that.getCommand();
                    });
                });      
    };

    this.endSession = function() {
        this.inventory.database.connectionEnd();
    };
};

module.exports = SupervisorSession;