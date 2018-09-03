# 前端面试题LazyMan实现、解析
最近看到一个LazyMan面试题比较有趣，也可以作为js基础的一个检测。

实现lazyMan可以考察
- Eventloop
- this指向问题
- js容错处理
- 逻辑思路


## LazyMan实现的效果
> 实现一个LazyMan，可以按照以下方式调用:  
LazyMan(“Hank”)输出:  
Hi! This is Hank!    
LazyMan(“Hank”).sleep(10).eat(“dinner”)
输出  Hi! This is Hank!  
//等待10秒..  
Wake up after 10  
Eat dinner~  
LazyMan(“Hank”).eat(“dinner”).eat(“supper”)
输出  Hi This is Hank!  
Eat dinner~  
Eat supper~  
LazyMan(“Hank”).sleepFirst(5).eat(“supper”)
//等待5秒  
输出  Wake up after 5  
输出  Hi This is Hank!  
输出  Eat supper  
以此类推。


## 实现思路
要实现LazyMan的功能其实也比较简单。
- 首先把LazyMan看作一个构造函数，LazyMan会创建一个实例对象
- 其次sleep和eat都是很明显的一个链式调用，我们只需要每个方法都返回LazyMan实例对象
- LazyMan实例对象中维护一个名为stack的数组和一个next函数。每次调用sleep/eat方法，都向stack中添加一个新的函数。每次调用next方法就从前取出stack中保存的函数并执行
- 当LazyMan实例化之后，使用setTimeout调用next方法。真正开始链式调用。


## LazyMan构造函数

下面我们来看看LazyMan的构造函数的代码
```
function LazyMan(name) {  
  //没有使用new关键字，我们需要做一定的容错处理  
  //确保一定会调用new LazyMan() 
  if (!(this instanceof LazyMan)) {  
    return new LazyMan(name)  
  }  
  //记录LazyMan的名字  
  this.name = name  
  //_stack数组中存放的就是具体需要执行方法（sleep/eat）  
  this._stack = [] 
  //_stack中加入打招呼语句，并调用next  
  var self = this  
  this._stack.push(function () {  
    console.log(`Hi This is ${self.name}`)  
	self.next()  
  }) 
  //next方法开启链式调用  
  //setTimeout是为了确保sleep/eat都已经push到_stack数组中了  
  setTimeout(() => {  
    this.next()  
  }, 0)  
}
```

## LazyMan原型对象

LazyMan的原型对象应该包括三个函数
- sleep
- eat
- next
```
LazyMan.prototype.eat = function (food) {  
 //因为function中this指向的问题  
 //我们需要用self指向LazyMan实例  
 let self = this  
 //将一个函数push到_stack数组中  
 //该函数只执行console和调用实例对象的next  
 this._stack.push(function () {  
    console.log(`Eat ${food}`)  
    self.next()  
  })  
  //return this可以实现链式调用  
  return this  
}  
  
//sleep方法与eat方法基本一样  
//唯一区别就是console和next方法需要延迟执行  
LazyMan.prototype.sleep = function (sec) {  
 let self = this  
 this._stack.push(function () {  
    setTimeout(function () {  
      console.log(`Wake up after ${sec}`)  
      self.next()  
    }, sec * 1000)  
  })  
  return this  
}  
  
LazyMan.prototype.next = function () {  
  //从数组前面取出function  
  let fn = this._stack.shift()  
  //如果function存在，则调用它  
  fn && fn()  
}
```
## 功能测试、思考

现在我们调用
```
LazyMan('Hank').sleep(5).eat('dinner')
输出  Hi! This is Hank  
//等待5秒..  
输出  Wake up after 5  
输出  Eat dinner~  
//注意！！以上代码是在node平台测试通过，浏览器可能不支持一些es6语法
```
到这里一个LazyMan的功能就实现了，但题目中的sleepFirst还没有完成。不过到这里大家应该都知道怎么实现sleepFirst功能了吧，sleepFirst就留待大家补充吧
