export default class TimerHintOverlay {
  #__timer;
  #__g;

  addZoomHintOverlay(mermaidSvg) {
    (async () => {
      const functions = await import("/assets/javascripts/modules/mermaid-zoom-controls-functions.js");

      let k = functions.getScaleToOrigFactor(mermaidSvg);

      let viewBoxMinX = mermaidSvg.attr('viewBox').split(' ')[0];

      let g = mermaidSvg.append('g')
        .attr('class', 'ctrl-scroll-hint-overlay')
        .style("opacity", 0);
      g.append('rect')
        .attr('x', viewBoxMinX)
        .attr('width', '100%')
        .attr('height', '100%');

      let txt = g.append("text")
        .attr('y', parseInt(45 / k) + '%')
        .attr("transform", "scale(" + k + ")");
      txt.append('svg:tspan')
        .attr('x', viewBoxMinX / k + 10)
        .attr('dy', 5)
        .text("Use ctrl + scroll");
      txt.append('svg:tspan')
        .attr('x', viewBoxMinX / k + 10)
        .attr('dy', 30)
        .text("to zoom the diagram");
    })();
  }

  hideHintImmediately() {
    this.#__g?.style("opacity", 0);
    this.#__timer?.stop();
  }


  showHint(svg) {
    this.#__g = this.#hideHint(svg);

    this.#__g.transition().duration(200).style("opacity", 1);

    this.#rescheduleTimer();
  }
  
  #hideHint(svg) {
    let newG = svg.select('g[class=ctrl-scroll-hint-overlay');
    let isNewG = this.#__g?.node() !== newG.node();
    if (isNewG) {
      this.#__g?.transition().duration(200).style("opacity", 0);
    }
    this.#__timer?.stop();
    return newG;
  }

  #rescheduleTimer() {
    this.#__timer = d3.timeout(() => {
      this.#__g.transition().duration(600).style("opacity", 0);
    }, 1000);
  }
}
