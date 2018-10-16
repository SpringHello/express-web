# Express源码学习

Express作为一款优秀的基于node的web应用框架，其源码也是十份简洁、易读。在这里我们梳理一下Express整个框架和各个模块，加深对Express源码理解


## Express用法
我们都知道Express最简单的用法如下。启动express后，在浏览器中输入 localhost:3000 回车，页面就会显示 Hello World!
```javascript
const express = require('express')
const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
```
我们可以看到express是一个function，执行这个express会返回app这个对象。app这个对象还有get、use等一系列方法。那么我们看看源码中究竟怎么定义express的
```javascript
/**  
 * Expose `createApplication()`. */  
exports = module.exports = createApplication;  
/**  
 * Create an express application. * * @return {Function}  
 * @api public  
 */  
function createApplication() {  
  var app = function(req, res, next) {  
    app.handle(req, res, next);  
  };  
  mixin(app, EventEmitter.prototype, false);  
  mixin(app, proto, false);  
  // expose the prototype that will get set on requests  
  app.request = Object.create(req, {  
    app: { configurable: true, enumerable: true, writable: true, value: app }  
  })  
  // expose the prototype that will get set on responses  
  app.response = Object.create(res, {  
    app: { configurable: true, enumerable: true, writable: true, value: app }  
  })  
  app.init();  
  return app;  
}
```
源码中的createApplication就是express。我们可以清楚的看到，在createApplication中定义了一个app function。我们主要关注 mixin(app, proto, false); 这段代码，proto中的属性、方法被混合到了app中。
## application.js
var proto = require('./application');
我们找到application.js，这里我贴出几个常见的app方法
```javascript
app.init= function init(fn) {...};
app.lazyrouter= function lazyrouter(fn) {...};
app.handle = function handle(fn) {...};
app.route= function route(fn) {...};
app.use = function use(fn) {...};
...
```
我们看到了我们熟悉的use方法（使用中间件的时候调用）。但是找遍全文件也没发现get、post等方法，我们发现在文件中有一段代码
```javascript
methods.forEach(function(method){
  app[method] = function(path){
    if (method === 'get' && arguments.length === 1) {
      // app.get(setting)
      return this.set(path);
    }
    this.lazyrouter();
    var route = this._router.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});
```
methods其实就是包含get、post等其他方法的数组而已，通过forEach循环为app添加get、post方法罢了。并且调用了lazyrouter方法。
```javascript
app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });
    this.get('query parser fn')
    this._router.use(query(this.get('query parser fn')));
    this._router.use(middleware.init(this));
  }
};
```
当app中没有Router对象时，lazyrouter调用会生成一个Router对象。以后在调用lazyrouter就不会重复生成Router对象了。生成的router对象立马设置了两个中间件。第一个用于解析get方法的参数、另一个用于添加服务器信息（X-Powered-By : Express）
## Express中间件
express设置中间件的方法是app.use
app.use方法最终会调用app._router.use，我们看看下面的源码（去除了一部分参数处理代码）
```javascript
app.use = function use(fn) {
  ......
  var fns = flatten(slice.call(arguments, offset));
  if (fns.length === 0) {
    throw new TypeError('app.use() requires a middleware function')
  }
  // setup router
  this.lazyrouter();
  var router = this._router;
  fns.forEach(function (fn) {
    // non-express app
    if (!fn || !fn.handle || !fn.set) {
	  // 最终会其实是调用的router的use方法
      return router.use(path, fn);
    }
    ......
  }, this);
  return this;
};
```
我们继续跟踪router.use方法（我们同样删除了一些参数处理的代码）
```javascript
proto.use = function use(fn) {
  ......
  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i];
    // add the middleware
    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);
    // 这里需要特别注意
    // 中间件的layer的route属性是undefined
    // 这是与路由的layer的最大区别
    layer.route = undefined;
    this.stack.push(layer);
  }
  return this;
};
```
每一个中间件都会生成一个layer实例，并且按照先后顺序加入stack数组的尾部。当请求来临时，express会挨个从stack取出layer。如果取出的layer能够匹配，那么就会对该请求执行设置好的中间件函数。
## Express路由
上面我们了解了Express设置中间件。那么Express设置路由与中间件有什么区别呢？我们看看下面的代码
```javascript
methods.forEach(function(method){
  app[method] = function(path){
    if (method === 'get' && arguments.length === 1) {
      // app.get(setting)
      return this.set(path);
    }
    this.lazyrouter();
    var route = this._router.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});
```
当我们调用app.get时，express还是要保证router的存在所以调用了lazyrouter方法。但是与中间件不同的是。设置路由调用的是route方法，而非use方法。
我们继续跟踪route方法
```javascript
proto.route = function route(path) {
  var route = new Route(path);
  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));
  // 特别注意
  // 路由的layer的route属性是Route实例
  layer.route = route;
  this.stack.push(layer);
  return route;
};
```
我们发现route方法也生成了layer，并且也将layer添加到stack数组。唯一不通的是layer的route属性不再是undefined，而是Route实例。layer的构造函数中的最后一个参数也不再是路由传递的函数，而是route实例的dispatch（调度）函数。
## 相应请求
当设置好中间件和路由后，浏览器发送一个请求时。就会触发Express的一整套工作流程。最先相应请求的当然是app.handle方法，不过app.handle最终将任务交给router.handle方法
```javascript
app.handle = function handle(req, res, callback) {
  var router = this._router;
  // final handler
  var done = callback || finalhandler(req, res, {
    env: this.get('env'),
    onerror: logerror.bind(this)
  });
  // no routes
  if (!router) {
    debug('no routes defined on app');
    done();
    return;
  }
  // 主要工作都交给了router.handle
  router.handle(req, res, done);
};
```
我们看看router.handle做了什么工作（因为handle代码太长，我们同样省略了不少无关流程的代码。我们的重点放在next函数中）。next不断从stack中取出layer匹配并执行
```javascript
proto.handle = function handle(req, res, out) {
  // 当前layer的index
  var idx = 0;
  next();
  function next(err) {
    // stack中的layer已经匹配完了
    if (idx >= stack.length) {
      setImmediate(done, layerError);
      return;
    }
    // 匹配到的layer
    var layer;
    var match;
    var route;
    // 通过while循环不断匹配layer
    while (match !== true && idx < stack.length) {
	  // 从stack中取到下一个layer
      layer = stack[idx++];
      match = matchLayer(layer, path);
      route = layer.route;
      if (typeof match !== 'boolean') {
        // hold on to layerError
        layerError = layerError || match;
      }
      if (match !== true) {
        continue;
      }
      // route==undefined，证明这是一个中间件
      if (!route) {
        continue;
      }
      var method = req.method;
      var has_method = route._handles_method(method);
    }
    // no match
    if (match !== true) {
      return done(layerError);
    }
    // store route for dispatch on change
    if (route) {
      req.route = route;
    }
    // Capture one-time layer values
    req.params = self.mergeParams
      ? mergeParams(layer.params, parentParams)
      : layer.params;
    var layerPath = layer.path;
    // this should be done for the layer
    self.process_params(layer, paramcalled, req, res, function (err) {
      if (err) {
        return next(layerError || err);
      }
      if (route) {
        return layer.handle_request(req, res, next);
      }
      trim_prefix(layer, layerError, layerPath, path);
    });
  }
};
```
## 总结

Express本身短小精简，中间件机制提供了灵活的可扩展型。Express生态中丰富的中间件为Express提供了强大的支持。Express确实是node平台下的一款十分优秀的web开发框架
