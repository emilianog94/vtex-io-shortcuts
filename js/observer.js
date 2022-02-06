// Observo .render-container para verificar si estamos en una PDP

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observer = new MutationObserver(function() {
    removeProductWidget();
    removeSkuWidget();
    const urlCheck = document.querySelector('.render-container');
    const isOnPdp = urlCheck.classList.contains('render-route-store-product');
    isOnPdp && handleProductWidget();
    isOnPdp && handleSkuWidget();

});

observer.observe(document.querySelector('.render-container'), {
  attributes: true,
  attributeFilter: ['class']
});
