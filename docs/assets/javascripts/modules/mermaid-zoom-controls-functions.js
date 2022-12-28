export function getScaleToOrigFactor(mermaidSvg) {
  var svgEl = mermaidSvg.node();
  var box = svgEl.getBoundingClientRect();

  var svgRealWidth = parseInt(svgEl.style.maxWidth);
  if (!svgRealWidth) {
    svgRealWidth = parseInt(mermaidSvg.attr('width'));
  }
  var visibleWidth = box.width;
  let scaleFactor = svgRealWidth / visibleWidth;

  return Math.max(scaleFactor, 1);
}