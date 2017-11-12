## CSS知识点一

> ```<textarea></textarea>```标签
> - ```<textarea rows="" clos="" maxlength=""></textarea>```
> - ```textarea {-webkit-user-select: none;user-select:none;}```若是textarea标签加入这个style，在苹果手机不能进行文字输入。
> - 添加DOM事件，<br/> ```
addEventListener('input', function () { })```<br/>
```addEventListener('change', function () { })```<br/>
input指的是每次输入时，而change指的是textarea失去焦点时内容是否改变。
***
> DOM元素失去焦点
> -  ```<a><input>```标签具有焦点获取能力，但是如```<div>```标签必须加上 ```tabindex```这个属性才行。
> - ```tabindex```代表按tab键时页面捕获DOM元素的顺序，值越低优先级越高。
> - 当元素具有tabindex属性后，可通过原生js的两个函数去捕获是失去焦点。```dom.focus()```与```dom.blur()```
***
> H5动画```<transform /> <transition />```

