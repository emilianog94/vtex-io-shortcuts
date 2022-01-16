// PDP Functions

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
    const elemento = `
        <a href="${getProductUrl()}" target="_blank" class="contenedor-extension producto">
            <img src="${productIcon}" />
        </a>`;
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