# JavaScript数据类型
程序运行都是需要数据的，比如用于数学计算的数字、页面展示的文本等等其它的数据。

JavaScript数据类型分为两类
- 原始类型（primitive type）
- 对象类型（object type）

原始类型数据包括
- 数字 （Number）
- 字符串 （String）
- 布尔值 （Boolean）
- null
- undefined

除了以上五种数据类型，其他的都是对象类型
- 普通对象
- 特殊对象（数组）
- 特殊对象（函数）

## 数字

```
10         //正整数
-10        //负数
3.14       //小数
6.02e23    //6.02×10^23
NaN        //不是个数字（Not a Number）  Number('hello')可以得到NaN
Infinity   //无穷大  可以添加正负号  1/0 可以得到 Infinity
0xff       //16进制数字   0xff 等于 255
```
以上举例都是数字类型对象，数字之间的常用算法有
```
+ （加）  - （减）  * （乘）  / （除）  % （取余）
```
这里我们贴出一些JavaScript中特殊的数字类型运算

![enter image description here](http://localhost:3000/img/menu.saveimg.savepath20180830145157.jpg)

总结一下：
- NaN不管和谁做运算都会得到NaN
- Infinity + Infinity 还是（Infinity）无限大
- Infinity - Infinity = NaN （无限大 - 无限大 != 0 哦）

## 字符串
```
“”              //空字符串
”hello”		    //字符串 hello
“3.14”		    //字符串 3.14 跟数字3.14是不同的
‘3.14‘		    //字符串也可以使用单引号
“hello”.length  //字符串有代表长度的length属性   这里length==5
“a” + “b”       //字符串相加可以拼接字符串        “ab”
“a” + 1         //字符串与数字相加会把数字当作字符串 “a1” 
```
字符串是JavaScript中最常见的类型之一，字符串还有很多方法可以调用。这部分内容后期我们会统一介绍

## 布尔值
生活中除了数字和字符串，还有一类代表真假的常量
比如 1>2 （假）、地球是圆的（真）
布尔值只有两个
- true   （真）
- false  （假）

if语句是条件判断语句。当if语句中表达式为true，那么就会执行if后面的的语句
```
if(true){
	//‘true是真值，所以我执行了‘   会打印到控制台
	console.log('true是真值，所以我执行了')
}

if(false){
	//‘false是假值，所以不会执行‘   不会打印到控制台
	console.log('false是假值，所以不会执行')
}
```

除了false，JavaScript还会把 0、NaN、"" 、null、undefined当作假值处理
```
if(0){
	console.log('0是假值，所以不会打印')
}
```
## 普通对象

那么到底什么是对象类型呢，普通对象一般都是无序属性的集合。比如
下面一个对象描述了一个人的信息
```
{
  //名字Hank
  name:'Hank',
  //年龄19
  age:19,
  //宠物是一个叫布鲁托的狗
  pet:{
	name:'Pluto',
	breed:'dog'
  }
}
```
## 数组
数组表示一组数据的集合，数组中每一个元素可以是任意类型
```
[1,2,3,4]			//这个数组中是数字
['a','b']			//这个数组中是字符串
[1,'a']				//这个数组既有数字也有字符串
[1,2,3].length		//与字符串类似，数组的length属性代表数组中元素的个数
[{name:'Hank',age:19}]  //数组也可包含对象
```
## 函数
函数是一类特殊的对象，我们将在后面章节单独讨论。
