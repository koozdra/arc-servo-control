function log(s) {
  document.getElementById('log').innerHTML = s;
}

function normalizePoint(width, height, p) {
  return {
    x: p.x / width,
    y: p.y / height
  };
}
function circleDragstarted(d, i, a) {
  d3.selectAll(a).attr('r', 15);
}

function circleDragged(points, d, i, a) {
  const { x: mouseX, y: mouseY } = d3.event;

  d3
    .selectAll(a)
    .attr('cx', mouseX)
    .attr('cy', mouseY);

  points[i] = [mouseX, mouseY];
}

function circleDragended(d, i, a) {
  d3.selectAll(a).attr('r', 10);
}

function render(svg, points) {
  svg
    .selectAll('.curve-handle')
    .data(points)
    .enter()
    .append('circle')
    .attr('class', 'curve-handle')
    .attr('cx', d => d[0])
    .attr('cy', d => d[1])
    .attr('r', 10)
    .attr('stroke', 'black')
    .attr('fill', 'white')
    .call(
      d3
        .drag()
        .on('start', circleDragstarted)
        .on('drag', (d, i, a) => {
          circleDragged(points, d, i, a);
          render(svg, points);
        })
        .on('end', circleDragended)
    );

  const lineFunction = d3
    .line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveCardinal);

  const line = svg
    .select('.line')
    .attr('d', lineFunction(points))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
}

function onSocketReady(socket) {
  console.log('socketReady');
  const points = [];

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .style('border', '1px solid');

  const path = svg.append('path').attr('class', 'line');

  const indicator = svg
    .append('circle')
    .attr('class', 'indicator')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 5)
    .attr('fill', 'blue');

  moveIndicator(indicator, socket);

  function moveIndicator(indicator, socket) {
    indicator
      .transition()
      .ease(d3.easeLinear)
      .duration(4000)
      .attrTween('transform', translateAlongPath(path.node(), socket))
      .on('end', () => moveIndicator(indicator, socket));
  }

  function translateAlongPath(path, socket) {
    const pathTotalLength = path.getTotalLength();
    return (d, i, a) => t => {
      const p = path.getPointAtLength(t * pathTotalLength);
      const message = JSON.stringify(normalizePoint(500, 500, p));
      socket.send(message);
      return 'translate(' + p.x + ',' + p.y + ')';
    };
  }

  svg.on('click', () => {
    const mouseXY = d3.mouse(svg.node());
    points.push(mouseXY);
    render(svg, points);
  });

  svg.on('mousemove', () => {
    const { x: mouseX, y: mouseY } = d3.event;
    const message = JSON.stringify(
      normalizePoint(500, 500, { x: mouseX, y: mouseY })
    );
    // socket.send(message);
  });
}

function init() {
  // const ip = '10.67.15.254'; //'192.168.1.32'
  const ip = '192.168.1.32';
  const socket = new WebSocket(`ws:${ip}:8999`);
  // const canvas = document.getElementById('canvas');

  // function getMousePos(canvas, evt) {
  //   var rect = canvas.getBoundingClientRect();
  //   return {
  //     x: evt.clientX - rect.left,
  //     y: evt.clientY - rect.top
  //   };
  // }

  socket.onopen = onSocketReady.bind(null, socket);
  // onSocketReady({ send: () => {} });
  // onSocketReady({ send: console.log });

  // const gn = new GyroNorm();
  // socket.onopen = () => {
  //   canvas.addEventListener(
  //     'mousemove',
  //     event =>
  //       socket.send(
  //         JSON.stringify(normalizePoint(500, 500, getMousePos(canvas, event)))
  //       ),
  //     false
  //   );
  //
  //   // socket.send('connected to phone');
  //
  //   // gn.init().then(() => {
  //   //   // alert('gn init');
  //   //   // log('gn init');
  //   //   gn.start(data => {
  //   //     const message = JSON.stringify([data.do.beta, data.do.gamma]);
  //   //     log(message);
  //   //     socket.send(message);
  //   //   });
  //   // });
  // };
}
