// PDP Functions

const handleSkuWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.sku');
    !widget && renderSkuWidget();
}

const removeSkuWidget = () => {
    const widget = document.querySelector('.contenedor-extension.sku');
    const listado = document.querySelector('.listado-skus');
    widget && widget.remove();
    listado && listado.remove();
}

const getSkuUrl = (sku) => {
    const vendor = window.location.host;
    return (`https://${vendor}/admin/Site/SkuForm.aspx?IdSku=${sku}`);
}

const renderSkuWidget = () => {
    const body = document.querySelector('body');
    
    // Botón para desplegar SKUs
    const elemento =/*html*/`
        <div class="contenedor-extension sku">
            <img src="${skuIcon}" />
            <p class="descripcion">Ver variantes de SKU</p>
        </div>
        `;
    body.insertAdjacentHTML('beforeend',elemento);
    const botonSku = document.querySelector('.contenedor-extension.sku');
    botonSku.addEventListener('click',function(){
        listadoElemento.classList.toggle('activo');
    })

    // Desplegable de SKUs
    const listado =/*html*/ `<div class="listado-skus"></div>`;
    !document.querySelector('.listado-skus') && body.insertAdjacentHTML('beforeend',listado);
    const listadoElemento = document.querySelector('.listado-skus');

    // Fetch de datos del producto
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'}
    };
      
    fetch(`/api/catalog_system/pub/products/search${window.location.pathname}`, options)
        .then(response => response.json())
        .then(response => {
            const productId = response[0].productId;
            if(!document.querySelector('.listado-skus').hasChildNodes()){
                fetch(`/api/catalog_system/pub/products/variations/${productId}`, options)
                .then(response => response.json())
                .then(response => {
                    response.skus.map(sku => {
                        const nombreProductId = response.name;
                        const nombreSkuId = (sku.skuname).replace(`${nombreProductId} - `, ''); 
                        item = /*html*/ `
                            <div class="sku-particular">
                                <a href="${getSkuUrl(sku.sku)}" target="_blank">
                                    <p>
                                        VARIANTE ${nombreSkuId} <br> 
                                        <b>SKU ID ${sku.sku}</b><br>
                                        <span class="sku-availability">${sku.available ? "✅ Stock disponible" : "❌ Fuera de stock"}</span>
                                    </p>
                                    <img class=${sku.available} src="${sku.image}"/>                           
                                </a>
                            </div>`;
                        listadoElemento.insertAdjacentHTML('afterbegin',item);
                    })
                })
                .catch(err => console.error(err));   
            }
        })
        .catch(err => console.error(err));
}


const handleProductWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.producto');
    widget ? (widget.href = getProductUrl()) : renderProductWidget() ;
}

const removeProductWidget = () => {
    const widget = document.querySelector('.contenedor-extension.producto');
    widget && widget.remove();
}

const getProductUrl = () => {
    const rawProductData = document.querySelector('.vtex-product-context-provider script[type="application/ld+json"]');
    const jsonData = JSON.parse(rawProductData.innerHTML);
    const sku = jsonData.mpn;
    const vendor = window.location.host;
    return (`https://${vendor}/admin/Site/ProdutoForm.aspx?id=${sku}`);
}

// Renderizado de Widget en el DOM
const renderProductWidget = () => {
    const body = document.querySelector('body');
    const elemento = /*html*/ `
        <a href="${getProductUrl()}" target="_blank" class="contenedor-extension producto">
            <img src="${productIcon}" />
            <p class="descripcion">Ver Producto General</p>
        </a>
        `;

    body.insertAdjacentHTML('beforeend',elemento);
}


// Global Functions
// Obtengo la URL absoluta para ingresar a Site Editor
const getSiteEditorUrl = () => {
    const vendor = window.location.host;
    const url = window.location.pathname;
    const parameters = window.location.search;
    return (`https://${vendor}/admin/cms/site-editor${url}${parameters}`)
}

// Renderizado de Widget en el DOM
const renderSiteEditorWidget = () => {
    const body = document.querySelector('body');
    const elemento = `
        <a href="${getSiteEditorUrl()}" target="_blank" class="contenedor-extension pagina">
            <img src="${editIcon}" />
            <p class="descripcion">Ver en Site Editor</p>
        </a>`;
    body.insertAdjacentHTML('beforeend',elemento);
}

// Actualizaciones de Widget
const handleSiteEditorWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.pagina');
    widget ? (widget.href = getSiteEditorUrl()) : renderSiteEditorWidget() ;
}

// Corro función cuando se actualiza la URL
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === 'urlChanged') {
        handleSiteEditorWidget();
    }
});



// Checkout Functions

const handleCheckoutWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.checkout');
    !widget && renderCheckoutWidget() ;
}

const removeCheckoutWidget = () => {
    const widget = document.querySelector('.contenedor-extension.checkout');
    widget && widget.remove();
}

const getCheckoutUrl = () => {
    const vendor = window.location.host;
    return (`https://${vendor}/admin/vtex-checkout-ui-custom/`);
}

// Renderizado de Widget en el DOM
const renderCheckoutWidget = () => {
    const body = document.querySelector('body');
    const elemento = `
        <a href="${getCheckoutUrl()}" target="_blank" class="contenedor-extension checkout">
            <img src="${editIcon}" />
            <p class="descripcion">Abrir Checkout UI Custom</p>
        </a>`;
    body.insertAdjacentHTML('beforeend',elemento);
}


const handleCheckoutOrderFormWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.orderform');
    !widget && renderCheckoutOrderFormWidget();
    widget && updateWidget();
}

const removeCheckoutOrderFormWidget = () => {
    const widget = document.querySelector('.contenedor-extension.orderform');
    const editorOrderForm = document.querySelector('.orderform-json-container');
    widget && widget.remove();
    editorOrderForm && editorOrderForm.remove();
}

const fetchOrderForm = () => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'}
    };

    fetch(`/api/checkout/pub/orderForm/`, options)
    .then(response => response.json())
    .then(response => {
        $('#json-renderer').jsonViewer(response, {collapsed: true, rootCollapsable: false});
    })
    .catch(err => console.error(err));
}

const renderCheckoutOrderFormWidget = () => {

    const body = document.querySelector('body');
    
    // Botón para desplegar SKUs
    const elemento =/*html*/`
        <div class="contenedor-extension orderform">
            <img src="${orderFormIcon}" />
            <p class="descripcion">Ver OrderForm en formato JSON</p>
        </div>
        `;
    body.insertAdjacentHTML('beforeend',elemento);

    const botonOrderForm = document.querySelector('.contenedor-extension.orderform');
    botonOrderForm.addEventListener('click',function(){
        contenedorJson.classList.toggle('activo');
    })

    // Desplegable de SKUs
    const contenedorJsonHtml =/*html*/ `
    <div class="contenedor-json-renderer">
        <button id="json-updater">Actualizar OrderForm</button>
        <pre id="json-renderer"></pre>
    </div>`;
    !document.querySelector('.contenedor-json-renderer') && body.insertAdjacentHTML('beforeend',contenedorJsonHtml);
    const contenedorJson = document.querySelector('.contenedor-json-renderer');
    const updater = document.querySelector("#json-updater");
    updater.addEventListener('click',fetchOrderForm);

    // Fetch de datos del producto
    fetchOrderForm();
}
