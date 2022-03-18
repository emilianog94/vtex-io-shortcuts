handleCheckoutWidget();

const header = document.querySelector('.container.header');
header.insertAdjacentHTML('beforeend','<pre id="json-renderer"></pre>');

const localStorageOrderForm = JSON.parse(localStorage.getItem('orderform'));
const orderFormId = localStorageOrderForm.id


const options = {
    method: 'GET',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'}
};

fetch(`/api/checkout/pub/orderForm/${orderFormId}`, options)
.then(response => response.json())
.then(response => {
   console.log("la respuesta es");
   console.log(response);
   $('#json-renderer').jsonViewer(response);

})
.catch(err => console.error(err));




