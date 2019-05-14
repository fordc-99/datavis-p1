//uses './data/data.json'
function phaseDiagram(data) {
    const width = 2000;
    const height = 2000;
    const centerY = 500;
    const centerX = 1000;
  
  
    const weekday = [1, 2, 3, 4, 5];
    const weekend = [6, 7];
    
    const weekday_data = data.filter(d => weekday.includes(d.dow));
    const weekend_data = data.filter(d => weekend.includes(d.dow));
    const m_data = data.filter(d => d.dow == 1);
    const t_data = data.filter(d => d.dow == 2);
    const w_data = data.filter(d => d.dow == 3);
    const h_data = data.filter(d => d.dow == 4);
    const f_data = data.filter(d => d.dow == 5);
    const s_data = data.filter(d => d.dow == 6);
    const u_data = data.filter(d => d.dow == 7);
    const filterss = [weekday_data, weekend_data, m_data, t_data, w_data, h_data, f_data, s_data, u_data, data];
    const label = ['Weekday', 'Weekend', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'All'];
  
    const fillScale = scaleLinear().domain([0, 349810]).range([0, 500]);
    const color = scaleLinear().domain([0, 100]).range(['#0000FF', '#FF0000']).interpolate(interpolateRgb);
  
    for (var j=0; j<10; j++) {
      const svg = select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);
  
    const arcH = arc()
      .innerRadius(0)
      .outerRadius(d => fillScale(d.data.ridership));
      
    const pieH = pie()
      .value(d => d.value);
  
    const arcs = g.selectAll('slice')
      .data(pieH(filterss[j]))
        .enter()
        .append('g')
        .attr('class', (d, i) => `slice-${i}`);

    arcs.append('path')
      .attr('fill', d => color(d.data.temp))
      .attr('d', arcH);
  
    svg.append('text')
      .attr('x', 1000)
      .attr('y', 1000)
      .text(label[j]);

    } 
}