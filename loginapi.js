const api_url = "https://retoolapi.dev/h3elhh/code-adventure-login-data";


// Only call initialise_data() once when setting up the API data. Comment once everything is set up.
// initialise_data() 

async function initialise_data() {

  // Storing response
  const response = await fetch(api_url);

  // Storing data in form of JSON
  var data = await response.json();

  // Get the data from API and display (using the show() function)
  async function get_api(api_url) {
    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();

    show(data);
  }


  function show(data) {
    let element = "<div class='container'>"
    // Loop to access all rows
    for (let r of data) {
      // TODO: Change the HTML code to match your own design
      // TODO: Change the column names to match your API columns (e.g. item_image)
      element += `<div class='card'>`
      element += `<img src='${r.item_image}'>`
      element += `<p class="item-name">${r.item_name}</p>`;
      element += `<p class="item-price">$ ${r.item_price}</p>`;
      element += `<div item-id='${r.id}' class='cart-button'>Add to <i class="fa-solid fa-cart-shopping"></i></div>`;
      element += `</div>`;

    }

    element += "</div>"

    // Setting innerHTML as tab variable
    // TODO: Make sure you have a container to put all the dynamic HTML code.
    // In this case, the HTML container has an ID api-data
    document.getElementById("api-data").innerHTML = element;
  }





  // Adds an item JSON (with the same columns as the API)
  function add(item) {
    fetch(api_url, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  // Deletes an item JSON (with the same ID)
  function remove(item_id) {
    return fetch(api_url + "/" + item_id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }