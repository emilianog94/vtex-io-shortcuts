function sanitizeCategory(category){
    return category.toLowerCase()
        .replace(/ /g, '-');
}

// Fetch helper

const options = {
    method: 'GET',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'}
};



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
    const renderContainer = document.querySelector('.render-provider');

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
        renderContainer.classList.toggle('out-of-focus');
    })

    // Desplegable de SKUs
    const listado =/*html*/ `
    <div class="listado-skus">
        <div class="close-container">
            <span>Listado de SKUs</span>
            <img src="${closeIcon}" alt="" />
        </div>
    </div>`;

    if(!document.querySelector('.listado-skus')){
        body.insertAdjacentHTML('beforeend',listado);
        const closeButton = document.querySelector('.listado-skus .close-container img');
        closeButton.addEventListener('click', function(){
            listadoElemento.classList.toggle('activo');
            renderContainer.classList.toggle('out-of-focus');
        })
    }
    const listadoElemento = document.querySelector('.listado-skus');

    // Fetch de datos del producto
    fetch(`/api/catalog_system/pub/products/search${window.location.pathname}`, options)
        .then(response => response.json())
        .then(response => {
            if(!document.querySelector('.listado-skus').querySelector('.sku-particular')){
                    response[0].items.map(sku => {
                        const nombreProductId = response[0].productName;
                        const nombreSkuId = (sku.name).replace(`${nombreProductId} - `, ''); 
                        item = /*html*/ `
                            <div class="sku-particular">
                                <a href="${getSkuUrl(sku.itemId)}" target="_blank">
                                    <p>
                                        VARIANTE ${nombreSkuId} <br> 
                                        <b>SKU ID ${sku.itemId}</b><br>
                                        <span class="sku-availability">${sku.sellers[0].commertialOffer.IsAvailable ? `✅ ${sku.sellers[0].commertialOffer.AvailableQuantity} unidades en stock` : "❌ Fuera de stock"}</span>
                                    </p>
                                    <img class=${sku.sellers[0].commertialOffer.IsAvailable} src="${sku.images[0].imageUrl}"/>                           
                                </a>
                            </div>`;
                        listadoElemento.insertAdjacentHTML('beforeend',item);
                    })
            }
        })
        .catch(err => console.error(err));
}


const handleContextWidget = () => { 
    const widget = document.querySelector('.contenedor-extension.context');
    !widget && renderContextWidget();
}

const removeContextWidget = () => {
    const widget = document.querySelector('.contenedor-extension.context');
    const listado = document.querySelector('.listado-context');
    widget && widget.remove();
    listado && listado.remove();
}

