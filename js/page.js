
const editIcon = chrome.runtime.getURL("images/pencil.png");

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
        <a href="${getSiteEditorUrl()}" target="_blank" class="contenedor-extension">
            <img src="${editIcon}" />
        </a>`;
    body.insertAdjacentHTML('afterend',elemento);
}

// Actualizaciones de Widget
const handleWidget = () => { 
    const widget = document.querySelector('.contenedor-extension');
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


