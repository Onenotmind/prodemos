### js
***
> e.target
js通过 ``` e.target``` 属性可以获取页面操作的相关信息。
如：``` e.target.className ``` 获取点击的DOM的class <br/>
``` e.target.tagName ``` 获取点击的DOM的tag
***
> textarea处理中文输入的解决方案.
```
let cplock = false
el.addEventListener('input', function () {
    if (cpLock) return
    handleInputFun(el.value)
  })
el.addEventListener('compositionstart', function () {
    cpLock = true
})
el.addEventListener('compositionend', function () {
    cpLock = false
    handleInputFun(el.value)
})
```