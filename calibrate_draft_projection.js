d3.csv('https://docs.google.com/spreadsheets/d/1cBn1WwKYGBYxz_PTd3Q7e7TIWpHFhSpe6Gxq9k9YqtU/pub?output=csv',(error,raw)=>{
  console.log(error,raw)
  var factor = 0.5;
  var factor = 1;

  var svg = d3.select('#viz').append('g');

  svg.append('image').attr('xlink:href','mtr.jpg').attr('transform','scale('+factor+')')

  svg.selectAll('circle')
    .data(raw)
    .enter()
    .append('circle')
      .attr('cx',d=>d.x_projection*factor)
      .attr('cy',d=>d.y_projection*factor)
      .attr('r',5)
      .attr('fill','black')
      .attr('stroke',d=>d.color?d.color:'black')
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x_projection = d3.event.x).attr("cy", d.y_projection = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("active", false);
  console.log(raw.map(d=>{return {x:d.x_projection,y:d.y_projection}}))
}

  function transition(){
    d3.selectAll('circle')
      .transition()
      .duration(4000)
      .attr('cx',d=>d.x_real*factor)
      .attr('cy',d=>d.y_real*factor)
      .on('end',transition2)
  }


  function transition2(){
    d3.selectAll('circle')
      .transition()
      .duration(4000)
      .attr('cx',d=>d.x_projection*factor)
      .attr('cy',d=>d.y_projection*factor)
      .on('end',transition)
  }

  // transition();
})