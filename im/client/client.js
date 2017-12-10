const net = require('net')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

let stdinData = ''
let clientId = uuid()
let port = '0'

let clientConnection = net.connect({port: 3456}, () => { // 连entry接服务端
	console.log('connect to entryserver!')
	console.log('clientId:', clientId)
	clientConnection.setEncoding('utf8')
	let initData = {
		type: 'id',
		clientId: clientId
	}
	clientConnection.write(JSON.stringify(initData))
	// clientConnection.end()
})
function onLineStd (connection) {
	rl.on('line', (input) => { // 监听输入
		stdinData = input
		if (stdinData.indexOf('message') !== -1) {
			let targetId = stdinData.split(':') // TODO message:[targetid] 形式给目标id的client发招呼
			let messageData = {
				type: 'sendMessage',
				targetId: targetId[1],
				message: 'hello'
			}
			connection.write(JSON.stringify(messageData))
		}
	})	
}

// 本地生成唯一uid
function uuid (a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16)
       : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

clientConnection.on('data', (data) => { // 监听数据
	let jsonData = JSON.parse(data)
	console.log('data',jsonData)
	if (jsonData && jsonData.type === 'serverportforclient') {
		port = jsonData.serverConnectionPort
		let connection = net.connect({port: parseInt(port)}, () => { // 连接server服务端
			console.log('connect to server @port', port)
			let initData = {
				type: 'id',
				clientId: clientId
			}
			connection.write(JSON.stringify(initData))
			onLineStd(connection)
		})
		clientConnection.destroy()
	}
})