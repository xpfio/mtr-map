d3.queue()
    .defer(d3.csv, "stations.csv")
    .defer(d3.csv, "lines.csv")
    .await(ready);

function ready(error, stations, path) {

  console.log(stations,path)
  // console.log(path,stations)
  var factor = 0.5;
  var svg = d3.select('#viz').append('g');

  path.forEach(d=>{

    paths = d.projection.split('M').slice(1);
    paths = paths.map(a=>{
      var temp = "";
      var segments = [];
      for (var i = a.length - 1; i >= 0; i--) {
        if(a[i] === 'L'){
          segments.unshift({
            type:'L',
            info:[temp.split(',').map(k=>+k)]
          })
          temp = "";
        }
        else if(a[i] === 'C'){
          info=temp.split(',').map(k=>+k);
          info=[[info[0],info[1]],[info[2],info[3]],[info[4],info[5]]]
          segments.unshift({
            type:'C',
            info:info
          })
          temp = "";   
        }
        else{
          temp = a[i] + temp;
        }
      }
      segments.unshift({
        type:'',
        info:[temp.split(',').map(k=>+k)]
      })
      temp = "";  
      return segments;
    })
    // console.log(paths)
    d.seg = paths;
  })



  // //AUTO ASSIGN
  // stations.forEach(station=>{
  //   console.log(station)
  //   x1 = +station.x_real/2;
  //   y1 = +station.y_real/2;

  //   min = 10**10;
  //   min_point = {};

  //       // seg = [seg1, seg2, seg3]
  //   // seg1 = [{A},{},{},{}]
  //   // A = type + info
  //   // info = [[x,y],[x,y]]

  //   path.forEach(d=>d.seg.forEach(subseg=>subseg.forEach(point=>{
  //     temp = {}
  //     if(point.type === 'C'){
  //       temp.x = point.info[2][0]
  //       temp.y = point.info[2][1]
  //     }
  //     else{
  //       temp.x = point.info[0][0]
  //       temp.y = point.info[0][1]        
  //     }
  //     x2 = temp.x;
  //     y2 = temp.y;

  //     distance = (x1-x2)**2 + (y1-y2)**2;
  //     if(distance < min){
  //       // console.log(distance)
  //       min_point = point;
  //       min = distance;
  //     }
  //     // console.log(temp);

  //   })))

  //   console.log(min_point)
  //   min_point.assigned = true
  //   if(min_point.type === 'C'){
  //     min_point.info[2][0] = station.x_projection/2;
  //     min_point.info[2][1] = station.y_projection/2;
  //   }
  //   else{
  //     min_point.info[0][0] = station.x_projection/2;
  //     min_point.info[0][1] = station.y_projection/2;
  //   }
  // })


  // // REASSIGN WHAT WE CAN
  // path.forEach(p=>p.seg.forEach(subseg=>{
  //   to_be_assigned = []
  //   previous_point_assigned = null;
  //   subseg.forEach(point=>{
  //     if(point.assigned){
  //       if(previous_point_assigned !== null){

  //         var xa,ya,xb,yb;
  //           if(previous_point_assigned.type === 'C'){
  //             xa = previous_point_assigned.info[2][0];
  //             ya = previous_point_assigned.info[2][1];
  //           }
  //           else{
  //             xa = previous_point_assigned.info[0][0];
  //             ya = previous_point_assigned.info[0][1];
  //           }

  //           if(point.type === 'C'){
  //             xb = point.info[2][0];
  //             yb = point.info[2][1];
  //           }
  //           else{
  //             xb = point.info[0][0];
  //             yb = point.info[0][1];
  //           }

  //         var n = to_be_assigned.length;

  //         to_be_assigned.forEach((point_to_be_assigned,number)=>{
  //           if(point_to_be_assigned.type === 'C'){
  //             point_to_be_assigned.info[2][0] = xa+(xb-xa)*(number+1)/(n+1);
  //             point_to_be_assigned.info[2][1] = ya+(yb-ya)*(number+1)/(n+1);
  //           }
  //           else{
  //             point_to_be_assigned.info[0][0] = xa+(xb-xa)*(number+1)/(n+1);
  //             point_to_be_assigned.info[0][1] = ya+(yb-ya)*(number+1)/(n+1);
  //           }
  //         })
  //       }
  //       previous_point_assigned = point
  //       to_be_assigned = [];
  //     }
  //     else{
  //       to_be_assigned.push(point)
  //     }
  //   })
  // }))

  // //CHANGE C to be in the middle
  // path.forEach(p=>p.seg.forEach(subseg=>{
  //   previous = null
  //   subseg.forEach(point=>{
  //     if(previous){
  //       if(point.type === 'C'){
  //         if(previous.type==='C'){
  //           point.info[0][0] = (point.info[2][0] + previous.info[2][0])/2;
  //           point.info[0][1] = (point.info[2][1] + previous.info[2][1])/2;

  //           point.info[1][0] = (point.info[2][0] + previous.info[2][0])/2;
  //           point.info[1][1] = (point.info[2][1] + previous.info[2][1])/2;
  //         }
  //         else{
  //           point.info[0][0] = (point.info[2][0] + previous.info[0][0])/2;
  //           point.info[0][1] = (point.info[2][1] + previous.info[0][1])/2;

  //           point.info[1][0] = (point.info[2][0] + previous.info[0][0])/2;
  //           point.info[1][1] = (point.info[2][1] + previous.info[0][1])/2;
  //         }
  //       }
  //       // if(previous.type === 'C'){
  //       //   if(point.type === 'C'){
  //       //     previous.info[1][0] = (point.info[2][0] + previous.info[2][0])/2;
  //       //     previous.info[1][1] = (point.info[2][1] + previous.info[2][1])/2;
  //       //   }
  //       //   else{
  //       //     previous.info[1][0] = (point.info[0][0] + previous.info[2][0])/2;
  //       //     previous.info[1][1] = (point.info[0][1] + previous.info[2][1])/2;
  //       //   }
  //       // }
  //     }
  //     previous = point;
  //   })
  // }))


  // console.log(path)
  svg.selectAll('path')
    .data(path)
    .enter()
    .append('g')
    .attr('class','line')
    .append('path')
      .style('fill',d=>d.fill)
      .style('stroke-width',d=>1)
      .attr('class',d=>d.class + (d.projection==null?' no_projection':''))
      .attr('d',d=>d.path)
      .attr('id',d=>d.name)

  svg.selectAll('.lines')
    .data(path)
    .enter()
    .append('g')
      .selectAll('.sub-lines')
      .data(d=>d.seg)
      .enter()
      .append('g')
        .selectAll('.points')
        .data(d=>d)
        .enter()
        .append('g')
          // .style('fill',d=>d.type=='C'?'blue':'red')
          .selectAll('.circle-p')
          .data(d=>d.info)
          .enter()
          .append('circle')
            .attr('cx',d=>d[0])
            .attr('cy',d=>d[1])
            .attr('r',2)
            .style('fill',(d,p)=>p===2?'blue':'red')
            .style('stroke','none')
            .style('opacity','0.2')
              .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


  function get_new_path(seg) {
    // console.log(seg)
    // return 'M' + (seg.map(d=>d.reduce((obj,a)=>)a+obj.type+obj.info.reduce((obj2,a2)=>,'').join(',')).join('M')

    // seg = [seg1, seg2, seg3]
    // seg1 = [{pointA},{},{},{}]
    // pointA = type(L or C) + info
    // info = [[x,y],[x,y]]

    return 'M'+ seg .map(subseg=>subseg
                                  .map(d=>d.type + d.info
                                                      .map(a=>a[0]+','+a[1])
                                                      .join(','))
                                  .join(''))
                    .join('M')
  }

  function dragstarted(d) {
    // d3.select(this).raise().classed("active", true);
  }

  function dragged(d) {
    d3.select(this).attr("cx", d[0] = d3.event.x).attr("cy", d[1] = d3.event.y);
    d3.selectAll('path').attr('d',d=>d.new_path=get_new_path(d.seg));
    
  }

  function dragended(d) {
    console.log(path.map(d=>d.new_path).join('\n'))
    // d3.select(this).classed("active", false);
  }





//   list_joints = []


//   path.forEach(d=>{
//     list_joints_temp = []
//     if(d.path[0] == 'M'){
//       temp = d.path.split('M')[1]
//       temp = temp.split('C')
//       temp2 = []
//       temp.forEach(a=>a.split('L').forEach(b=>temp2.push(b)));
//       // console.log(temp2)

//       temp2.forEach(a=>{
//         pos = a.split(',').map(k=>+k)
//         console.log(pos)
//         if(pos.length == 6){
//           // list_joints.push({x:pos[0],y:pos[1]})
//           // list_joints.push({x:pos[2],y:pos[3]})
//           list_joints_temp.push({x:pos[4],y:pos[5]})
//         }
//         if(pos.length == 2){
//           list_joints_temp.push({x:pos[0],y:pos[1]})
//         }
//       })
//     }
//     d.list_joints = list_joints_temp;
//     list_joints = list_joints.concat(list_joints_temp)
//   })




  svg.selectAll('.station')
    .data(stations)
    .enter()
    .append('g')
      .attr('class','station')
      .attr('transform',d=>'translate('+d.x_real*factor+','+d.y_real*factor+')')
      // .attr('cx',d=>d.x_real*factor)
      // .attr('cy',d=>d.y_real*factor)
    .append('circle')
      .attr('r',2)
      .attr('fill','white')
      .attr('stroke',d=>'#333')
      .attr('stroke-width',2)



//   // d3.selectAll('#tsuenwanline')
//     // .transition().delay(1000).duration(10000).attr('d','M572.26399,505.86926L595.17826,522.40188L607.53093,529.20375L625.02144,533.15476L631.97899,547.42521L621,574L626.08178,602.68614L658.7599299999999,628.80974L672.9999999999999,630L687.9999999999999,625L698.9999999999999,628L722.9999999999999,649L729.9999999999999,665L737.9999999999999,708L740.9999999999999,722L742.9999999999999,751L737.8909799999999,784.0875L727.4123199999999,793.4962899999999L717.7092599999999,790.7923299999999L712.7306399999999,788.2293099999998L705.1231799999999,787.4666899999999')

//   // console.log(list_joints);

//   svg.selectAll('points')
//     .data(list_joints)
//     .enter()
//     // .append('g')
//     //   .attr('class','point')
//     //   .attr('transform',d=>'translate('+d.x+','+d.y+')')
//       // .attr('cx',d=>d.x_real*factor)
//       // .attr('cy',d=>d.y_real*factor)
//     .append('circle')
//       .attr('r',5)
//       .attr('fill','red')
//       .attr('stroke','none')
//       .attr('stroke-width',2)
//       .style('opacity',0.3)
//       .attr('cx',d=>d.x)
//       .attr('cy',d=>d.y)
//       .call(d3.drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended));

// function dragstarted(d) {
//   d3.select(this).raise().classed("active", true);
// }

// function dragged(d) {
//   d3.selectAll('path').attr('d',d=>d.new_path='M' + d.list_joints.map(a=>a.x+','+a.y).join('C'))
//   // new_d = 'M' + list_joints.map(a=>a.x+','+a.y).join('L')
//   // d3.selectAll('#tsuenwanline').attr('d',new_d)

//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }

// function dragended(d) {
//   console.log(path.map(d=>d.new_path))
//   d3.select(this).classed("active", false);
// }


  function transition(){

    // console.log('T')

    d3.selectAll('.station')
      .transition().duration(4000)
      // .delay(1000)
      .attr('transform',d=>'translate('+d.x_projection*factor+','+d.y_projection*factor+')')
      .transition()
      .duration(4000)
      // .delay(1000)
      .attr('transform',d=>'translate('+d.x_real*factor+','+d.y_real*factor+')')

    d3.selectAll('path')
      .transition().duration(4000)
      // .delay(1000)
      .attr('d',d=>d.new_path)
      .transition()
      .duration(4000)
      // .delay(1000)
      .attr('d',d=>d.path)

  }

// // d3.select('#newterritories_kowloon').remove();
// // var tween = KUTE.fromTo('#newterritories_kowloon',  // target shape
// //    { path: '#newterritories_kowloon' }, // from shape
// //    { path: '#neww' }, // to shape
// //    { // options
// //   easing: 'easingCubicInOut', 
// //   yoyo: true, repeat: 10, duration: 5000,
// //   morphIndex: 30000
// //    }
// //  ).start();
// // var tween = KUTE.to('#rectangle', { path: 'M301.113,12.011l99.25,179.996l201.864,38.778L461.706,380.808l25.508,203.958l-186.101-87.287L115.01,584.766l25.507-203.958L0,230.785l201.86-38.778L301.113,12.011' }).start();

//   // var tween = KUTE.fromTo('#newterritories_kowloon', {path: '#newterritories_kowloon' }, { path: '#neww' }).start();
//   // var tween = KUTE.to('#newterritories_kowloon', { path: 'M301.113,12.011l99.25,179.996l201.864,38.778L461.706,380.808l25.508,203.958l-186.101-87.287L115.01,584.766l25.507-203.958L0,230.785l201.86-38.778L301.113,12.011' }).start();
  


  // transition();
  // setInterval(transition,8000);
}