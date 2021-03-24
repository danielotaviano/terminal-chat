import http from 'http'
import { v4 as uuid } from 'uuid'
import { constants } from './constants.js'

export class SocketServer {
  constructor({ port }) {
    this.port = port
  }

  async initialize(eventEmitter) {
    const server = http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('hey there!!')
    })

    server.on('upgrade', (request, socket) => {
      socket.id = uuid()
      const headers = [
        'HTTP/1.1 101 Web Socket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        ''
      ].map(line => line.concat('\r\n')).join('')

      socket.write(headers)
      eventEmitter.emit(constants.event.NEW_USER_CONNECTED, socket)
    })

    return new Promise((resolve, reject) => {
      server.on('error', reject)
      server.listen(this.port, () => resolve(server))
    })

  }
}