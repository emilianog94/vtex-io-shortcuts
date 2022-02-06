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
    body.insertAdjacentHTML('afterend',elemento);
    const botonSku = document.querySelector('.contenedor-extension.sku');
    botonSku.addEventListener('click',function(){
        listadoElemento.classList.toggle('activo');
    })

    // Desplegable de SKUs
    const listado =/*html*/ `<div class="listado-skus"></div>`;
    !document.querySelector('.listado-skus') && body.insertAdjacentHTML('afterend',listado);
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
                        item = /*html*/ `
                            <div class="sku-particular">
                                <a href="${getSkuUrl(sku.sku)}" target="_blank">
                                    <p>${sku.skuname} - <b>${sku.sku}</b></p>
                                    <img src="${sku.image}"/>                           
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

    body.insertAdjacentHTML('afterend',elemento);
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
    body.insertAdjacentHTML('afterend',elemento);
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
            <img src="${checkoutIcon}" />
            <p class="descripcion">Abrir Checkout UI Custom</p>
        </a>`;
    body.insertAdjacentHTML('afterend',elemento);
}