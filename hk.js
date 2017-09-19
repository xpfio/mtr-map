d3.queue()
    .defer(d3.csv, "stations.csv")
    .defer(d3.csv, "lines.csv")
    .defer(d3.csv, "paths.csv")
    .await(ready);

function ready(error, stations, lines,paths) {

    paths.forEach(d=>d.reverseFirstPath=d.reverseFirstPath=='TRUE')
  paths.forEach(d=>d.reverseSecondPath=d.reverseSecondPath=='TRUE')
  paths.forEach(d=>d.projection=d.projection=="null"?null:d.projection)

  console.log(stations,lines)
  var FACTOR = 0.5;
  var svg = d3.select('#viz').append('g');

  svg.selectAll('land')
    .data(paths)
    .enter()
    .append('g')
    .attr('class','land')
    .append('path')
      .style('fill',d=>'black')
      .style('stroke-width',d=>3)
      .attr('class',d=>d.class + ' land' + (d.projection==null?' no_projection':''))
      .attr('d',d=>d.path)
      .attr('id',d=>d.name)

  svg.selectAll('mtr-lines')
    .data(lines)
    .enter()
    .append('g')
    .attr('class','line')
    .append('path')
      .style('fill',d=>d.fill)
      .style('stroke-width',d=>3)
      .attr('class',d=>d.class + ' mtr-lines')
      .attr('d',d=>d.path)
      .attr('id',d=>d.name)


  svg.append('g').attr('id','particules').append('g').attr('id','particules2').selectAll('.station')
    .data(stations)
    .enter()
    .append('g')
      .attr('class','station')
      .attr('transform',d=>'translate('+d.x_real*FACTOR+','+d.y_real*FACTOR+')')
    .append('circle')
      .attr('r',4)
      .attr('fill','white')
      .attr('class','station-circle')
      .attr('stroke',d=>'#888')
      .attr('stroke-width',0)


  function transition(){

    d3.selectAll('.station')
      .transition().duration(30000)
      .attr('transform',d=>'translate('+d.x_projection*FACTOR+','+d.y_projection*FACTOR+')')
      .transition()
      .duration(30000)
      .attr('transform',d=>'translate('+d.x_real*FACTOR+','+d.y_real*FACTOR+')')


    d3.selectAll('.station-circle')
      .transition().duration(30000)
      .attr('r',5)
      .transition()
      .duration(30000)
      .attr('r',3)

    d3.selectAll('.mtr-lines')
      .transition().duration(30000)
      .attr('d',d=>d.projection)
      .transition()
      .duration(30000)
      .attr('d',d=>d.path)

    d3.selectAll('.no_projection')
        .transition()
        .duration(30000/3)
        .style('opacity',0)
        .transition()
        .delay(2*30000-2*30000/3)
        .duration(30000/3)
        .style('opacity',1)

    paths.forEach(d=>{
        // console.log(d)
        if(d.projection!=null && d.class.indexOf('land')!==-1){
          var tween = KUTE.fromTo('#'+d.name,  // target shape
          { path: d.path }, // from shape
          { path: d.projection }, // to shape
          { // options
          easing: 'easingCubicInOut', 
          yoyo: true, repeat: 1, duration: 30000,
          morphIndex: 3000000,
          reverseFirstPath:d.reverseFirstPath,
          reverseSecondPath:d.reverseSecondPath
          }
          ).start();
        }
      })

  }

  transition();
  setInterval(transition,2*30000);
}