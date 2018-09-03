/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : express-web

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2018-09-03 16:44:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `aid` varchar(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `read` int(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `artType` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('44a68528-2549-4754-9e47-2791d09883e7', '前端面试题LazyMan实现、解析', 'sugar', '2018-08-29 14:37:56', '140', '前端', 'home');
INSERT INTO `article` VALUES ('44a68528-2549-4754-9e47-2791d09883e8', 'JavaScript简介', 'sugar', '2018-08-30 18:14:28', '122', 'JS', 'javascript');
INSERT INTO `article` VALUES ('44a68528-2549-4754-9e47-2791d09883e9', 'JavaScript数据类型', 'usgar', '2018-08-31 17:43:07', '24', 'JS', 'javascript');

-- ----------------------------
-- Table structure for content
-- ----------------------------
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `aid` varchar(36) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of content
-- ----------------------------
INSERT INTO `content` VALUES ('44a68528-2549-4754-9e47-2791d09883e7', '<h1 id=\"前端面试题lazyman实现、解析\">前端面试题LazyMan实现、解析</h1>\n<p>最近看到一个LazyMan面试题比较有趣，也可以作为js基础的一个检测。</p>\n<p>实现lazyMan可以考察</p>\n<ul>\n<li>Eventloop</li>\n<li>this指向问题</li>\n<li>js容错处理</li>\n<li>逻辑思路</li>\n</ul>\n<h2 id=\"lazyman实现的效果\">LazyMan实现的效果</h2>\n<blockquote>\n<p>实现一个LazyMan，可以按照以下方式调用:<br>\nLazyMan(“Hank”)输出:<br>\nHi! This is Hank!<br>\nLazyMan(“Hank”).sleep(10).eat(“dinner”)<br>\n输出  Hi! This is Hank!<br>\n//等待10秒…<br>\nWake up after 10<br>\nEat dinner~<br>\nLazyMan(“Hank”).eat(“dinner”).eat(“supper”)<br>\n输出  Hi This is Hank!<br>\nEat dinner~<br>\nEat supper~<br>\nLazyMan(“Hank”).sleepFirst(5).eat(“supper”)<br>\n//等待5秒<br>\n输出  Wake up after 5<br>\n输出  Hi This is Hank!<br>\n输出  Eat supper<br>\n以此类推。</p>\n</blockquote>\n<h2 id=\"实现思路\">实现思路</h2>\n<p>要实现LazyMan的功能其实也比较简单。</p>\n<ul>\n<li>首先把LazyMan看作一个构造函数，LazyMan会创建一个实例对象</li>\n<li>其次sleep和eat都是很明显的一个链式调用，我们只需要每个方法都返回LazyMan实例对象</li>\n<li>LazyMan实例对象中维护一个名为stack的数组和一个next函数。每次调用sleep/eat方法，都向stack中添加一个新的函数。每次调用next方法就从前取出stack中保存的函数并执行</li>\n<li>当LazyMan实例化之后，使用setTimeout调用next方法。真正开始链式调用。</li>\n</ul>\n<h2 id=\"lazyman构造函数\">LazyMan构造函数</h2>\n<p>下面我们来看看LazyMan的构造函数的代码</p>\n<pre><code>function LazyMan(name) {  \n  //没有使用new关键字，我们需要做一定的容错处理  \n  //确保一定会调用new LazyMan() \n  if (!(this instanceof LazyMan)) {  \n    return new LazyMan(name)  \n  }  \n  //记录LazyMan的名字  \n  this.name = name  \n  //_stack数组中存放的就是具体需要执行方法（sleep/eat）  \n  this._stack = [] \n  //_stack中加入打招呼语句，并调用next  \n  var self = this  \n  this._stack.push(function () {  \n    console.log(`Hi This is ${self.name}`)  \n	self.next()  \n  }) \n  //next方法开启链式调用  \n  //setTimeout是为了确保sleep/eat都已经push到_stack数组中了  \n  setTimeout(() =&gt; {  \n    this.next()  \n  }, 0)  \n}\n</code></pre>\n<h2 id=\"lazyman原型对象\">LazyMan原型对象</h2>\n<p>LazyMan的原型对象应该包括三个函数</p>\n<ul>\n<li>sleep</li>\n<li>eat</li>\n<li>next</li>\n</ul>\n<pre><code>LazyMan.prototype.eat = function (food) {  \n //因为function中this指向的问题  \n //我们需要用self指向LazyMan实例  \n let self = this  \n //将一个函数push到_stack数组中  \n //该函数只执行console和调用实例对象的next  \n this._stack.push(function () {  \n    console.log(`Eat ${food}`)  \n    self.next()  \n  })  \n  //return this可以实现链式调用  \n  return this  \n}  \n  \n//sleep方法与eat方法基本一样  \n//唯一区别就是console和next方法需要延迟执行  \nLazyMan.prototype.sleep = function (sec) {  \n let self = this  \n this._stack.push(function () {  \n    setTimeout(function () {  \n      console.log(`Wake up after ${sec}`)  \n      self.next()  \n    }, sec * 1000)  \n  })  \n  return this  \n}  \n  \nLazyMan.prototype.next = function () {  \n  //从数组前面取出function  \n  let fn = this._stack.shift()  \n  //如果function存在，则调用它  \n  fn &amp;&amp; fn()  \n}\n</code></pre>\n<h2 id=\"功能测试、思考\">功能测试、思考</h2>\n<p>现在我们调用</p>\n<pre><code>LazyMan(\'Hank\').sleep(5).eat(\'dinner\')\n输出  Hi! This is Hank  \n//等待5秒..  \n输出  Wake up after 5  \n输出  Eat dinner~  \n//注意！！以上代码是在node平台测试通过，浏览器可能不支持一些es6语法\n</code></pre>\n<p>到这里一个LazyMan的功能就实现了，但题目中的sleepFirst还没有完成。不过到这里大家应该都知道怎么实现sleepFirst功能了吧，sleepFirst就留待大家补充吧</p>');
INSERT INTO `content` VALUES ('44a68528-2549-4754-9e47-2791d09883e8', '<h1 id=\"javascript简介\">JavaScript简介</h1>\n<p>网络上关于JavaScript的介绍挺多的，我们这里就不重复这些介绍了。这里我贴出《JavaScript权威指南》关于JavaScript的介绍，并对其中一些重要的部分做出解释。</p>\n<h2 id=\"javascript是什么？\">JavaScript是什么？</h2>\n<blockquote>\n<p>JavaScript 是面向 <strong>Web 的编程语言</strong>，绝大多数现代网站都使用了 JavaScript，并且所有的现代 Web 浏览器（电脑，手机，平板）均包含了 JavaScript 解释器。 这使得 JavaScript 能够称得上史上使用最广泛的编程语言。 <strong>JavaScript 也是前端开发工程师必须掌握的三种技能之一</strong>：描述网页内容的 HTML、描述网页样式的 CSS、以及描述网页行为的 JavaScript。------《JavaScript权威指南》</p>\n</blockquote>\n<p>从《JavaScript权威指南》中我们可以大概了解到JavaScript是编写web网页的编程语言（node的出现让JavaScript可以从事服务端编程，极大的增加了JavaScript这门语言的想象力）。JavaScript几乎垄断了浏览器开发语言，这也造成了JavaScript 是前端开发工程师必须掌握的三种技能之一。</p>\n<h2 id=\"javascript与ecmascript关系\">JavaScript与ECMAScript关系</h2>\n<p>可能有读者经常听到ECMAScript这个词，但它跟JavaScript有什么关系呢？</p>\n<p>这里我做一个不太恰当的比喻</p>\n<ul>\n<li>JavaScript解释器比喻成一辆车</li>\n</ul>\n<p>没有ECMAScript之前是什么状况呢？每个工厂生成出来的车（chrome、IE、Firefox…）都不一样。这样做可苦了开车的人（前端程序员）。你必须要了解市面上所有车，你才能说你是个好司机（也许你的代码在chrome下正常运行、但IE下会报错），做大量的容错处理、客户端检测。<br>\nECMAScript的出现就是为了解决这个问题的。</p>\n<ul>\n<li>ECMAScript比喻成车的设计图</li>\n</ul>\n<p>有了车的设计图之后，工厂就不会随心所欲生产各式各样的汽车了。大家统一按照设计图生产。这样司机只要会开一种车，其他车都能开。</p>\n<p>看到这里你大概了解了它们之间的关系，总结一下：</p>\n<ul>\n<li>ECNAScript是标准、JavaScript是实现</li>\n</ul>\n<h2 id=\"java和javascript什么关系？\">Java和JavaScript什么关系？</h2>\n<p>Java和JavaScript的关系就像</p>\n<ul>\n<li>雷锋和雷峰塔的关系</li>\n<li>老婆和老婆饼的关系</li>\n<li>总结：Java和JavaScript没有半毛钱关系（除了名字都有Java）</li>\n</ul>\n<h2 id=\"javascript难么？\">JavaScript难么？</h2>\n<p>个人认为JavaScript算是比较好入门的语言。基本不用搭建环境，有个记事本和浏览器就行（不知道有多少自学Java的连开发环境都没搭建成功就放弃了）。JavaScript编程容易看到自己编程的成果，满足自己的成就感，也就更容易坚持下去。</p>\n<p>总之，兴趣和成就感能够让你更加有东西去学习这门语言，所以尽量保持对学习的兴趣。以下的课程我们也尽量从实用角度来讲解知识点，尽量避免大家产生“这个知识点有什么用？”这种想法。</p>\n<p>重要的话说三遍</p>\n<ul>\n<li>兴趣是最好的老师</li>\n<li>兴趣是最好的老师</li>\n<li>兴趣是最好的老师</li>\n</ul>');
INSERT INTO `content` VALUES ('44a68528-2549-4754-9e47-2791d09883e9', '<h1 id=\"javascript数据类型\">JavaScript数据类型</h1>\n<p>程序运行都是需要数据的，比如用于数学计算的数字、页面展示的文本等等其它的数据。</p>\n<p>JavaScript数据类型分为两类</p>\n<ul>\n<li>原始类型（primitive type）</li>\n<li>对象类型（object type）</li>\n</ul>\n<p>原始类型数据包括</p>\n<ul>\n<li>数字 （Number）</li>\n<li>字符串 （String）</li>\n<li>布尔值 （Boolean）</li>\n<li>null</li>\n<li>undefined</li>\n</ul>\n<p>除了以上五种数据类型，其他的都是对象类型</p>\n<ul>\n<li>普通对象</li>\n<li>特殊对象（数组）</li>\n<li>特殊对象（函数）</li>\n</ul>\n<h2 id=\"数字\">数字</h2>\n<pre><code>10         //正整数\n-10        //负数\n3.14       //小数\n6.02e23    //6.02×10^23\nNaN        //不是个数字（Not a Number）  Number(\'hello\')可以得到NaN\nInfinity   //无穷大  可以添加正负号  1/0 可以得到 Infinity\n0xff       //16进制数字   0xff 等于 255\n</code></pre>\n<p>以上举例都是数字类型对象，数字之间的常用算法有</p>\n<pre><code>+ （加）  - （减）  * （乘）  / （除）  % （取余）\n</code></pre>\n<p>这里我们贴出一些JavaScript中特殊的数字类型运算</p>\n<p><img src=\"http://localhost:3000/img/menu.saveimg.savepath20180830145157.jpg\" alt=\"enter image description here\"></p>\n<p>总结一下：</p>\n<ul>\n<li>NaN不管和谁做运算都会得到NaN</li>\n<li>Infinity + Infinity 还是（Infinity）无限大</li>\n<li>Infinity - Infinity = NaN （无限大 - 无限大 != 0 哦）</li>\n</ul>\n<h2 id=\"字符串\">字符串</h2>\n<pre><code>“”              //空字符串\n”hello”		    //字符串 hello\n“3.14”		    //字符串 3.14 跟数字3.14是不同的\n‘3.14‘		    //字符串也可以使用单引号\n“hello”.length  //字符串有代表长度的length属性   这里length==5\n“a” + “b”       //字符串相加可以拼接字符串        “ab”\n“a” + 1         //字符串与数字相加会把数字当作字符串 “a1” \n</code></pre>\n<p>字符串是JavaScript中最常见的类型之一，字符串还有很多方法可以调用。这部分内容后期我们会统一介绍</p>\n<h2 id=\"布尔值\">布尔值</h2>\n<p>生活中除了数字和字符串，还有一类代表真假的常量<br>\n比如 1&gt;2 （假）、地球是圆的（真）<br>\n布尔值只有两个</p>\n<ul>\n<li>true   （真）</li>\n<li>false  （假）</li>\n</ul>\n<p>if语句是条件判断语句。当if语句中表达式为true，那么就会执行if后面的的语句</p>\n<pre><code>if(true){\n	//‘true是真值，所以我执行了‘   会打印到控制台\n	console.log(\'true是真值，所以我执行了\')\n}\n\nif(false){\n	//‘false是假值，所以不会执行‘   不会打印到控制台\n	console.log(\'false是假值，所以不会执行\')\n}\n</code></pre>\n<p>除了false，JavaScript还会把 0、NaN、\"\" 、null、undefined当作假值处理</p>\n<pre><code>if(0){\n	console.log(\'0是假值，所以不会打印\')\n}\n</code></pre>\n<h2 id=\"普通对象\">普通对象</h2>\n<p>那么到底什么是对象类型呢，普通对象一般都是无序属性的集合。比如<br>\n下面一个对象描述了一个人的信息</p>\n<pre><code>{\n  //名字Hank\n  name:\'Hank\',\n  //年龄19\n  age:19,\n  //宠物是一个叫布鲁托的狗\n  pet:{\n	name:\'Pluto\',\n	breed:\'dog\'\n  }\n}\n</code></pre>\n<h2 id=\"数组\">数组</h2>\n<p>数组表示一组数据的集合，数组中每一个元素可以是任意类型</p>\n<pre><code>[1,2,3,4]			//这个数组中是数字\n[\'a\',\'b\']			//这个数组中是字符串\n[1,\'a\']				//这个数组既有数字也有字符串\n[1,2,3].length		//与字符串类似，数组的length属性代表数组中元素的个数\n[{name:\'Hank\',age:19}]  //数组也可包含对象\n</code></pre>\n<h2 id=\"函数\">函数</h2>\n<p>函数是一类特殊的对象，我们将在后面章节单独讨论。</p>');
