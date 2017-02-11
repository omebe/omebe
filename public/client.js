document.addEventListener("DOMContentLoaded", () => {
  let mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    pos_prev: false
  };

  // let penColor = '#d6008b'; // pink
  let myArr = ['#FF0000', '#888888', '#1200d6']
  // let penColor = myArr[Math.floor(Math.random() * 3)];
  let penColor = '#000000'


  // get canvas element and create context
  let canvas = document.getElementById('drawing');
  let context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  let socket = io.connect();
  let blueButton = document.getElementById('blue');

  blueButton.onclick = (e) => {
    console.log("blue button click!");
    penColor = 'blue'
  }

  // register mouse event handlers
  canvas.onmousedown = (e) => { mouse.click = true; };
  canvas.onmouseup = (e) => { mouse.click = false; };

  canvas.onmousemove = (e) => {
    mouse.pos.x = e.clientX;
    mouse.pos.y = e.clientY;
    mouse.move = true;
  };

  // draw line received from server
  socket.on('draw_line', (data) => {
    let line = data.line;
    context.beginPath();

    //  set line width
    context.lineWidth = 10;
    // set end cap of line 'round' 'square' 'butt'
    context.lineCap = 'round';

    context.moveTo(line[0].x, line[0].y);
    context.lineTo(line[1].x, line[1].y);
    context.strokeStyle = data.line[2];

    console.log(data.lineColor)
    // context.strokeStyle=penColor.lineColor;
    // context.strokeStyle="#FF0000";
    context.stroke();
  });

  // main loop, running every 5ms
  function mainLoop() {
    // check if the user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      // send line to to the server
      socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev, penColor]});
      mouse.move = false;
    }
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 5);
  }
  mainLoop();
});


