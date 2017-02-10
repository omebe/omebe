document.addEventListener("DOMContentLoaded", () => {
   let mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   let canvas  = document.getElementById('drawing');
   let context = canvas.getContext('2d');
   let width   = window.innerWidth;
   let height  = window.innerHeight;
   let socket  = io.connect();

   // set canvas to full browser width/height
  //  canvas.width = width;
  //  canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = (e) => { mouse.click = true; };
   canvas.onmouseup = (e) => { mouse.click = false; };

   canvas.onmousemove = (e) => {
      // normalize mouse position to range 0.0 - 1.0
      // mouse.pos.x = e.clientX / width;
      // mouse.pos.y = e.clientY / height;
      console.log('X ', e.clientX);
      
      mouse.pos.x = e.clientX;
      mouse.pos.y = e.clientY;
      mouse.move = true;
   };

   // draw line received from server
	socket.on('draw_line', (data) => {
      let line = data.line;
      context.beginPath();
      // context.moveTo(line[0].x * width, line[0].y * height);
      // context.lineTo(line[1].x * width, line[1].y * height);
      context.moveTo(line[0].x, line[0].y);
      context.lineTo(line[1].x, line[1].y);
      context.stroke();
   });
   
   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 1);
   }
   mainLoop();
});