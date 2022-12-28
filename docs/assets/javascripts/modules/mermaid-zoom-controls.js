export default class MermaidZoomControls {
  #__timerHintOverlay;
  #__gZoomControls;
  #__mermaidZoomableSvg;

  constructor(timerHintOverlay) {
    this.#__timerHintOverlay = timerHintOverlay;
  }

  init(shadowRoot) {
    this.#__mermaidZoomableSvg = d3.select(shadowRoot).select('svg');
    this.#wrapSvgInnerHtmlInZommableG();
    this.#addZoomControlsToDOM(shadowRoot);
  }

  #wrapSvgInnerHtmlInZommableG() {
    var svg = this.#__mermaidZoomableSvg;
    svg.html("<g class='zoomable-g'>" + svg.html() + "</g>");
    svg.attr('class', 'zoomable-svg');

    let zoom = this.#getZoom();
    svg.call(zoom).on("dblclick.zoom", null);
  }


  #addZoomControlsToDOM(mermaidShadowRoot) {
    
    this.#__timerHintOverlay.addZoomHintOverlay(this.#__mermaidZoomableSvg);

    this.#addZoomControlsSvg(mermaidShadowRoot);

    const svgVisibleWidth = this.#__mermaidZoomableSvg.node().getBoundingClientRect().width;
    const right = Math.max(svgVisibleWidth, 180);
    this.#addZoomInButton(right - 180);
    this.#addZoomOutButton(right - 150);
    this.#addZoom100Button(right - 120);
    this.#addZoomResetButton(right - 90);
    this.#addZoomDownloadButton(right - 30);
  }


  #addZoomControlsSvg(mermaidShadowRoot) {
    var zoomControlsSvg = d3.select(mermaidShadowRoot)
      .insert("svg", ":first-child")
      .attr("width", "100%")
      .attr("height", "30px");

    zoomControlsSvg.append('style')
      .html("@import url('/assets/stylesheets/mermaid-zoom-controls.css');");

    this.#__gZoomControls = zoomControlsSvg
      .append("g")
      .attr("class", "zoom-controls")
      .style('opacity', 0);

    this.#__gZoomControls.transition().duration(200).style("opacity", 1);
  }

  #getZoom() {
    var self = this;
    return d3.zoom()
      .filter((event) => {
        if (event.type === 'wheel') {
          // don't allow zooming without pressing [ctrl] key
          let isCtrlKey = event.ctrlKey;
          if (!isCtrlKey) {
            this.#__timerHintOverlay.showHint(this.#__mermaidZoomableSvg);
          } else {
            this.#__timerHintOverlay.hideHintImmediately();
          }
          return isCtrlKey;
        }
        return true;
      })
      .wheelDelta((event) => -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002)) // removed multiply by 10 when ctrl is pressed from original default wheelDelta https://github.com/d3/d3-zoom/blob/main/src/zoom.js defaultWheelDelta(event)
      .on("zoom", function (event) {
        self.#__mermaidZoomableSvg.select("g[class=zoomable-g]")
          .attr("transform", event.transform);
      });
  }

  #addZoomInButton(x) {
    var icon = '\uf00e'; //fa-magnifying-glass-plus)
    var gZoomIn = this.#addButton(x, 'zoom-in', icon, 'Zoom In');

    var self = this;
    gZoomIn.on('click', function () {
      self.#__timerHintOverlay.hideHintImmediately();
      self.#getZoom().scaleBy(self.#__mermaidZoomableSvg, 1.2);
    });
  }

  #addZoomOutButton(x) {
    var icon = '\uf010'; //fa-magnifying-glass-minus
    var gZoomOut = this.#addButton(x, 'zoom-out', icon, 'Zoom Out');

    var self = this;
    gZoomOut.on('click', function () {
      self.#__timerHintOverlay.hideHintImmediately();
      self.#getZoom().scaleBy(self.#__mermaidZoomableSvg, 1 / 1.2);
    });
  }

  #addZoom100Button(x) {
    var icon = '\uf31e'; //fa-maximize
    var gZoom100 = this.#addButton(x, 'zoom-100', icon, 'Maximize');

    var self = this;
    gZoom100.on('click', function () {
      self.#__timerHintOverlay.hideHintImmediately();
      (async () => {
        const functions = await import("/assets/javascripts/modules/mermaid-zoom-controls-functions.js");

        var k = functions.getScaleToOrigFactor(self.#__mermaidZoomableSvg);
        self.#getZoom()
          .transform(self.#__mermaidZoomableSvg, d3.zoomIdentity.translate(0, 0).scale(k));
      })();
    });
  }


  #addZoomResetButton(x) {
    var icon = '\uf78c'; //fa-minimize
    var gZoomReset = this.#addButton(x, 'zoom-reset', icon, 'Reset');

    var self = this;
    gZoomReset.on('click', function () {
      self.#__timerHintOverlay.hideHintImmediately();
      self.#getZoom().transform(self.#__mermaidZoomableSvg, d3.zoomIdentity);
    });
  }

  #addZoomDownloadButton(x) {

    var icon = '\uf08e'; //fa-arrow-up-right-from-square      
    var gZoomDownload = this.#addButton(x, 'zoom-download', icon, 'Open as PNG image in new window');

    var self = this;
    gZoomDownload.on('click', function () {
      (async () => {
        const functions = await import("/assets/javascripts/modules/mermaid-zoom-controls-functions.js");

        self.#__timerHintOverlay.hideHintImmediately();

        //hack. Manually set colors for --md-mermaid-* css vars for downloaded image, because they are not propagated to encoded SVG image
        //these colors are copied from main mkdocs material css, e.g. /assets/stylesheets/main.975780f9.min.css
        var cssColors = `
            :root {
                --md-mermaid-node-bg-color: #526cfe1a;
                --md-mermaid-node-fg-color: #526cfe;
                --md-mermaid-edge-color: #333333;
                --md-mermaid-label-fg-color: #333;
                --md-mermaid-label-bg-color: #fff;
                --md-mermaid-font-family: "trebuchet ms", verdana, arial, sans-serif;
                --md-default-fg-color--lightest: #ffffde;
                --md-default-fg-color--lighter: #00000052;
                --md-default-bg-color: #e8e8e8;
            }`;


        var css = document.createElement('style');
        css.innerHTML = cssColors;

        var cloned = self.#__mermaidZoomableSvg.node().cloneNode(true);

        cloned.appendChild(css);

        // reset pan/zoom in cloned svg
        d3.select(cloned).select('g[class=zoomable-g]').attr("transform", "translate(0,0) scale(1)");

        var html = cloned.outerHTML;
        // .attr("xmlns", "http://www.w3.org/2000/svg")

        html = html.replaceAll('<br>', '<br/>');
        // html = html.replaceAll(/<img([^>]*)>/g, (m, g: string) => `<img ${g} />`);

        // console.log(html);

        var box = self.#__mermaidZoomableSvg.node().getBoundingClientRect();

        var canvas = document.createElement('canvas');
        var context = canvas.getContext("2d");

        var scaleToOrigFactor = functions.getScaleToOrigFactor(self.#__mermaidZoomableSvg);
        canvas.setAttribute('width', box.width * scaleToOrigFactor);
        canvas.setAttribute('height', box.height * scaleToOrigFactor);

        console.log(canvas.width);

        var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
        var image = new Image;
        image.src = imgsrc;
        image.onload = function () {
          context.drawImage(image, 0, 0);

          var canvasdata = canvas.toDataURL("image/png");

          var pngimg = '<img src="' + canvasdata + '">';

          var newTab = window.open();
          newTab.document.body.innerHTML = pngimg;
        };

        image.remove();
        css.remove();
        cloned.remove();
        canvas.remove();
      })();
    });
  }

  #addButton(x, styleClass, text, title) {
    var gZoomIn = this.#__gZoomControls
      .append("g")
      .attr("class", styleClass)
      .attr("transform", "translate(" + x + ", 0)");
    gZoomIn.append('title').text(title);
    gZoomIn.append("rect")
      .attr("width", 30)
      .attr("height", 30);
    gZoomIn.append("text")
      .style('font-family', '"Font Awesome 6 Free"')
      .text(text)
      .attr('dy', '23px')
      .attr('dx', '5px');

    return gZoomIn;
  }

}