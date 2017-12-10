const net = require('net')
let connectionPool = {}
let index = 0
let clientId = uuid()
let server = net.createServer((connection) => {
	console.log('new client connected!')
	connection.setKeepAlive(false)
	connection.setEncoding('utf8')
	connection.on('data', (data) => { // 监听各个端的通信
		let jsonData = JSON.parse(data)
		if (jsonData && jsonData.type === 'id') { // 在connectionpool添加connection处理
			let clientId = jsonData.clientId
			if (!connectionPool[clientId]) {
				connectionPool[clientId] = connection
				index++
			}
		}
		if (jsonData && jsonData.type === 'sendMessage') { // 处理客户端发来的消息请求
			let target = jsonData.targetId
			let message = jsonData.message
			if (connectionPool[target]) {
				connectionPool[target].write(message)
			}
		}
		if (jsonData && jsonData.type === 'getServerConnections') { // 处理entryServer发来的查询连接数请求
			let clientId = jsonData.clientId
			if (!connectionPool[clientId]) {
				connectionPool[clientId] = connection
				index++
			}
			let connectionCount = server.getConnections((err, count) => {
				if (err) {
					console.log('err')
					return
				}
				if (connectionPool[clientId]) {
					let serverConnData = {
						type: 'serverConnection',
						count: count
					}
					connectionPool[clientId].write(JSON.stringify(serverConnData))
					connectionPool[clientId] = null
				}
			})
		}
	})
	connection.on('end', () => {
		console.log('clent connect end')
	})
	// connection.pipe(connection)
})

let portConnect = net.connect({port:5678}, () => { // 链接portServer查询当前server的port
	console.log('server connect portserver')
	let initData = {
		type: 'portQuery',
		clientId: clientId
	}
	portConnect.write(JSON.stringify(initData))
	portConnect.on('data', (data) => {
		let jsonData = JSON.parse(data)
		if (jsonData && jsonData.type === 'portQuery') {
			let serverPort = jsonData.serverPort
			server.listen(serverPort, () => {
				console.log('tcp server start @port', serverPort)
			})
			portConnect.destroy()
		}
	})
})

// 本地生成唯一uid
function uuid (a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16)
       : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

