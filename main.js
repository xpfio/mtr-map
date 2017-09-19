d3.queue()
    .defer(d3.csv, "stations.csv")
    .defer(d3.csv, "paths.csv")
    .defer(d3.csv, "lines.csv")
    .await(ready);

function ready(error, stations, path, lines) {
  console.log(path,stations)
  var factor = 0.5;
  var svg = d3.select('#viz').append('g');

  path.forEach(d=>d.reverseFirstPath=d.reverseFirstPath=='TRUE')
  path.forEach(d=>d.reverseSecondPath=d.reverseSecondPath=='TRUE')
  path.forEach(d=>d.projection=d.projection=="null"?null:d.projection)

  svg.selectAll('path')
    .data(path)
    .enter()
    .append('g')
    .attr('class','')
    .append('path')
      .style('fill',d=>d.fill)
      .style('stroke-width',d=>d.stroke_width)
      .attr('class',d=>d.class + (d.projection==null?' no_projection':''))
      .attr('d',d=>d.path)
      .attr('id',d=>d.name)


  svg.selectAll('mtr-line')
    .data(path)
    .enter()
    .append('g')
    .attr('class','line')
    .append('path')
      .style('fill',d=>d.fill)
      .style('stroke-width',d=>d.stroke_width)
      .attr('class','mtr-line')
      .attr('d',d=>d.path)
      .attr('id',d=>d.name)

  svg.selectAll('circle')
    .data(stations)
    .enter()
    .append('g')
      .attr('class','station')
      .attr('transform',d=>'translate('+d.x_real*factor+','+d.y_real*factor+')')
      // .attr('cx',d=>d.x_real*factor)
      // .attr('cy',d=>d.y_real*factor)
    .append('circle')
      .attr('r',1)
      .attr('fill','white')
      .attr('stroke',d=>'#333')
      .attr('stroke-width',2)

  list_joints = []

  path.forEach(d=>{
    if(d.path[0] == 'M' && d.name == 'tsuenwanline'){
      temp = d.path.split('M')[1]
      temp = temp.split('C')
      temp2 = []
      temp.forEach(a=>a.split('L').forEach(b=>temp2.push(b)));
      // console.log(temp2)

      temp2.forEach(a=>{
        pos = a.split(',').map(k=>+k)
        console.log(pos)
        if(pos.length == 6){
          // list_joints.push({x:pos[0],y:pos[1]})
          // list_joints.push({x:pos[2],y:pos[3]})
          list_joints.push({x:pos[4],y:pos[5]})
        }
        if(pos.length == 2){
          list_joints.push({x:pos[0],y:pos[1]})
        }
      })
    }
  })

  // d3.selectAll('#tsuenwanline')
    // .transition().delay(1000).duration(10000).attr('d','M572.26399,505.86926L595.17826,522.40188L607.53093,529.20375L625.02144,533.15476L631.97899,547.42521L621,574L626.08178,602.68614L658.7599299999999,628.80974L672.9999999999999,630L687.9999999999999,625L698.9999999999999,628L722.9999999999999,649L729.9999999999999,665L737.9999999999999,708L740.9999999999999,722L742.9999999999999,751L737.8909799999999,784.0875L727.4123199999999,793.4962899999999L717.7092599999999,790.7923299999999L712.7306399999999,788.2293099999998L705.1231799999999,787.4666899999999')

  console.log(list_joints);

  svg.selectAll('points')
    .data(list_joints)
    .enter()
    // .append('g')
    //   .attr('class','point')
    //   .attr('transform',d=>'translate('+d.x+','+d.y+')')
      // .attr('cx',d=>d.x_real*factor)
      // .attr('cy',d=>d.y_real*factor)
    .append('circle')
      .attr('r',5)
      .attr('fill','red')
      .attr('stroke','none')
      .attr('stroke-width',2)
      .style('opacity',0.3)
      .attr('cx',d=>d.x)
      .attr('cy',d=>d.y)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
    new_d = 'M' + list_joints.map(a=>a.x+','+a.y).join('L')
  d3.selectAll('#tsuenwanline').attr('d',new_d)
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  new_d = 'M' + list_joints.map(a=>a.x+','+a.y).join('L')
  d3.select(this).classed("active", false);
  d3.selectAll('#tsuenwanline').attr('d',new_d)
}


  function transition(){
    path.forEach(d=>{
        // console.log(d)
        if(d.projection!=null && d.class.indexOf('land')!==-1){
          var tween = KUTE.fromTo('#'+d.name,  // target shape
          { path: d.path }, // from shape
          { path: d.projection }, // to shape
          { // options
          easing: 'easingCubicInOut', 
          yoyo: true, repeat: 1, duration: 4000,
          morphIndex: 3000000,
          reverseFirstPath:d.reverseFirstPath,
          reverseSecondPath:d.reverseSecondPath
          }
          ).start();
        }

      // d3.selectAll('.no_projection')
      //   .transition()
      //   .duration(4000)
      //   .style('opacity',0)
      //   .transition()
      //   .duration(4000)
      //   .style('opacity',1)

    })

    d3.selectAll('.station')
      .transition().duration(4000)
      // .delay(1000)
      .attr('transform',d=>'translate('+d.x_projection*factor+','+d.y_projection*factor+')')
      .transition()
      .duration(4000)
      // .delay(1000)
      .attr('transform',d=>'translate('+d.x_real*factor+','+d.y_real*factor+')')

    d3.selectAll('.mtr-line')
      .transition().duration(4000)
      // .delay(1000)
      .attr('d',d=>d.projection)
      .transition()
      .duration(4000)
      // .delay(1000)
      .attr('d',d=>d.path)

  }

// d3.select('#newterritories_kowloon').remove();
// var tween = KUTE.fromTo('#newterritories_kowloon',  // target shape
//    { path: '#newterritories_kowloon' }, // from shape
//    { path: '#neww' }, // to shape
//    { // options
//   easing: 'easingCubicInOut', 
//   yoyo: true, repeat: 10, duration: 5000,
//   morphIndex: 30000
//    }
//  ).start();
// var tween = KUTE.to('#rectangle', { path: 'M301.113,12.011l99.25,179.996l201.864,38.778L461.706,380.808l25.508,203.958l-186.101-87.287L115.01,584.766l25.507-203.958L0,230.785l201.86-38.778L301.113,12.011' }).start();

  // var tween = KUTE.fromTo('#newterritories_kowloon', {path: '#newterritories_kowloon' }, { path: '#neww' }).start();
  // var tween = KUTE.to('#newterritories_kowloon', { path: 'M301.113,12.011l99.25,179.996l201.864,38.778L461.706,380.808l25.508,203.958l-186.101-87.287L115.01,584.766l25.507-203.958L0,230.785l201.86-38.778L301.113,12.011' }).start();
  


  transition();
  setInterval(transition,8000);
}