const renderContextWidget = () => {
    const body = document.querySelector('body');
    const renderContainer = document.querySelector('.render-provider');

    // Botón para desplegar Context
    const elemento =/*html*/`
        <div class="contenedor-extension context">
            <img src="${contextIcon}" />
            <p class="descripcion">Ver datos del producto</p>
        </div>
        `;
    body.insertAdjacentHTML('beforeend',elemento);
    const botonContext = document.querySelector('.contenedor-extension.context');
    botonContext.addEventListener('click',function(){
        listadoElemento.classList.toggle('activo');
        renderContainer.classList.toggle('out-of-focus');
    })

    // Desplegable de Context
    const listado =/*html*/ `
    <div class="listado-context">
        <div class="close-container">
            <span>Datos del Producto</span>
            <img src="${closeIcon}" alt="" />
        </div>
    </div>`;

    if(!document.querySelector('.listado-context')){
        body.insertAdjacentHTML('beforeend',listado);
        const closeButton = document.querySelector('.listado-context .close-container img');
        closeButton.addEventListener('click', function(){
            listadoElemento.classList.toggle('activo');
            renderContainer.classList.toggle('out-of-focus');
        })
    }
    const listadoElemento = document.querySelector('.listado-context');

    // Fetch de datos del producto
    fetch(`/api/catalog_system/pub/products/search${window.location.pathname}`, options)
        .then(response => response.json())
        .then(response => {
                const productName = response[0]?.productName;
                const brand = response[0]?.brand;
                const brandId = response[0]?.brandId;
                const productId = response[0]?.productId;
                const categories = response[0]?.categories;
                const productClusters = Object.entries(response[0]?.productClusters);
                const allSpecifications = response[0]?.allSpecifications?.map(specification => 
                    `${specification}&&${response[0][specification]}`.split('&&')
                );

                item = /*html*/`
                    <div class="datos-contexto">
                        <div class="data-list">
                            <span class="data-key">Nombre del Producto</span>
                            <span class="data-value">${productName}</span>
                        </div>

                        <div class="data-list">
                            <span class="data-key">Brand</span>
                            <span class="data-value">${brand} (${brandId})</span>
                        </div>
                        

                        <div class="data-list">
                            <span class="data-key">ID de Producto</span>
                            <span class="data-value">${productId}</span>
                        </div>

                        <div class="data-list">
                            <span class="data-key">Especificaciones asociadas</span>

                            ${allSpecifications && allSpecifications.length ?
                                    allSpecifications.map(specification => `<p class="data-array-item"> <span class="data-array-item-title">${specification[0]}</span>: ${specification[1]}</p class="data-array-item">`).join('')
                                :
                                    `<p>No posee</p>`
                            }
                        </div>                          

                        <div class="data-list">
                            <span class="data-key">Categorías asociadas</span>
                            ${categories && categories.length
                                ?
                                    categories.map(category =>
                                    `<p class="data-array-item">
                                        <a href="${window.location.origin}${sanitizeCategory(category)}" target="_blank">${category}</a>
                                    </p>`).join('')
                                :
                                    `<p>No posee</p>`
                            }
                        </div>

                        <div class="data-list">
                            <span class="data-key">Colecciones asociadas</span>
                            ${productClusters && productClusters.length
                                ?
                                    productClusters.map(cluster => `
                                        <p class="data-array-item"> 
                                            <a href="${window.location.origin}/${cluster[0]}?map=productClusterIds" target="_blank">${cluster[0]}</a> : ${cluster[1]}
                                        </p>`).join('')
                                                               
                                :
                                    `<p>No posee</p>`
                            }
                        </div>                      
                    </div>`;
                listadoElemento.insertAdjacentHTML('beforeend',item);
            }
        )
        .catch(err => console.error(err));
}

const handleProductWidget = () => { 
    const vendor = window.location.host;
    const currentUrl = window.location.pathname;
    const endpoint = `https://${vendor}/api/catalog_system/pub/products/search${currentUrl}`;

    fetch(endpoint,options)
        .then(response => response.json())
        .then(response => {
            const productId = response[0].productId;
            renderProductWidget(`https://${vendor}/admin/Site/ProdutoForm.aspx?id=${productId}`)
    });
}

const removeProductWidget = () => {
    const widget = document.querySelector('.contenedor-extension.producto');
    widget && widget.remove();
}



// Renderizado de Widget en el DOM
const renderProductWidget = (url) => {
    const body = document.querySelector('body');

    const elemento = /*html*/ `
    <a href="${url}" target="_blank" class="contenedor-extension producto">
        <img src="${productIcon}" />
        <p class="descripcion">
            <span>Editar Producto</span>
            <img src="${externalLinkIcon}"/>
        </p>
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
    const elemento = /*html*/`
        <a href="${getSiteEditorUrl()}" target="_blank" class="contenedor-extension pagina">
            <img src="${editIcon}" />
            <p class="descripcion">
                <span>Editar en Site Editor</span>
                <img src="${externalLinkIcon}"/>
            </p>
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
    const elemento = /*html*/`
        <a href="${getCheckoutUrl()}" target="_blank" class="contenedor-extension checkout">
            <img src="${editIcon}" />
            <p class="descripcion">
                <span>Editar Checkout UI Custom</span>
                <img src="${externalLinkIcon}"/>
            </p>
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
