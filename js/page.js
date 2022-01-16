const handleProductWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.producto');
    console.log("verifico si existe el widget de producto:");
    console.log(widget);
    widget ? (widget.href = getProductUrl()) : renderProductWidget() ;
}

const removeWidget = () => {
    const widget = document.querySelector('.contenedor-extension.producto');
    widget && widget.remove();
}

const getProductUrl = () => {
    const rawProductData = document.querySelector('.vtex-product-context-provider script[type="application/ld+json"]');
    console.log("el raw product data es");
    console.log(rawProductData);
    const jsonData = JSON.parse(rawProductData.innerHTML);
    const sku = jsonData.mpn;
    const vendor = window.location.host;
    return (`https://${vendor}/admin/Site/ProdutoForm.aspx?id=${sku}`);
}

// Renderizado de Widget en el DOM
const renderProductWidget = () => {
    const body = document.querySelector('body');
    console.log("se ejecuta la func de renderizadoo");
    const elemento = `
        <a href="${getProductUrl()}" target="_blank" class="contenedor-extension producto">
            <img src="${productIcon}" />
        </a>`;
    body.insertAdjacentHTML('afterend',elemento);
}






const editIcon = chrome.runtime.getURL("images/pencil.png");
const productIcon = chrome.runtime.getURL("images/product.png");

// Obtengo la URL absoluta para ingresar a Site Editor
const getSiteEditorUrl = () => {
    const vendor = window.location.host;
    const url = window.location.pathname;
    const parameters = window.location.search;
    return (`https://${vendor}/admin/cms/site-editor${url}${parameters}`)
}

// Renderizado de Widget en el DOM
const renderWidget = () => {
    const body = document.querySelector('body');
    const elemento = `
        <a href="${getSiteEditorUrl()}" target="_blank" class="contenedor-extension pagina">
            <img src="${editIcon}" />
        </a>`;
    body.insertAdjacentHTML('afterend',elemento);
}

// Actualizaciones de Widget
const handleWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.pagina');
    widget ? (widget.href = getSiteEditorUrl()) : renderWidget() ;
}



// Corro función cuando se actualiza la URL
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === 'urlChanged') {
        handleWidget();
    }
});

// First run
handleWidget();
// handleProductWidget();



MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observer = new MutationObserver(function() {
    removeWidget();
    console.log("cambio el DOM")
    const urlCheck = document.querySelector('.render-container');
    const isOnPdp = urlCheck.classList.contains('render-route-store-product');
    console.log(isOnPdp);
    isOnPdp && handleProductWidget();
});

observer.observe(document.querySelector('.render-container'), {
  attributes: true,
  attributeFilter: ['class']
});


