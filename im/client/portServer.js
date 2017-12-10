const net = require('net')
const port = 5678
const serverArray = ['2345', '2346']
let portIndex = 0
let connectionPool = {}

let portServer = net.createServer((connection) => {
	console.log('new connection to portServer')
	connection.setKeepAlive(false)
	connection.setEncoding('utf8')
	connection.on('data', (data) => {
		let jsonData = JSON.parse(data)
		if (jsonData && jsonData.type === 'portQuery') { // 查询serverport
			let clientId = jsonData.clientId
			if (!connectionPool[clientId]) {
				connectionPool[clientId] = connection
				let portData = {
					type: 'portQuery',
					clientId: clientId,
					serverPort: serverArray[portIndex]
				}
				connectionPool[clientId].write(JSON.stringify(portData))
				portIndex++
			}
		}
	})
})

portServer.listen(port, () => {
	console.log('portserver start')
})