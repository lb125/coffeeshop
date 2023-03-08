/* script.js */

// Wait for the DOM to finish loading before adding event listeners
document.addEventListener("DOMContentLoaded", function() {

  //event listener for contact form (use if function so we don't get an error on other pages)
  if (document.getElementById("contactForm")) {
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function(event) {
    event.preventDefault();
    submitForm();
  });
  };

  //event listener for orders (use if function so we don't get an error on other pages)
  if (document.getElementById("submitOrder")) {
  const submitOrderButton = document.getElementById("submitOrder");
  submitOrderButton.addEventListener("click", function(event) {
    event.preventDefault();
    submitOrder();
  });
};

});

//Validate names with cloudmersive api
//api key 82bf1a1f-0dba-41d6-97c6-2084ec11b23b
//api url https://api.cloudmersive.com/validate/name/full-name
function submitForm() {
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const name = document.getElementById("name").value;

  // API validation for name
  const settings = {
    "url": "https://api.cloudmersive.com/validate/name/full-name",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json",
      "Apikey": "82bf1a1f-0dba-41d6-97c6-2084ec11b23b"
    },
    "data": JSON.stringify({
      "FullNameString": name
    })
  };

  $.ajax(settings).done(function (response) {
    console.log(response);

    const firstName = response.FirstName;
    const lastName = response.LastName;

    if (firstName && lastName) {
      console.log(`First name: ${firstName}, Last name: ${lastName}`);
    } else if (firstName && !lastName) {
      console.log(`First name: ${firstName}`);
    } else {
      console.log("Invalid name");
    }
  });

  // regex validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email");
    return;
  }

  console.log("Email: " + email);
  console.log("Message: " + message);
  alert("Your message has been sent!");
  document.getElementById("contactForm").reset();
}



// Function to submit the contact form
/*
function submitForm() {
  var email = document.getElementById("email").value;
  var name = document.getElementById("name").value;
  var message = document.getElementById("message").value;

  var nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/;
  var isValidName = nameRegex.test(name);

  var firstName, lastName;
  if (isValidName) {
    var nameParts = name.split(" ");
    firstName = nameParts[0];
    lastName = nameParts[nameParts.length - 1];
  } else {
    firstName = "Invalid";
    lastName = "Name";
  }

  console.log("Email: " + email);
  console.log("First Name: " + firstName);
  console.log("Last Name: " + lastName);
  console.log("Message: " + message);
    
  // Show success message
  alert("Message submitted successfully!");

  document.getElementById("contactForm").reset();
}


function submitForm() {
  // Get form elements
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  
  // Print values to console
  console.log("Email: " + email);
  console.log("Message: " + message);

   // Clear form fields
   document.getElementById("email").value = "";
   document.getElementById("message").value = "";

  // Show success message
  alert("Message submitted successfully!");
}
*/

//Orders
// Define item prices
const itemPrices = {
  item1: 3.00,
  item2: 4.50,
  item3: 4.50,
  item4: 4.50,
  item5: 3.00
};

// Define item array
let order = [];

//add items and call update
function addItem() {
  const dropdown = document.getElementById("menuDropdown");
  const selectedItem = dropdown.value;
  const selectedItemName = dropdown.options[dropdown.selectedIndex].text;
  const selectedItemPrice = itemPrices[selectedItem];
  const itemIndex = order.findIndex(item => item.name === selectedItemName);
  
  if (itemIndex > -1) {
    order[itemIndex].quantity += 1;
  } else {
    order.push({ name: selectedItemName, price: selectedItemPrice, quantity: 1 });
  }
  
  updateOrderSummary();
}

//update when we add items
function updateOrderSummary() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = " ";
  let totalPrice = 0;
  order.forEach(item => {
      const listItem = document.createElement("li");
      const itemName = document.createElement("span");
      itemName.textContent = item.quantity + " x " + item.name;
      const itemPrice = document.createElement("span");
      itemPrice.textContent = " $" + (item.price * item.quantity).toFixed(2);
      listItem.appendChild(itemName);
      listItem.appendChild(itemPrice);
      orderList.appendChild(listItem);
      totalPrice += item.price * item.quantity;
  });
  document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
}

//display current order
function displayOrderSummary() {
  let summary = "";
  let totalPrice = 0;
  let orderCount = new Map();

  order.forEach(item => {
    if (orderCount.has(item.name)) {
      orderCount.set(item.name, orderCount.get(item.name) + 1);
    } else {
      orderCount.set(item.name, 1);
    }
    totalPrice += item.price;
  });

  if (orderCount.size === 0) {
    summary = "No items added to order";
  } else {
    summary += "<ul>";
    for (let [itemName, quantity] of orderCount) {
      let itemTotalPrice = quantity * itemPrices[itemName];
      summary += `<li>${quantity} x ${itemName} - $${itemTotalPrice.toFixed(2)}</li>`;
    }
    summary += "</ul>";
    summary += `<p>Total: $${totalPrice.toFixed(2)}</p>`;
  }

  orderSummary.innerHTML = summary;
}

//submit and print to console
function submitOrder() {
  const totalPrice = document.getElementById("totalPrice").textContent;
  alert("Thank you for your order! Please be ready to pay $" + totalPrice + " upon arrival.");
  console.log(order);
}