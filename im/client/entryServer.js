const net = require('net')
const async = require('async')
let connectionPool = {}
const serverArray = ['2345', '2346']
let serverConnectionCount = 999
let serverConnectionPort = 0
let clientId = uuid()
let server = net.createServer((connection) => {
	console.log('new client connected!')
	connection.setEncoding('utf8')
	connection.on('data', (data) => {
		let jsonData = JSON.parse(data)
		if (jsonData && jsonData.type === 'id') { // 在connectionpool添加connection处理
			let clientId = jsonData.clientId
			if (!connectionPool[clientId]) {
				connectionPool[clientId] = connection
				getNewPort(serverArray, clientId)
			}
		}
	})
	connection.on('end', () => {
		console.log('clent connect end')
	})
	// connection.pipe(connection)
})

function getNewPort (portArray, clientId) { // 获取空闲的server port
	let totalConne = portArray.length
	let index = 0
	serverConnectionCount = 999
	async.each(portArray, (port) => {
		console.log(port)
		let connection = net.connect({port: port}, () => {
			console.log('connect to handle server!')
			connection.setEncoding('utf8')
			let messageData = {
				type: 'getServerConnections',
				clientId: clientId
			}
			connection.write(JSON.stringify(messageData))
			connection.on('data', (data) => {
				let jsonData = JSON.parse(data)
				console.log('base',data)
				if (jsonData && jsonData.type === 'serverConnection') {
					let connectCount = parseInt(jsonData.count)
					console.log('connectCount', connectCount)
					if (connectCount < serverConnectionCount) {
						serverConnectionCount = connectCount
						serverConnectionPort = parseInt(port)
					}
					index++
					if (index === totalConne) {
						let serverConnectionData = {
							type: 'serverportforclient',
							serverConnectionPort: serverConnectionPort
						}
						connectionPool[clientId].write(JSON.stringify(serverConnectionData))
					}
					connection.destroy()
				}
			})
		})
	}, (err) => {
		if (err) {
			console.log('err', err)
		} else {
		}
	})
}

// 本地生成唯一uid
function uuid (a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16)
       : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

server.listen(3456, () => {
	console.log('tcp server start')
})
