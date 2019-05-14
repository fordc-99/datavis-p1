export function title(svg) {
  const titleText = [
    {
      content: 'from howard to 95th:',
      y: 160,
      size: 100,
      weight: 700,
      spacing: 0
    }, {
      content: 'INCOME, WEATHER AND RIDERSHIP ON THE CTA\'S RED LINE',
      y: 340,
      size: 160,
      weight: 700,
      spacing: 0
    }, {
      content: 'CHRISTINA FORD • HENRY CONNOR HOPCRAFT • ASHLEY WANG',
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
