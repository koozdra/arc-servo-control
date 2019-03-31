const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  // const led = new five.Led(13);
  // board.repl.inject({ led });

  const servos = new five.Servos([5, 6]);
  board.repl.inject({
    s: servos,
    move(x, y) {
      servos[0].to(x);
      servos[1].to(y);
    }
  });
});

// servo.to(90);
// servo.center();
// servo.min();
// servo.max();
// servo.sweep();

// led.off();
// led.on();
// led.blink();
// led.fadeIn();
// led.fadeOut();
//
// const socket = new WebSocket('ws:192.168.1.32:8999');
// socket.onopen = () => {
//   socket.send('Hello from the browser!');
// };
//
// const WebSocket = require('ws');
// const http = require('http');
// const express = require('express');
//
// const app = express();
// const server = http.createServer(app);
// const webSocketServer = new WebSocket.Server({ server });
//
// webSocketServer.on('connection', ws => {
//   ws.on('message', console.log);
// });
//
// app.use(express.static('static'));
//
// server.listen(8999, () => {
//   console.log(`server started on port ${server.address().port}`);
// });
// //
