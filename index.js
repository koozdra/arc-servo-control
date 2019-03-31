const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const five = require('johnny-five');
const { curry } = require('lodash/fp');

const app = express();
const board = new five.Board();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

// const bound = curry((min, max, value) => Math.min(max, Math.max(value, min)));
// const mapIntoRange = curry(
//   (sourceMin, sourceMax, targetMin, targetMax, value) => {
//     const domain = sourceMax - sourceMin;
//     const range = targetMax - targetMin;
//     const normalizedValue = value - sourceMin;
//
//     return targetMin + normalizedValue / domain * range;
//   }
// );

// const upFacingBound = bound(-90, 90);

board.on('ready', () => {
  const servos = new five.Servos([12, 13]);

  board.repl.inject({ s: servos });

  webSocketServer.on('connection', ws => {
    ws.on('message', message => {
      function safeJSONParse(str) {
        try {
          return JSON.parse(str);
        } catch (e) {
          return undefined;
        }
      }

      const { x: roll, y: pitch } = safeJSONParse(message) || { x: 0, y: 0 };
      //
      console.log(roll, pitch);
      // console.log(message);

      // const rollServoValue = mapIntoRange(-90, 90, 0, 180, upFacingBound(roll));
      // const pitchServoValue = mapIntoRange(
      //   -90,
      //   90,
      //   0,
      //   180,
      //   upFacingBound(pitch)
      // );

      // console.log(
      //   upFacingBound(roll),
      //   ' -> ',
      //   Math.round(rollServoValue),
      //   upFacingBound(pitch),
      //   ', -> ',
      //   Math.round(pitchServoValue)
      // );

      servos[0].to(Math.round(180 * roll));
      servos[1].to(Math.round(180 * pitch));
    });
  });
});

app.use(express.static('static'));

server.listen(8999, () => {
  console.log(`server started on port ${server.address().port}`);
});
