### iframe
> iframe 在外部DOM层时无法获取iframe内部元素。
***
> iframe 通信
- 由iframe传递信息给父层DOM
假设在iframe中传递点击事件到父层，在iframe中可执行:
```window.onclick = function () {
  let data = {
    type: 'click'
  }
  console.log('iframe click')
  window.parent.postMessage(data, '*')
} 
```
在父层DOM执行：
```
window.addEventListener('message', function (e) {
        let type = e.data.type
        if (type === 'click') {
            // TODO
        }
      }, false)
```
即可。
