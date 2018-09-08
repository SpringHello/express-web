# 完全理解JavaScript闭包  
闭包是JavaScript的基础，也是很多初学JavaScript同学们比较迷惑的知识点。本文就用大白话加上例子来解释什么是闭包，以及为什么要用闭包。
  
  
## 一段简单的代码
```javascript
function A(){
	var a = 100;
	console.log(a)
}
A()
console.log(a)
```
在chrome浏览器执行结果如下
  ![chrome环境下执行结果](/img/menu.saveimg.savepath20180908111815.jpg)
  我们看到在function A 执行完成之后，var a 就消失不见了。这当然是理所应当的，函数执行完成之后，函数内部的变量当然应当被回收。
  但是，这并非绝对。看下面一段代码
```javascript
function A(){
	var a = 100;
	console.log(a)
	return function(){
		console.log(a)
	}
}
var B = A()  // A()返回了一个函数，注意A函数已经执行完成。本应该释放var a
B()			// 执行这个返回的函数
```
![闭包例子执行结果](/img/menu.saveimg.savepath20180908113405.jpg)
我们可以看到，在A函数执行完成之后返回了另一个函数。这里我要提醒大家注意两点
 - **A函数已经执行完成了，但是var a还是能在A返回的函数里访问到**
 - **除了B函数能访问到A函数内定义的var a，其它地方怎么也访问不了var a了**

**这就是闭包**
**这就是闭包**
**这就是闭包**
## 闭包很简单，但是TM到底有毛线用？
我们来看一个网上的前端笔试题
![js函数累加器](/img/menu.saveimg.savepath20180908114912.jpg)
看看闭包怎么实现该需求
```javascript
function add(){
	// add函数执行时，结果会存储在sum中
	var sum = 0
	// sum累加所有参数
	for(var i of arguments){
		sum += i
	}
	// _add函数，因为是在add函数中定义的，所以_add可以访问sum
	var _add = function(){
		for(var i of arguments){
			sum += i
		}
		// return 自身方便调用
		return _add	
	}
	// 覆盖toString方法，主要为了正确打印sum
	_add.toString = function(){
		return sum
	}
	// add 返回了_add内部定义的函数
	return _add
}
console.log(add(1))
console.log(add(1)(2))
console.log(add(1)(2)(3))
console.log(add(1)(2)(3)(4))
console.log(add(1,2)(3,4))
```
  ![js闭包实现累加器](/img/menu.saveimg.savepath20180908115923.jpg)
  看到这里大家应该了解了闭包的一个基本应用
  总结一下
  - add函数定义的sum变量记录累加器总和
  - 因为add函数返回了_add，所以add执行完成后sum不会释放
  - _add可以访问sum变量，并不断累加
## 不好意思，我做加法只用计算器
  
  什么？这个例子对你没用！
  那我们看看另一个例子（**闭包单例应用**）
> 我们在编写JavaScript的时候，有很多情况会用到单例模式，即只在第一次调用获取对象的方法时候使用new关键字创建一个新的对象。在对象已经生成之后在调用获取对象方法，都会返回第一次生成的那个对象

```javascript
// 函数A作为  
function A(){
	// 实例的构造函数，只有一个createTime属性
	function Instance(){
		this.createTime = new Date().getTime()
	}
	// 单例默认为null
	var instance = null
	return function getInstance(){
		// 如果单例为null，则构造一个新的实例
		if(instance==null){
			instance = new Instance()
		}
		// 返回单例
		return instance
	}
}

var getInstance = A()
var instance1 = getInstance()
var instance2 = getInstance()
console.log(instance1 === instance2)
```  
![闭包实现单例](/img/menu.saveimg.savepath20180908125145.jpg)
## 原理简单，要熟练掌握必须多写
  
闭包原理大家应该都明白了，但是实际工作中就是写不出来。这种情况就必须多看大牛们怎么写的，如**Express**中的获取路由**lazyrouter**方法就是经典的单例模式的运用

