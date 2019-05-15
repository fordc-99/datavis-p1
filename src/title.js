export function title(svg) {
  const titleText = [
    {
      content: 'from howard to 95th/dan ryan:',
      y: 160,
      size: 100,
      weight: 700,
      spacing: 0
    }, {
      content: 'RIDERSHIP AND INCOME ALONG THE CTA\'S RED LINE',
      y: 335,
      size: 160,
      weight: 700,
      spacing: 0
    }, {
      content: 'CHRISTINA FORD • CONNOR HOPCRAFT • ASHLEY WANG',
      y: 450,
      size: 65,
      weight: 400,
      spacing: 5
    }
  ];

  svg.selectAll('title-text')
    .data(titleText)
    .enter().append('text')
      .attr('x', 100)
      .attr('y', d => d.y)
      .attr('font-size', d => d.size)
      .style('text-anchor', 'start')
      .style('font-family', 'sans-serif')
      .style('letter-spacing', d => d.spacing)
      .style('font-weight', d => d.weight)
      .text(d => d.content);
}
