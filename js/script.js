
// this Object will store the data, which will help to generate the HTML using Js
let services = [
  {id: 1, list_icon: "fa-solid fa-vest", name: "Dry Cleaning", price: 200.0},
  {id: 2, list_icon: "fa-solid fa-hands-bubbles", name: "Wash & Fold", price: 100.0},
  {id: 3, list_icon: "fa-solid fa-shirt", name: "Ironing",price: 30.0},
  {id: 4, list_icon: "fa-solid fa-fill-drip", name: "Stain Removal",  price: 500.0},
  {id: 5, list_icon: "fa-solid fa-soap", name: "Leather & Suede Cleaning",price: 999.0},
  {id: 6, list_icon: "fa-solid fa-person-dress", name: "Wedding Dress Cleaning", price: 2800.0}
];

//empty cart to store the item which will be added by the user
let cart = [];


//this function will add the services html.
function generateServicesList() {
  const servicesList = document.getElementById("services-list-js");

  let servicesListHtml = "";

  //here passing ID also to recognise which item to add and remove
  services.forEach((service) => {
    servicesListHtml += `
            <div class="list-item">
            <div class="item-details">
              <p><i class="${service.list_icon}"></i> ${service.name}</p>
              <span>• &nbsp; ₹${service.price}</span>
            </div>

            <button type="button" class="services-list-add-btn" id="addbtn${service.id}" onclick="handleCart(${service.id})">
              Add Item <i class="fa-solid fa-circle-plus"></i>
            </button>
          </div>
        `;
  });

  servicesList.innerHTML = servicesListHtml;
  //call the display cart function
  displayCart();
}

function handleCart(serviceId) {
  let addedService = services.find((item) => item.id === serviceId);
  let isInCart = cart.find((cartItem) => cartItem.id === serviceId);
  console.log(isInCart);
  

  //if service is not in cart then add it
  let addBtn = document.getElementById(`addbtn${serviceId}`);
  if (isInCart == undefined) {
    addBtn.classList.add("services-list-rm-btn");
    addBtn.innerHTML = `Remove Item <i class="fa-solid fa-circle-minus"></i>`;
    cart.push(addedService);
  }
  //if service is in cart then remove it 
  else {
    addBtn.classList.remove("services-list-rm-btn");
    addBtn.innerHTML = `Add Item <i class="fa-solid fa-circle-plus"></i>`;
    index = cart.findIndex((cartItem) => cartItem.id === serviceId);
    cart.splice(index, 1);
  }

  displayCart();

  //this will see that button is active to press when cart is not empty 
  let bookNowBtn = document.getElementById("book-now-btn-js");
  if (cart.length > 0) {
    bookNowBtn.classList.add("book-now-btn-enabled");
  } 
  else {
    bookNowBtn.classList.remove("book-now-btn-enabled");
    bookNowBtn.disabled;
  }
}


//using this to store the TotalPrice
let tAmt = 0;

function displayCart() {
  let cartItemsList = document.getElementById("cart-items-list-js");
  let totalPrice = 0;

  //if cart length is 0- display the no added item msg and make the total amount = 0
  if (cart.length === 0) {
    document.getElementById("no-item-added-msg-js").style.display = "block";
    cartItemsList.innerHTML = ``;
    document.getElementById("total-amt-js").innerText = `₹ 0`;
  } 
  else if (cart.length > 0) {
    document.getElementById("no-item-added-msg-js").style.display = "none";

    //This will store all the html for added items to fit in added-to-cart card
    let cartItemsListHtml = ``;

    cart.forEach((item, index) => {
      totalPrice += item.price;
      cartItemsListHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                </tr>
            `;
    });

    cartItemsList.innerHTML = cartItemsListHtml;
    document.getElementById("total-amt-js").innerText = `₹ ${totalPrice}`;
    tAmt = totalPrice;//for using in the emailjs
  }
}



//show message under the button
let msg = document.getElementById("showMsg");

//Using Email js documentation for getting the syntax of emailjs
function mailMe() {
  let orders = "";

  cart.forEach((item) => {
    orders += ", ";
    orders += item.name;
  });

  //just to replace the first comma in the order list
  orders = orders.replace(", ", "");

  let name = document.getElementById("fname");
  let mail = document.getElementById("email");
  let phoneNo = document.getElementById("phone");

  var templateParams = {
    fname: name.value,
    email: mail.value,
    phone: phoneNo.value,
    orderList: orders,
    tprice: tAmt
  };

  emailjs.send("service_9rfxn1b", "template_nso4x22", templateParams).then(
    () => {
      msg.style.display = "block";
      msg.innerHTML = `Thank you For
Booking the Service We will get back to you soon!`;

      //this will automatically reset the cart and the form, so that user can place order again
      setTimeout(() => {
        msg.style.display = "none";
        cart = [];
        displayCart();

        name.value = "";
        mail.value = "";
        phoneNo.value = "";
        generateServicesList();
      }, 2000);
    },
    (error) => {
      //to inform in console that some error is encountered
      console.log("FAILED...", error);
    },
  );
}


generateServicesList();