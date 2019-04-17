// this js will store almost all of the application process
// Need to require mysql and inquirer  ==  DONE
// Set connection to the database that I created (products) == Done
// in the products db- there are 10 random items, department, price and qty ==DONE
// check the connection to products db in js and console once successful ==  done
// console the table of the items once successfully connected == DONE
// Create a prompt for the user
  // what to purchase == DONE
  // how many to purchase == DONE





var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "18@Glendale",
  database: "bamazon"
})

//connection to the db and display in console 
connection.connect(function (err) {
  if (err) throw err;
  console.log("You are connected");
  productTable();
})

//var for the product table that was created in mysql.  With this function the product table will display in console log
var productTable = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].itemid + " || " + res[i].productname + " || " + res[i].departmentname + " || " + res[i].price + " || " + res[i].stockquanity + "\n");
    }
    //this is to call the var to prompt the user after the product table is loaded
    promptUser(res);
  })
}

//user prompts-  this is asking what product the user wants to buy or giving them an option to quit, once a verified product is selected the user is prompted to enter desired amount 
var promptUser = function (res) {
  inquirer.prompt([{
    type: 'input',
    name: 'choice',
    message: "What would you like to purchase? [Quit with Q]"
  }]).then(function (answer) {
    var correct = false;
    //If the user select q then the applicaiton will stop
    if (answer.choice.toUpperCase() === "Q")
      process.exit();
    for (var i = 0; i < res.length; i++) {
      if (res[i].productname === answer.choice) {
        correct = true;
        var product = answer.choice;
        var id = i;
        inquirer.prompt({
          type: "input",
          name: "qty",
          message: "How many would you like to buy?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
          //This function will check the qty of the product and make sure there is enough in stock.  If there is not the user will get a message that the qty is invalid
        }).then(function (answer) {
          if ((res[id].stockquanity - answer.qty) > 0) {
            connection.query("UPDATE products SET stockquanity= '" + (res[id].stockquanity - answer.qty) + "' Where productname='" + product + "'", function (err, res2) {
              console.log("product bought!");
              productTable();
            })
          } else {
            console.log("Not a valid selection!");
            promptUser(res);
          }
        })
      }
    }

    //This if statement will check to make sure the product selection is valid -  if it is not the prompt will display again to the user
    if (i == res.length && correct == false) {
      console.log("Not a valid selection!");
      promptUser(res);
    }
  })
}