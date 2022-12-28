// workaround, make shadowRoot opened
Element.prototype._attachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function () {
  return this._attachShadow({ mode: "open" });
};

window.addEventListener('load', function () {
  (async () => {
    const { default: TimerHintOverlay } = await import("/assets/javascripts/modules/mermaid-zoom-controls-timer.js");
    const { default: MermaidZoomControls } = await import("/assets/javascripts/modules/mermaid-zoom-controls.js");

    let timerHintOverlay = new TimerHintOverlay();
    
    var mermaidDivs = document.getElementsByClassName('mermaid');
    Array.prototype.forEach.call(mermaidDivs, function (div) {
      var shadowRoot = div.shadowRoot;
      if (shadowRoot) {
        new MermaidZoomControls(timerHintOverlay)
          .init(shadowRoot);
      }
    });
  })();
});



