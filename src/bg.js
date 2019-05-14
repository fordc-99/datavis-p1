export function bgLand(svg) {
  const width = 5000;
  const height = 36 / 24 * width;

 // land
  svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#F4F4F3');
}

export function bgLake(svg) {
  const width = 5000;

  // lake
  svg.append('circle')
    .attr('cx', width * 4.94)
    .attr('cy', -0.1 * width)
    .attr('r', 4.5 * width)
    .attr('fill', '#EEF6FE');
}
