---
title: Proxy元编程
---
目录：
[[toc]]


## 1️⃣ 概览（Overview）

代理使我们可以对对象操作（比如获取属性时）进行拦截和自定义操作，这便是 *元编程* 的功能。

下面示例中：

- `proxy` 是一个空对象
- `handler` 通过实现特定的方法能拦截对 `proxy` 执行的操作
- 如果 `handler` 没有拦截某个操作，则会转发到 `target` 上

下面只对 `get` 操作（获取对象属性）进行拦截：

```js {6-9}
const logged = []

const target = { size: 0 }

const handler = {
  get(target, propKey, receiver) {
    logged.push('GET ' + propKey)
    return 123
  }
}

const proxy = new Proxy(target, handler)
```

当我们访问属性 `proxy.size`, handler会拦截该操作：

```js
assert.equal(proxy, 123)

assert.deepEqual(logged, ['GET size'])
```

下面的 [API 参考指南部分](#7) 列举出所有可拦截的操作。




## 2️⃣ 编程 vs 元编程

在我们深入Proxies之前，我们需要先理解什么是 *元编程*。

👩🏻‍🏫 在编程中，存在级别：

- **基础级别**（base level），也称为应用级别，即代码用于处理用户输入
- **元级别**（meta level）,即处理基础级别代码的代码

基础和元级别可以是不同的语言，下面的元编程中，元编程语言是JS，基础级别编程语言是Java:

```js
const str = 'Hello ' + '!'.repeat(3)
console.log('System.out.println("' + str +'")')
```

元编程也可以采用不同形式。上面例子，我们将Java代码打印到控制台。下面我们用JS语言当做基础语言和元编程语言。经典的例子是 [eval()函数](https://exploringjs.com/impatient-js/ch_callables.html#eval), **可以让我们动态的计算和编译JS**。下面例子我们计算 `5+2` 表达式：

```js
eval('5 + 2')

// 7
```

JS中的某些操作可能看起来不像元编程，但实际它们是的😂，如果我们靠近一点看：

```js {1,8}
// 基础级别
const obj = {
  hello() {
    console.log('Hello!')
  }
}

// 元级别
for (const key of Object.keys(obj)) {
  console.log(key)
}
```

程序会在其运行时检测自己的结构。这看起来不太像元编程，因为在JS中编程结构和数据结构的界限是模糊的。

::: tip
👩🏻‍🏫 **所有的 `Object.*` 方法都可以认为是元编程功能** 🤩。
:::


### 2.1 元编程的种类

反射性元编程意味着程序能够处理自身，[Kiczales  et al.](https://exploringjs.com/deep-js/ch_proxies.html#further-reading-proxies) 将其划分为3种类型 的元编程👩🏻‍🏫：

1. **自省（`Introspection`）**: 我们对程序结构有只读性访问权
2. **自我修改（`self-modification`）**：我们可以改变程序结构
3. **代踌（`Intercession`）**：我们可以重新定义语言操作的语义

来看看例子：

🌰 **示例 - 自省**： `Object.keys()` 执行自省操作（看上面的例子）

🌰 **示例 - 自我修改**：下面 `moveProperty` 函数将某个属性从source移到target。函数通过用于属性访问的方括号操作符， 赋值操作符和 `delete` 操作符执行自我修改。（在生产性代码中，我们可能只使用 [property descriptors](https://exploringjs.com/deep-js/ch_property-attributes-intro.html#property-descriptors) 完成这个任务）：

```js
function moveProperty(source, propertyName, target) {
  target[propertyName] = source[propertyName]
  delete source[propertyName]
}
```

使用：

```js
const obj1 = { color: 'blue' }
const obj2 = {}

moveProperty(obj1, 'color', obj2)

assert.deepEqual(obj1, {})
assert.deepEqual(obj2, { color: 'blue' })
```

ES5是不支持代踌的，因此 `Proxies` 便被创造出来来填补这个空缺🎉。



## 3️⃣ ⭐代理解释

代理给JS语言带来了代踌。工作原理如下。我们可以对对象 `obj` 执行很多操作，比如：

- 通过 `obj.prop` 获取 `obj` 上的属性 `prop`
- 通过 `prop in obj` 来检测对象 `obj` 是否存在 `prop` 属性

👩🏻‍🏫 `Proxies` 是允许我们自定义这些操作的特殊对象😎，代理使用2个参数进行构造：

1. `handler`：对某个操作，如果定义了handler，该handler中对该操作都有一个相对应的方法。*对操作拦截（在到达target路上拦截）的方法我们称之为 `trap`(陷阱)*， `trap`（陷阱或捕获）这个专业名词来自于操作系统
2. `target`：如果handler没有拦截某个操作，则该操作直接作用于目标对象（target）上。即，target充当了handler的fallback。以某种方式代理对目标对象进行了包装。

::: warning
`intercession` 的动词形式是 `to intercede`。 `Interceding` 内在是双向的，而拦截（`Intercepting`）本质上是单向的。
:::



### 3.1 一个示例

下面示例中，handler拦截 `get & has` 操作:

```js {5,10}
const logged = []

const target = {}
const handler = {
  // 拦截属性的访问
  get(target, propKey, receiver) {
    logged.push(`GET ${propKey}`)
    return 123
  },
  // 拦截，属性是否存在 xx in obj
  has(target, propKey) {
    logged.push(`HAS ${propKey}`)
    return true
  }
}

const proxy = new Proxy(target, handler)
```

如果我们访问属性（行`A`操作）或者使用 `in` 操作符(行`B`操作)，handler会拦截这些操作：

```js
assert.equal(proxy.age, 123) // A
assert.equal('hello' in proxy, true) // B

assert.deepEqual(
  logged,
  ['GET age', 'HAS hello']
)
```

上面handler没有实现 `set`  陷阱（trap）（即设置属性），因此设置 `proxy.age` 会转发到 `target` 上，最终 `target.age` 会被设置：

```js
proxy.age = 99
assert.equal(target.age, 99)
```


### 3.2 ⭐ 函数专有的陷阱

如果target是一个函数，则有2个额外的操作可以被拦截😎：

1. `apply`: 调用函数，通过以下方式触发：
   - `proxy(...)`
   - `proxy.call(...)`
   - `proxy.apply(...)`
2. `construct`：调用构造函数，通过以下方式触发这个陷阱：
   - `new proxy(...)`

这2个traps只针对函数targets的原因很简单：否则我们不能转发 `apply` & `construct` 操作。



### 3.3 拦截方法调用

我们希望通过Proxy拦截方法调用，我们将面临一个挑战 😭: 
::: tip
不存在针对方法调用的trap。反之，一个方法调用可以被视作为2个连续的操作：
:::

1. `get` 操作获取函数
2. `apply` 操作调用获取的函数

因此，如果我们想要拦截方法调用，我们必须拦截2个操作：

1. 拦截 `get` 操作，并返回一个函数
2. 拦截该函数的调用

🌰：

```js
const traced = []

function traceMehodCalls(obj) {
  const handler = {
    get(target, propKey, receiver) {
      // 原方法
      const origMethod = target[propKey]
      return function (...args) { // 包含隐式的 this 参数
        const result = origMethod.apply(this, args)
        traced.push(propKey + JSON.stringify(args)
          + ' -> ' + 'JSON.stringify(result)')
        return result
      }
    }
  }
  return new Proxy(obj, handler)
}
```

我们没有对第2次拦截使用Proxy，只是简单将原始方法包装在一个函数中。

调用：

```js
const obj = {
  multiply(x, y) {
    return x * y
  },
  squared(x) {
    return this.multiply(x, x)
  }
}

const trackedObj = traceMehodCalls(obj)

assert.equal(trackedObj.squared(9), 81)

assert.deepEqual(
  traced,
  ['multiply[9,9] -> 81', 'squared[9] -> 81']
)
```

即使 `this.multiply` 是在 `obj.squared()` 方法内也被追踪了。这是因为 `this` 保持对该proxy的引用。
::: warning
这不是最高效的解决方案。例如，我们可以缓存函数。另外，**代理本身就对性能有一定的影响😮‍💨**。
:::


### 3.4 ⭐ 可撤销的代理

**代理是可以被撤销的（关闭代理）🤩**：

```js
const { proxy, revoke } = Proxy.revocable(target, handler)
```

在我们首次调用 `revoke()` 方法后，任何作用于该 `proxy` 的操作都会抛出 `TypeError` 。后续再调用 `revoke` 没有任何效果。

```js {1,4,8-9,15}
// proxy表现得就像是 target 对象
proxy.city = 'Pairs'
assert.equal(proxy.city, 'Pairs')

// 吊销
revoke()

// 抛出TypeError
// 不能对已吊销的proxy执行 ’get’ 操作
assert.throws(
  () => proxy.prop,
  /^TypeError: Cannot perform 'get' on a proxy that has been revoked$/
)

// typeof不会抛出错误（译者注）
typeof proxy
```



### 3.5 代理作为原型

一个代理的 `proto` 可以作为一个对象 `obj` 的原型。**起始于 `obj` 的某个操作可能在 `proto` 中继续**。比如 `get` 就是这样的一个操作：

```js {8-9}
const proto = new Proxy({}, {
  get(target, propKey, receiver) {
    console.log('GET ' + propKey)
    return target[propKey]
  }
})

// obj继承自proto, 而proto是一个proxy， 
// 其handler对 get 操作进行捕获
const obj = Object.create(proto)
obj.weight

// 打印
// ‘GET weight’
```

💡 在对象 `obj` 中找不到 `weight` 属性，因此搜索会延续到 `proto` 中，因此 `get` 陷阱被触发。有更多的操作会影响原型链，会在最后列举出来这些操作。



### 3.6 转发拦截的操作
::: tip
👩🏻‍🏫 **那些在handler中没有实现的traps会自动转发到 `target` 上**。
:::
有时在转发某个操作的同时，我们想执行相关某些任务。比如，拦截和记录所有的操作，而不阻止它们到达目标对象：

```js
const handler = {
  deleteProperty(target, propKey) {
    console.log('DELETE ' + propKey)
    return delete target[propKey]
  },
  has(target, propKey) {
    console.log('HAS ' + propKey)
    return propKey in target
  }
  // 其它traps类似
}
```

> 使用 Reflect.* 提升写法

对每个trap，对于每一个操作，我们都记录它，然后手动转发它。**JS中存在类似模块一样的对象 `Reflect` 能帮助我们转发 🎉**

对于每个trap：

```js
handler.trap(target, arg_1, ..., arg_n)
```

Reflect都有对应的方法：

```js
Reflect.trap(target, arg_1, ..., arg_n)
```

如果上面的例子我们使用 `Reflect`：

```js
const handler = {
  deleteProperty(target, propKey) {
    console.log('DELETE ' + propKey)
    return Reflect.deleteProperty(target, propKey)
  },
  has(target, propKey) {
    console.log('HAS ' + propKey)
    return Reflect.has(target, propKey)
  }
  // 其它traps类似
}
```



> ⭐ handler使用proxy提升写法

既然每个traps所做的都类似，那么我们可以通过一个代理实现上面的handler:😎

```js {3,6-7}
const handler = new Proxy({}, {
  get(target, trapName, receiver) {
    // 返回handler的方法名 trapName
    return (...args) => {
      console.log(trapName.toUpperCase() + ' ' + args[1])
      // 转发操作
      return Reflect[trapName](...args)
    }
  }
})
```

对于每个trap，代理会通过 `get` 操作询问handler方法，然后我们给它一个trap。 *即，所有的handler方法都可以通过单一的元方法 `get` 实现😎*。这也是代理API的一个目标，使这种虚拟化变得简单。

下面我们使用这种基于代理的handler：

```js {2}
const target = {}
const proxy = new Proxy(target, handler)

proxy.distance = 450 // set trap
assert.equal(proxy.distance, 450) // get trap

// set 操作正确转发到target了吗？
assert.equal(target.distance, 450)

// 输出
// 'SET distance'
// 'GETOWNPROPERTYDESCRIPTOR distance'
// 'DEFINEPROPERTY distance'
// 'GET distance'
```



### 3.7 ⭐ 缺陷：不是所有的对象都可以被代理透明包装
::: tip
👩🏻‍🏫 一个代理对象可以被视作对target对象的拦截操作 - 代理包装target。代理的handler就好像是该代理的观察者或者监听者。
:::

- 它通过实现相应的方法（比如 `get` 用于读取某个属性等 ）规定哪些操作可以被拦截。
- 如果handler方法中缺少对某个操作的捕获，它会简单的将其转发给target



> a.包装的对象对 this 指向的影响 

在深入前，我们先简单回顾一下包装target是如何影响 `this` 的：

```js {4,5}
const target = {
  myMethod() {
    return {
      thisIsTarget: this === target,
      thisIsProxy: this === proxy
    }
  }
}

const handler  = {}
const proxy = new Proxy(target, handler)
```

如果我们调用 `target.myMethod()`, `this` 指向 `target`:

```js
target.myMethod()
// {thisIsTarget: true, thisIsProxy: false}
```

如果我们通过代理调用，则 `this` 指向 `proxy`:

```js
proxy.myMethod()
// {thisIsTarget: false, thisIsProxy: true}
```

💡即，如果代理将方法调用转发给target，`this` 是不发生变化的。作为后果，如果target使用this，比如调用方法，代理仍然会在循环中。🤔



> b.不能被透明包装的对象


::: info
📚通常，使用空handler的代理会透明的包装target：*即我们不会察觉到代理的存在，代理也不会改变target的行为🎉*。
:::

然而，如果target通过不受代理控制的机制将信息与 `this` 相关联，我们将会碰到问题😭：事情不会按我们想象的那样正常运作，因为不同的信息关联取决于target是否被包装。

比如。下面 `Person` 类使用WeakMap `_name` 存储私有信息（[WeakMap private data](https://exploringjs.com/impatient-js/ch_weakmaps.html#private-data-in-weakmaps)）:

```js {5}
const _name = new WeakMap()

class Person {
  constructor(name) {
    _name.set(this, name)
  }
  get name() {
    return _name.get(this)
  }
}
```

Person实例不能被透明的包装：

```js {2,6}
const jane = new Person('Jane')
// this指向jane
assert.equal(jane.name, 'Jane')

const proxy = new Proxy(jane, {})
// this指向proxy
assert.equal(proxy.name, undefined)
```

`jane.name` 的结果不同于包装的 `proxy.name`，下面实现则不会存在这个问题：

```js {11,15}
class Person2 {
  constructor(name) {
    this._name = name
  }
  get name() {
    return this._name
  }
}

const jane = new Person2('Jane')
// this指向jane
assert.equal(jane.name, 'Jane')

const proxy = new Proxy(jane, {})
// this指向proxy
assert.equal(proxy.name, 'Jane')
```

> c.包装内置构造器实例

💡*大多数内置构造器实例也使用了不被代理拦截的机制。* 因此也不能被透明包装。我们可以使用 `Date` 实例作为例子：

```js {1,6-7}
const target = new Date()
const handler = {}

const proxy = new Proxy(target, handler)
assert.throws(
  () => proxy.getFullYear(),
  /^TypeError: this is not a Date object\.$/
)
```

👩🏻‍🏫 **不受proxy影响的机制称之为内部槽（`internal slots`）**。这些槽和关联的实例以属性一样的方式进行存储。规范中定义，处理这些槽就好像是通过带方括号名字的属性一样。例如，下面方法是内部的，可以被所有对象 `o` 调用：

```js
O.[[GetPrototypeOf]]()
```

💡相比于属性，访问内部槽不是通过普通的 `get | set` 操作完成的。

如果 `.getFullYear()` 通过代理调用，它找不到内部槽需要的`this`，因此抛出TypeError。

对于Date方法：[TC39语言规范强调](https://tc39.es/ecma262/#sec-properties-of-the-date-prototype-object)：除非明确定义，否则下面定义的 Date 原型对象的方法不是通用的，并且传递给它们的 `this` 值必须是一个具有已初始化为时间值的 `[[DateValue]]` 内部槽的对象。

>  d.变通方案

作为变通方案，我们改变handler如何转发方法调用和选择性将 `this` 设置为target，而不是代理：

```js {3-6}
const handler = {
  get(target, propKey, receiver) {
    if (propKey === 'getFullYear') {
      // 选择性绑定到 target
      return target.getFullYear.bind(target)
    }
    return Reflect.get(target, propKey, receiver)
  }
}

const proxy = new Proxy(new Date('2022-7-1'), handler)

proxy.getFullYear() // 2022
```

这种方法的缺点就是，该方法对this执行的操作都不会通过代理。



> e.数组可以被透明包装

不同于其它内置类，数组是可以被透明包装的😎

```js
const p = new Proxy(new Array(), {})
p.push('a')
p.length // 1

p.length = 0
p.length // 0
```
::: tip
📚数组能被透明包装的原因是，因为数组方法是通用的，且不依赖内部槽（`internal slots`）
:::



## 4️⃣ 代理使用示例

下面展示Proxies能做些什么。通过这些可以对代理的API进行实战。




###  4.1 用get & set追踪属性访问

假设存在一个 `tracePropertyAccesses(obj, propKeys)` 的方法用于记录对象 `obj` 上的属性什么时候被访问或者设置。

🌰：

```js
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  
  toString() {
    return `Point(${this.x}, ${this.y})`
  }
}

// 追踪属性 x | y 的访问
const point = new Point(5, 7)
const tracedPoint = tracePropertyAccesses(point, ['x', 'y'])
```

获取或设置被追踪的对象p的属性有如下效果：

```js
assert.equal(tracedPoint.x, 5)
tracedPoint.x = 21

// 打印
// 'GET x'
// 'SET x=21'
```

有趣的是，当Point访问属性时，追踪仍生效，因为 `this` 现在指的是被追踪的对象，而不是Point的实例：

```js
assert.equal(tracedPoint.toString(), 'Point(21, 7)')

// 打印
// 'GET x'
// 'GET y'
```

> 不使用代理实现 tracePropertyAccesses()

不使用代理的话，我们使用 `getter & setter` 代替各个属性用于追踪。setters & getters 使用一个额外的对象 `propData` 存储属性的数据。注意，我们破坏性的改变了原有实现，这意味着我们正在进行元编程：🤔

```js {2,5}
function tracePropertyAccesses(obj, propKeys, log=console.log) {
  // 用propData存储属性数据
  const propData = Object.create(null)
  
  // 使用一个getter和一个setter替代每个属性
  propKeys.forEach(function(propKey) {
    propData[propKey] = obj[propKey]
    Object.defineProperty(obj, propKey, {
      get: function() {
        log('GET ' + propKey)
        return propData[propKey]
      },
      set: function(value) {
        log('SET ' + propKey + '=' + value)
        propData[propKey] = value
      }
    })
  })
  
  return obj
}
```

参数 `log` 便于单元测试：

```js
const obj = {}
const logged = []
tracePropertyAccesses(obj, ['a', 'b'], x => logged.push(x))

obj.a = 1
assert.equal(obj.a, 1)

obj.c = 3
assert.equal(obj.c, 3)

assert.deepEqual(
  logged,
  ['SET a=1', 'GET a']
)
```

> 💡使用代理实现

代理实现更简单，我们拦截get & set，而不改变实现：

```js
function tracePropertyAccesses(obj, propKeys, log=console.log) {
  const propKeySet = new Set(propKeys)
  
  return new Proxy(obj, {
    get(target, propKey, receiver) {
      if (propKeySet.has(propKey)) {
        log('GET ' + propKey)
      }
      return Reflect.get(target, propKey, receiver)
    },
    set(target, propKey, value, receiver) {
      if (propKeySet.has(propKey)) {
        log('SET ' + propKey + '=' + value)
      }
      Reflect.set(target, propKey, value, receiver)
    }
  })
}
```

### 4.2 访问未知属性进行警告

如果我们访问对象某个不存在的属性时，js会返回 `undefined`, 而不是抛出异常。

针对这种情况，我们可以用代理抛出异常。**我们可以让代理成为对象的原型，如果属性不在对象上，则会触发代理上的 `get` 陷阱**：

- 在代理之后，如果在原型链上也找不到该属性，说明该属性确实不存在，我们可以抛出异常
- 否则返回继承的属性值，通过转发 `get` 操作到target上实现（代理从target上获取其原型）

某个实现：

```js
const propertyCheckerHandler = {
  get(target, propKey, receiver) {
    // 只检测字符串属性key
    if (typeof propKey === 'string' && !(propKey in target)) {
      throw new ReferenceError('Unknown property: ' + propKey)
    }
    return Reflect.get(target, propKey, receiver)
  }
}

const PropertyChecker = new Proxy({}, propertyCheckerHandler)
```

💡将 `PropertyChecker` 作为一个对象使用：

```js
const jane = {
  __proto__: PropertyChecker,
  name: "Jane"
}

jane.name // ✅ ok

jane.age // ❌ ReferenceError: Unknown property: nmae

// 继承的属性
jane.toString() // '[object Object]'
```

如果将 `PropertyChecker` 变为一个构造器，则可以对类使用 `extends`:

```js {1,4,6}
// 我们不能改变classes的 .prototype 因此这里使用一个function
function PropertyChecker2() {}

PropertyChecker2.prototype = new Proxy({}, propertyCheckerHandler)

class Point extends PropertyChecker2 {
  constructor(x, y) {
    super()
    this.x = x
    this y = y
  }
}

const point = new Point(5, 7)
point.x // ✅ 5 

point.z // ❌ ReferenceError: Unknown property: z
```

📚下面是 `point` 的原型链：

```js
// 获取原型的方法
const p = Object.getPrototypeOf.bind(Object)

// point 的原型链是 Point.prototype 一点问题也没有
p(point) === Point.prototype

// 即Point.prototype的原型是PropertyChecker2.prototype
// 因为Point 继承自 PropertyChecker2 因此关系成立
p(p(point)) === PropertyChecker2.prototype

// 最后 PropertyChecker2 代理本身也是一个对象
// 它的原型是 Object.prototype 也没啥问题
p(p(p(point))) === Object.prototype
```

> 阻止属性的意外创建

如果我们担心属性的意外创建，则有2种方式：

1. 我们可以使用代理的 `set` 陷阱包装对象
2. 我们可以用 `Object.preventExtensions(obj)` 使对象变得不可扩展，即JS不允许对obj添加新的属性



### 4.3 负数组索引（get trap）

数组的某些方法运行使用 `-1` 获取最后一个元素， `-2` 获取最后2个元素：

```js
[1, 2, 3].slice(-1)

// [3]
```

但是不能使用负索引获取数组元素。我们可以使用代理添加这个能力。代理拦截由 `[]` 触发的 `get` 操作：

```js
function createArray(...elements) {
  const handler = {
    get (target, propKey, receiver) {
      if (typeof propKey === 'string') {
        const index = Number(propKey)
        if (index < 0) {
          propKey = String(target.length + index)
        }
      }
      return Reflect.get(target, propKey, receiver)
    }
  }
  // 使用代理包装数组
  return new Proxy(elements, handler)
}

const arr = createArray('a', 'b', 'c')
arr[-1] // 'c'
arr[0] // 'a'
arr.length // 3
```


### 4.4 数据绑定（set trap）

数据绑定是关于在对象间同步数据。一种流行的场景是，基于MVC模式的widgets：通过数据绑定，可以使视图（`view` 即该widget）在模型（`model`，即对该widget的数据虚拟化）发生变化后同步更新。

为了实现数据绑定，我们需要观察和响应对象的变化。下面代码片段是如果观察数组变化的草稿：
```js {5}
function createObservedArray(callback) {
  const array = []
  return new Proxy(array, {
    set(target, propertyKey, value, receiver) {
      callback(propertyKey, value)
      return Reflect.set(target, propertyKey, value, receiver)
    }
  })
}

const observedArray = createObservedArray(
  (key, value) => 
    console.log(`${JSON.stringify(key)} = ${JSON.stringify(value)}`)
)

observedArray.push('a')

// 打印
// "0 = "a"
// "length" = 1
```


### 4.5 访问restful网络服务（method calls）

代理可用于创建可以调用任意方法的对象。下面例子中， `createWebService()` 将会创建一个这样的对象 `service`。调用service上的方法将获取到同名的网络服务资源内容。获取是通过Promise完成的。

```js
const service = createWebService('http://example.com/data')
// 当前 http://example.com/data/employees json数据
service.employees().then(jsonStr => {
  const employees = JSON.parse(jsonStr)
  //...
})
```

下面不使用代理快速粗糙的实现该方法。我们需要提前知道service上调用的方法。参数 `propKeys` 将提供这些信息，它是一个包含方法名的数组：

```js
function createWebService(baseUrl, propKeys) {
  const service = {}
  for (const propKey of propKeys) {
    service[propKey] = () => {
      return httpGet(baseUrl + '/' + propKey)
    }
  }
  return service
}
```

💡使用代理的方式则更为简洁：

```js
function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl + '/' + propKey)
    }
  })
}
```

`httpGet` 请求， 关于 [promise - impatient-js](https://exploringjs.com/impatient-js/ch_promises.html#promisifying-xmlhttprequest)：

```js
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      if (xhr.status === 200) { 
        resolve(xhr.responseText) // A
      } else {
        // 发生错误 比如404
        reject(new Error(xhr.statusText)) // B
      }
    }
    
    xhr.onerror = () => {
      reject(new Error('网络错误')) // C
    }
    
    xhr.open('GET', url)
    xhr.send()
  })
}
```


### 4.6 ⭐ 可撤销引用

可撤销引用效果如下：*客户端不允许直接访问重要的资源（比如某个对象），只能通过引用（间接对象，即资源包装器）访问*。
::: warning
正常情况下，所有针对引用的操作都转发到资源上。在客户端操作完成后，**通过吊销该引用的方式，从而达到保护资源的目的**。之后，再对引用进行操作，直接抛出错误，不再将操作转发到资源上👩🏻‍🏫。
:::



下面例子，我们对资源创建一个可撤销的引用。然后通过该引用读取资源上的某个属性。这一切ok，因为此时引用确保操作转发到资源上，然后我们吊销该引用，之后该引用便不再允许我们继续使用了。

```js {4,7,12}
const resouce = { x: 11, y: 8 }
const { reference, revoke } = createRevocableReference(resource)

// 允许访问
assert.equal(reference.x, 11)

// 吊销引用
revoke()

assert.throws(
  () => reference.x,
   /^TypeError: Cannot perform 'get' on a proxy that has been revoked/
)
```
::: tip
**代理就很适合实现可撤销引用，因为它们能拦截和转发操作😎**。
:::
下面是基于Proxy的实现：

```js
function createRevocableReference(target) {
  let enabled = true
  
  return {
    reference: new Proxy(target, {
      get(target, propKey, receiver) {
        if (!enabled) {
          throw new TypeError(
            `Cannot perform 'get' on a proxy that has been revoked`)
        }
        return Reflect.get(target, propKey, receiver)
      },
      has(target, propKey) {
        if (!enabled) {
          throw new TypeError(
            `Cannot perform 'get' on a proxy that has been revoked`);
        }
        return Reflect.has(target, propKey)
      }
    })
  },
    revoke: () => {
      enabled = true
    }
}
```

上面的代码可以通过 `Proxy-as-handler`(将代理当做handler 🤩)的技术进行简化。这里，handler基本上就是一个 `Reflect` 对象。因此 `get` 陷阱正常返回合适的Reflect方法。如果引用已经被吊销，则抛出 `TypeError`:

```js {3-4}
function createRevocableReference(target) {
  let enabled = true
  // Proxy-as-Handler 😎
  // proxy本质上也是一个对象
  const handler = new Proxy({}, {
    get(_handlerTarget, trapName, receiver) {
      if (!enabled) {
        throw new TypeError(`Cannot perform '${trapName}' on a proxy`
          + ` that has been revoked`)
      }
      return Reflect[trapName]
    }
  })
  
  return {
    reference: new Proxy(target, handler),
    rovoke: () => {
      enabled = false
    }
  }
}
```

🎉然而，我们无需自己实现这样的方法，因为Proxy本身就是可撤销的。现在，吊销发生在代理内部，而不是handler。handler所要做的就是将操作转发给目标对象，即handler不实现任何traps方法：

```js {3}
function createRevocableReference(target) {
  const handler = {} // 转发所有操作
  const { proxy, revoke } = Proxy.revocable(target, handler)
  return { reference: proxy, revoke }
}
```

> 屏障（Membrances）

屏障建立在可撤销引用的思想之上：用于安全运行不受信任代码的库会在该代码周围包裹一层屏障以隔离它并保持系统其余部分的安全。对象从2个方向通过屏障：

- 不受信任的代码可能从外界接收对象（干对象）
- 屏障传递对象（湿对象）给外界

这2种情形，可撤销引用包裹在这些对象周围。通过包装函数或方法返回的对象同样也被包装。另外，如果一个包装的湿对象传回屏障内，则该对象解除包装。

一旦完成不受信任的代码，所有可撤销的引用都将被撤销。结果，它在外部的任何代码都无法再执行，并且它引用的外部对象也停止工作。Caja 编译器是“使第三方 HTML、CSS 和 JavaScript 安全嵌入您的网站的工具”。它使用膜来实现这一目标。


### 4.7 使用js实现DOM

浏览器的DOM通常是通过JS和C++一起实现的。纯粹使用JS实现可用于：

- 模拟浏览器环境，比如，在Node.js中操作DOM，[jsdom](https://github.com/tmpvar/jsdom) 库便是做这个的
- 使DOM更快（js和C++上下文切换会花费时间）

::: warning
但是，标准DOM功能不太容易通过纯JS实现。比如，大多数DOM集合是实时预览的，当前DOM状态发生变化，DOM集合也会动态变化。纯JS实现这个功能是很低性能的。而使用代理这可提升性能。
:::



### 4.8 更多使用场景

代理还可用于：

- 远程：本地占位对象转发方法调用给远程对象，这和上面提到的web service示例很像
- 数据库数据访问对象：对对象的读写操作对数据库的读写操作。这和上面提到的web service示例很像
- 记录（Profiling）：拦截方法调用，追踪方法耗时。类似上面的追踪示例



### 4.9 使用代理的库

- [Immer（by Michel Weststrate）](https://github.com/immerjs/immer) 帮助非破坏性更新数据。应该应用的更改可以通过调用方法、设置属性、设置Array元素等来指定。通过一个 **预选对象（`draft state`）**，而预选对象是通过代理实现
- [MobX](https://mobx.js.org/) 允许你观察数据结构（比如对象，数组，类实现）的变化。它是通过代理实现的
- [Alphine.js](https://github.com/alpinejs/alpine) 一个通过代理实现数据绑定的前端库
- [on-change](https://github.com/sindresorhus/on-change) 通过代理观察对象的变化，并进行上报
- [Env utility - Nicholas C.Zakas](https://github.com/humanwhocodes/env) 允许通过属性访问环境变量值，如果不存在则抛出异常。通过代理实现
- [LDFlex](https://github.com/LDflex/LDflex) 提供链接数据查询语言。流式查询API是通过代理实现



## 5️⃣ 📚Proxy API的设计思想

这一节，我们将深入代理如何工作的，以及为什么那样工作



### 5.1 分层：保持基础级别和元级别分离

火狐曾经优先的支持过一种有趣的元编程：如果一个对象 `o` 有一个叫 `__noSuchMethod__` 的方法，当在  `o` 对象上调用不存在的方法时，会发出通知：

```js
const calc = {
  __noSuchMethod__: function(methodName, args) {
    swtich (methodName) {
      case 'plus':
        return args.reduce((a, b) => a + b)
      case 'times':
        return args.reduce((a, b) => a * b)
      default:
        throw new TypeError('不支持： ' + methodName)
    }
  }
}

// 下面所有方法调用通过 .__noSuchMethod__()实现
calc.plus(3, 5, 2) // 10
calc.times(2, 3, 4) // 24

calc.plus('Parts', ' of ', 'a', ' string') // parts of a string
```

因此，`__noSuchMethod__` 工作效果和代理trap一样。对比代理，trap是我们想要拦截其操作的对象的一个自己或继承的方法。*火狐的这种方法的问题在于，基础级别（正常方法）和元级别（__noSuchMethod__）混在一起了*。基础级别代码可能不小心调用或看到了元级别代码，并有可能不小心定义了一个相同名字的元级别的方法。

📚 即使在标准的ECMAScript中，**基础级别和元级别有时候也混在一起了**。比如，下面元编程机制可能失败，因为它们存在于基础级别中：

- `obj.hasOwnProperty(propKey)`: 如果属性在原型链中覆盖了内部实现，这个方法调用可能失效。比如，

  ```js
  const obj = { hasOwnProperty: null }
  
  // TypeError: obj.hasOwnProperty is not a function
  obj.hasOwnProperty('width')
  ```

  💡下面是安全调用 `hasOwnProperty()` 的方式：

  ```js
  // false
  Object.prototype.hasOwnProperty.call(obj, 'width')
  
  // 简写 false
  {}.hasOwnProperty.call(obj, 'width')
  ```

- `func.call(...) & func.apply(...)`: 这2个方法，也存在和 `hasOwnProperty` 一样的问题，解决方法也一样

- `obj.__proto__`: 在普通对象中，`__proto__` 是一个特殊的属性，它允许我们获取和设置接收者的原型。因此，当我们把普通对象当做字典使用时，我们必须避免将 [__proto__ 作为属性键](https://exploringjs.com/impatient-js/ch_single-objects.html#the-pitfalls-of-using-an-object-as-a-dictionary)

🎉🎉现在，应该很明显了，使基础级别的属性键特殊化会存在问题。
::: tip
因此，代理是分层的：**基础级别（代理对象）和元级别（handler 对象）是分开的** 。
:::



### 5.2 虚拟对象 vs 包装器

代理可用作2种角色：

1. 作为包装器（`wrappers`）：包装目标对象，控制对目标对象的访问。包装器示例：可撤销资源和通过代理进行追踪
2. 作为虚拟对象（`virtual objects`）: 它们是包含特殊行为的简单对象，它们的targets不重要。例子：代理转发方法调用给远程对象

代理 API 的早期设计将代理视为纯虚拟对象。然而，事实证明，即使在那个角色中，目标也是有用的，可以强制执行不变性并作为handler未实现的traps的fallback。



### 5.3 透明虚拟化和handler封装

代理通过两种方式进行屏蔽：

1. **无法确定对象是否为代理（透明虚拟化）😎**
2. 我们无法通过其代理访问handler（handler封装）

这两个原则都赋予代理相当大的能力来模拟其他对象。强制执行不变性的一个原因（如后所述）是为了控制这种力量。

🤔如果我们需要区分代理和非代理对象，我们必须自己实现该功能。下面是模块 `lib.mjs` 代码：一个创建代理，一个确定对象是否是其中某个代理：

```js {2,7,12}
// lib.mjs
const proxies = new WeakSet()

export function createProxy(obj) {
  const handler = {}
  const proxy = new Proxy(obj, handler)
  proxies.add(proxy)
  return proxy
}

export function isProxy(obj) {
  return proxies.has(obj)
}
```

该模块使用数据结构 `WeakSet` 来跟踪代理。 WeakSet 非常适合此目的，因为它不会阻止其元素被垃圾回收。

示例：

```js
import { createProxy, isProxy } from './lib.mjs'

const proxy = createProxy({})
assert.equal(isProxy(proxy), true)
assert.equal(isProxy({}), false)
```



<p id="5.4"></p>



### 5.4 ⭐️ 元对象协议和代理traps

这一节，我们将检查JS的内部结构以及如何选择代理traps。

在编程语言和 API 设计的上下文中，协议是一组接口以及使用它们的规则。ECMAScript规范描述了如何执行JS代码。其中包含 [处理对象的协议](https://tc39.es/ecma262/#sec-ordinary-and-exotic-objects-behaviours)。*这个协议在元级别进行操作，有时被称为元对象协议（`MOP`）👩🏻‍🏫*。MOP由所有对象都拥有的 **内部方法** 组成。内部意味着它们只存在于规范中（JS引擎可能实现它们，也可能没有实现），不能被JS所访问😎。内部方法一般使用双中括号（`[[internal-method]]`）的形式。

获取属性的内部方法称之为 `[[Get]]()`。如果我们使用双下划线（`__internalMethod__`）替代双中括号，则这个方法大致可以用如下JS实现：

```js
// 方法定义
__Get__(propKey, receiver) {
  const desc = this.__GetOwnProperty__(propKey)
  // 查看属性是否存在
 	// 不存在就在父原型链上查找
  if (desc === undefined) {
    const parent = this.__GetPrototypeOf__()
    if (parent === null) return undefined
    // 如果找到 则递归调用parent的 __Get__ 方法
    return parent.__Get__(propKey, receiver) // A
  }
  
  // 如果对象上存在，则判断是否直接就可以获取
  if ('value' in desc) {
    return desc.value
  }
  
  // 如果没有直接获取到，则判断是否使用了 getter的形式定义的
  const getter = desc.get
  if (getter === undefined) return undefined
  // 如果是getter形式定义的属性，则调用该getter
  return getter.__Call__(receiver, [])
}
```

📚上面代码中调用的MOP方法有：

- `[[GetOwnProperty]]` (捕获 `getOwnPropertyDescriptor`)
- `[[GetPrototypeOf]]`（捕获 `getPrototypeOf`）
- `[[Get]]` (捕获 `get`)
- `[[Call]]` （捕获 `apply`）

在行 `A` 中我们可以看到，为什么在原型链中的代理在一个属性在先前对象找不到时会去找 `get`：如果自身不存在key为 `propKey` 的属性，`this` 搜索将延续到原型链 `parent` 。

👩🏻‍🏫 **基础操作 vs 派生操作**。我们可以看出 `.[[Get]]()` 会调用其它的MOP操作。这样调用其它操作的方式称之为 **派生（`derived`）**，哪些不依赖其它操作的称之为 **基础（`fundamental`）**。



####  代理中的元对象协议（the meta object protocol of Proxies）

[代理中的元对象协议](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots) 不同于普通对象。对于普通对象，派生操作会调用其它操作。而对代理，每个操作（不论是基础还是派生的）要么被handler拦截，要么转发给target。

哪些操作会被代理拦截呢？

- 一种可能是，只对基础操作提供陷阱
- 另一种就是包含某些派生操作的

后一种方式的优点是，增加性能和更加方便。比如，如果没有  `get` trap，那么我们必须通过 `getOwnPropertyDescriptor` 实现它的功能。

而包含派生traps的缺点就是，可能导致代理行为不一致。比如，`get` 可能返回一个不同于 `getOwnPropertyDescriptor` 返回的值。



#### 选择性拦截：哪些操作应当被拦截？

👩🏻‍🏫 通过代理的拦截是选择性的。我们不能拦截所有的语言操作。那为什么有些操作会被排除在外呢？下面我们看看2个原因。

第一，**稳定（`stable`）** 操作不太适合拦截。*一个操作如果输入相同的参数总返回相同结果，我们称这种操作是稳定的*。如果代理能拦截稳定操作，那么该操作将变得不稳定和不可靠。 [严格相等性](http://speakingjs.com/es5/ch09.html#_strict_equality) 就是这样一个稳定操作。它不能被捕获，它通过将代理对象自身当做一个普通对象来计算相等性结果。另一种保持稳定性的方式是，对target执行操作，而不是对代理。正如稍后将解释的，当我们知道如何强制代理执行不变性时，这对那些代理了不可扩展的target使用 `Object.getPrototypeOf()` 时就会发生。



不能对更多操作进行拦截的第二个原因是，拦截意味着执行那些正常情况下不能执行代码的情形。拦截得越多，理解和调试程序变得越困难。同时对性能也会有所影响。

#### ⭐ 陷阱：get vs invoke

🤔 如果我们想通过代理创建虚拟方法，我们必须从 `get` trap中返回一个函数。这就引发了一个问题：*为什么不再添加一个用于方法调用（比如 `invoke`）的陷阱呢？* 这让我们能区分：

- 获取属性通过 `obj.prop` （`get` 陷阱）
- 调用方法通过 `obj.prop()` （`invoke` 陷阱）

不这样做有2个原因：

第一，不是所有实现都能区分 `get` 和 `invoke`,比如 苹果的 `JavaScriptCore` 就不能区分。



第二，提取方法，之后通过 `call() | apply()` 调用应当和通过dispatch调用方法具有相同的效果。换句话说，下面2种变种应当效果一样。如果存在一个额外的陷阱 `invoke`，则这种相等性就很难维护：

```js
// 变种1： 动态dispatch的方式调用
const result1 = obj.m()

// 变种2：先提取，之后调用
const m = obj.m
const result2 = m.call(obj)
```

> invoke的使用场景

有时有些代码只有区分了 `get` 和 `invoke` 才行。这种情况通过现在的代理API是无法完成的。2个示例： **自动绑定和拦截不存在的方法**。下面看看假设代理支持 `invoke` 陷阱的实现方式。

**自动绑定（`Auto-binding`）**。通过将代理作为对象的原型，我们可以自动绑定方法：

- 通过 `obj.m` 取回方法，此时 `this` 绑定为 `obj`
- `obj.m()` 调用方法

自动绑定在我们将方法当做回调函数时有用，比如，上面变种2可以简写为：

```js
const boundMethod = obj.m
// 不再需要.call再绑定
const result = boundMethod()
```

**拦截不存在的方法**。`invoke` 可以模拟先前提到的 `__noSuchMethod__` 机制。代理还是作为对象的原型。它会响应未知属性 `prop` 的访问：

- 我们我们通过 `obj.prop` 读取属性，没有拦截行为发生，返回 `undefined`
- 如果我们通过调用 `obj.prop()` 方法，则代理拦截它，比如通知一个回调



<p id="5.5"></p>



### 5.5 对代理强制不变性

在我们了解什么是不变性（`invariants`）前，先了解代理是如何强制不变性的。我们先回顾一下，对象如何通过不可扩展和不可配置进行保护的。



#### 保护对象

2种保护对象的方式：

1. 不可扩展性保护对象：如果一个对象是不可扩展的，我们对其不能添加属性，以及改变其原型
2. 不可配置保护属性（准确来说是 `attributes`）:
   - `writable` attribute表示一个属性值是否可以改变
   - `configurable` 控制属性的attributes是否可改变

[10 Protecting objects from being changed](https://exploringjs.com/deep-js/ch_protecting-objects.html) 了解更多



#### 强制不变性（enforcing invariants）

传统上，不可扩展性和不可配置性：

- 通用的：对所有对象都生效
- 单调性（`Monotonic`）：一旦打开，则不能将其关闭，即这个过程不可逆

📚这些和其他在语言操作面前保持不变的特征称为不变性（`invariants`）。通过代理很容易违反不变性，因为它们本质上不受不可扩展性等的约束。**代理 API 通过检查target和handler方法的结果来防止这种情况发生** 😎

下面2个子小节描述4种不变性。所有不变性清单在本章最后列出。



#### 通过target对象的2个强制不变性

下面2个不变性涉及到不可扩展性和不可配置性。这些是通过使用target对象登记来强制执行的：*handler方法返回的结果必须大部分与target对象同步*。

- 不变性：如果 `Object.preventExtensions(obj)` 返回 `true`，则之后的所有调用都必须返回 `false`，并且现在 `obj` 必须不可扩展
  - 如果handler返回true，则强制代理抛出 `TypeError` 错误，但是target对象是不可扩展的
- 不变性：一旦对象变得不可扩展，`Object.isExtensible(obj)` 总是返回 `false`
  - 如果handler返回的结果与 Object.isExtensible(target) 不同（转换（`coercion`）之后），则通过抛出 TypeError 强制代理。



#### 不变性的好处

强制不变性有以下好处：

- 在可配置性和可扩展性上，代理和普通对象一样，因此，通用性得以保持。这是在不阻止代理虚拟化（模拟）受保护对象的情况下实现的。
- 一个受保护的对象不能通过在它周围包裹一个代理来被错误表示。错误表示可能是由错误或恶意代码引起的。

接下来的两节给出了强制执行不变性的示例。



#### 🌰 示例：不可扩展的target的原型被表示时必须失败

为了响应 `getPrototypeOf` 陷阱，如果target是不可扩展的，代理必须返回target的原型。

为了演示这种不变性，我们创建一个handler，handler返回一个不同于target原型的原型：

```js
const fakeProto = {}
const handler = {
  getPrototypeOf(t) {
    return fakeProto
  }
}
```

如果target是可扩展的，则假冒的原型正常工作：

```js
const extensibleTarget = {}

const extProxy = new Proxy(extensibleTarget, handler)

Object.getPrototypeOf(extProxy) === fakeProto // true
```

但是，当target是不可扩展时，返回假冒原型，将抛出TypeError:

```js {2,5}
const nonextensibleTarget = {}
Object.preventExtensions(nonextensibleTarget)
const nonExtProxy = new Proxy(nonextensibleTarget, handler)

// ❌ TypeError： 代理目标为不可扩展，trap应该返回其真正的原型
// 'getPrototypeOf' on proxy: proxy target is
// non-extensible but the trap did not return its
// actual prototype"
Object.getPrototypeOf(nonExtProxy)
```

#### 🌰 示例：不可写，不可配置target属性必须显示失败

如果一个target的属性不可写(`non-writable`)不可配置(`unconfigurable`)，则handler必须返回该属性的值，作为对 `get` 陷阱的响应。为了演示这个不可变性，我们创建一个handler，总是对属性返回相同的值：

```js {15,17-18}
const handler = {
  get(target, propKey) {
    return 'abc'
  }
}

const target = Object.defineProperties({}, {
  manufacturer: {
    // 可写 可配置属性
    value: 'Iso Autoveicoli',
    writable: true,
    configuratble: true
  },
  model: {
    // 🚨 不可写不可配置属性
    value: 'Isetta',
    writable, false.
    configurablt: false
  }
})

const proxy = new Proxy(target, handler)
```

`manufacturer` 属性可写可配置，则表示handler允许其假装有不同的值：

```js
proxy.manufacturer === 'abc' // true
```

而 `target.model` 既不可写也不可配置。因此，我们不能冒充它的值😅：

``` {1}
// ❌ TypeError: model是一个只读且不可配置的数据属性，但代理没有返回其实际值
// 'get' on proxy: property 'model' is a read-only and
// non-configurable data property on the proxy target but
// the proxy did not return its actual value (expected 'Isetta' but got 'abc')
proxy.model
```

proxy的 `get`: 属性 `model` 是一个在代理target上只读且不可配置的数据属性。但是代理没有返回其真实值（期望 'Isetta', 但是得到的是 'abc'）



<p id="6"></p>



## 6️⃣ Proxy问答：enumerate 陷阱去哪里了？

ES6开始是由 `enumerate` 陷阱的，通过 `for...in` 循环触发。但是为了简化代理现在已被移除。`Reflect.enumerate()` 也一并被移除。



<p id="7"></p>



## 7️⃣ Proxy API 手册

这个小节对Proxy API快速查阅

- 全局对象 `Proxy`
- 全局对象 `Reflect`

手册使用下面自定义类型：

```typescript
type PropertyKey = string | symbol
```

<p id="7.1"></p>



### 7.1 创建代理

2种方式创建代理:

方式1： 使用给定target和handler创建代理

```js
const proxy = new Proxy(target, handler)
```

方式2：创建可撤销的代理，`rovoke` 可以调用多次，但是只有第一次生效，关闭代理。之后，任何对代理的操作都会抛出TypeError

```js
const { proxy, revoke } = Proxy.revocable(target, handler)
```



<p id="7.2"></p>



### 7.2 Handler方法

这一节介绍handler可以实现什么traps，以及什么操作会触发相应的traps。几个traps返回布尔值。比如 `has` & `isExtensible`， 布尔值是操作的结果。而对所有其它traps，布尔值表示操作是否成功。

所有对象的traps:

- `defineProperty(target, propKey, propDesc): boolean`
  - `Object.defineProperty(target, propKey, propDesc)`
- `deleteProperty(target, propKey): boolean`
  - `delete proxy[propKey]`
  - `delete proxy.someProp`
- `get(target, propKey, receiver): any`
  - `receiver[propKey]`
  - `receiver.someProp`
- `getOwnPropertyDescriptor(target, propKey): undefined | PropDesc`
  - `Object.getOwnPropertyDescriptor(target, propKey)`
- `getPrototypeOf(target): null|object`
  - `Object.getPrototypeOf(proxy)`
- `has(target, propKey): boolean`
  - `propKey in proxy`
- `isExtensiable(target): boolean`
  - `Object.isExtensiable(proxy)`
- `ownKeys(target): Array<PropertyKey>`
  - `Object.getOwnPropertyNames(proxy)`: 只使用字符串keys
  - `Object.getOwnPropertySymbols(proxy)`: 只使用 symbol Keys
  - `Object.keys(proxy)`: 只使用可枚举的字符串keys。可枚举性可以通过 `Object.getOwnPropertyDescriptor` 检测
- `preventExtensions(target): boolean`
  - `Object.preventExtensions(proxy)`
- `set(target, propKey, value, receiver): boolean`
  - `receiver[propKey] = value`
  - `receiver.someProp = value`
- `setPrototypeOf(target, proto): boolean`
  - `Object.setPrototypeOf(proxy, proto)`

只针对函数的traps（target是一个函数）：

- `apply(target, thisArgument, argumentsList): any`
  - `proxy.apply(thisArgument, argumentsList)`
  - `proxy.call(thisArgument, ...argumentsList)`
  - `proxy(...argumentsList)`
- `constructor(target, argumentsList, newTarget): object`
  - `new Proxy(...argumentsList)`



> 基础操作 vs 派生操作

下面操作是基础的，它们不依赖其它操作：

- apply
- defineProperty
- deleteProperty
- getOwnPropertyDescriptor
- getPrototypeOf
- isExtensiable
- ownKeys
- preventExtensions
- setPrototypeOf

其余的操作则都是派生的，它们通过组合基本操作实现。比如：`get` 通过 `getPrototypeOf` 迭代原型链和对链上的成员调用 `getOwnPropertyDescritptor` ，直到找到自身属性或原型链上的属性为止。

 <p id="7.3"></p>



### 7.3 handler方法的不变性

不变性是handlers的安全约束。这一节介绍代理 API 强制执行哪些不变性以及如何执行。*下面如果提到 handler必须做什么，如果没有做，则会抛出TypeError。* 有些不变性限制返回值，有一些则限制参数。trap返回值的正确性由以下2种方式确保：

1. 如果希望返回布尔值，则会将非布尔值转换（coercion）成布尔值
2. 其它情况，非法值将抛出TypeError

下面是完整的强制不变性列表：

1. `apply(target, thisArgument, argumentsList): any`
   - 不强制不变性
   - 只有当target是可调用的（即为函数或者构造器）时才激活强制不变性
2. `construct(target, argumentsList, newTarget):objcet`
   - handler的返回值必须是一个对象 （非 null或其它任何基础类型值）
   - 只有当target能构造时激活
3. `defineProperty(target, propKey, propDesc): boolean`
   - 如果target不可扩展 ，则不能添加新的属性
   - 如果 `propDesc` 将attribute `configurable` 设置为 `false`，则target必须有一个key名为 `propKey`的 不可配置的属性
   - 如果 `propDesc` 将attribute `configurable`   & `writable` 都设置为 `false`，则target必须有一个key名为 `propKey`的 不可配置且不可写的属性
   - 如果taregt有一个自己的属性，key为 `propKey`, 则 `propDesc` 必须兼容该属性：如果我们重新定义target属性的descriptor，就一定不能抛出异常
4. `deleteProperty(target, propKey): boolean`
   - 如果出现以下情况，则不能将属性报告为已删除：
     - target 有一个 `propKey` 属性不可配置
     - target不可扩展并有一个自身的属性 `propKey`
5. `get(target, propKey, receiver): any`
   - 如果target的propKey不可写不可配置，则handler必须返回该属性值
   - 如果target有一个不可配置，没有getter访问器的属性，则必须返回undefined
6. `getOwnPropertyDescriptor(target, propKey): undefined|PropDesc`
   - handler必须返回undefined或一个对象
   - target自身不可配置属性，handler不能将目标的不可配置自身属性报告为不存在。
   - 如果target是不可扩展的，那么handler必须将target自身准确地报告为存在
   - 如果handler报告某个属性为不可配置的，那么该属性必须是target的不可配置自身属性
   - 如果handler报告某个属性为不可配置和不可写的，那么该属性必须是target的不可配置和不可写的自身属性
7. `getPrototypeOf(target): null|object`
   - 必须返回null或一个对象
   - 如果target是不可扩展的，则handler必须返回target独享的 原型
8. `has(target, propKey): boolean`
   - target自身不可配置的自身属性不能报告为不存在
   - 如果target是不可扩展的，则target自身的属性不存在上报为不存在
9. `isExtensible(target): boolean`
   - 在转换为布尔值之后，handler返回的值必须和 `target.isExtensible()` 相同
10. `ownKeys(target): Array<PropertyKey>`
    - handler必须返回一个对象，视作类数组和转换为数组
    - 返回的数组不能包含重复的entries
    - 结果中的每个元素要么是字符串要么是symbol
    - 返回的结果必须包含target所有不可配置的自身属性keys
    - 如果target不可扩展，则返回结果必须值包含target自身的属性keys（不存在其它值）
11. `preventExtensions(target): boolean`
    - 如果 target.isExtensible返回false，则handler必须只返回一个真值（表示一个成功的改变）
12. `set(target, propKey, value, receiver): boolean`
    - 如果target是一个不可写，不可配置的数据，其key为 `propPey`，则该属性不能改变。这种情况，`value` 必须是该属性的值，否则抛出 TypeError
    - 如果相应的自己的target属性是没有设置器的不可配置访问器，则不能以任何方式设置该属性
13. `setPrototypeOf(target, proto): boolean`
    - 如果target是不可扩展的，属性不能改变。通过下面方式进行强制这种行为：如果target不可扩展，handler返回一个真值（表示成功改变），`proto` 必须和target原型一样，否则抛出TypeError

更多可参考：

- [代理对象内部方法和内部槽 - ECMAScript规范](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)	



<p id="7.4"></p>



### 7.4 影响原型链的操作

下面是普通对象对对象原型链的操作。因此，如果对象的原型链是一个代理 ，它的traps将被触发。规范以自己内部方法实现该操作（即对JS代码不可见）。但是在这一节中，我们假装它们是和traps有一样名字的普通方法。`target` 参数变为方法调用的接收者。

- `target.get(propertyKey, receiver)`: 如果对给定的key不存在自身属性，`get` 将在target的原型上被调用
- `target.has(propertyKey)`: 同 `get` 相似。 如果对给定的key不存在自身属性，`has` 将在target的原型上被调用
- `target.set(propertyKey, value, receiver)`:  同 `get` 相似。 如果对给定的key不存在自身属性，`set` 将在target的原型上被调用

其它操作只会影响自身的属性，对原型链没有效果。

更多可参考：

- [普通对象内部方法和内部槽](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)



<p id="7.5"></p>



### 7.5 Reflect

📚 全局对象 `Reflect` 以方法形式实现所有JS元对象协议（`MOP`） 拦截操作。方法名和handler方法相同，**帮助将handler操作转发到target上。**

- `Reflect.apply(target, thisArgument, argumentsList): any` : 类似 `Function.prototype.apply()`
- `Reflect.construct(target, argumentsList, newTarget=target): object`: `new` 操作符作为函数。`target` 是待调用的构造函数，可选参数 `newTarget` 指向构造器，该构造器开启当前构造器调用的链
- `Reflect.defineProperty(target, propertyKey, propDesc): boolean`: 类似 `Object.defineProperty()`
- `Reflect.deleteProperty(target, propertyKey): boolean`: `delete` 操作符当做函数。工作方式有稍微不同：如果成功删除属性或者该属性不存在则返回true。唯一能保护属性不被删除的方式是，将属性变为不可配置。在普通模式下，delete操作符返回相同结果，但在严格模式下，抛出错误
- 🤩 `Reflect.get(tareget, propertyKey, receiver=target):any`: 获取属性函数。可选参数 `receiver` 指向get开始的对象。*当 `get` 之后到达原型链中的 `getter`时需要，它将提供 `this` 的值 📚*
- `Reflect.getOwnPropertyDescriptor(target, propertyKey): undeinfed|PropDesc`: 同 `Object.getOwnPropertyDescriptor()`
- `Reflect.getPrototypeOf(target): null|object`: 同 `Object.getPrototypeOf()`
- `Reflect.has(target, propertyKey): boolean` :  `in` 操作符作为函数
- `Reflect.isExtensible(target): boolean`: 同 `Object.isExtensible()`
- `Reflect.ownKeys(target): Array<PropertyKey>`: 返回一个包含所有属性keys的数组：自身所有可枚举和不可枚举的字符串keys & symbol keys
- `Reflect.set(target, propertyKey, value, receiver=target): boolean`：设置属性的函数
- `Reflect.setPrototypeOf(target, proto): boolean`：创建对象原型的一种新的标准方式。当前非标准方式大多数引擎都生效，都是设置特殊的 `__proto__` 属性

几个方法都返回布尔结果，对于 `has() & isExtensible()`, 这是该操作的结果值。而同其它的方法，则表示该操作是否成功。



#### Reflect除了转发操作之外的情景

除了转发操作，[为什么Reflect 有用](https://github.com/tvcutsem/harmony-reflect/wiki)：

- 不同返回值：`Reflect` 重复了下面 `Object` 的方法，但是它的方法返回布尔值，表示该操作是否成功，而Object方法返回被修改的对象

  - `Object.defineProperty(obj, propertyKey, propDesc): object`
  - `Object.preventExtensions(obj): object`
  - `Object.setPrototypeOf(obj, proto): object`

- 操作符作为函数：下面Reflect方法实现的功能只有操作符才能相对应：

  - `Reflect.construct(target, argumentsList, newTarget=target): object`：对应 `new XX`
  - `Reflect.deleteProperty(target, propertyKey): boolean`：对应 `delete xxx.prop`
  - `Reflect.get(target, propKey, receiver): any`：对应 `xxx.prop 或 xxx[prop]`
  - `Reflect.has(target, propKey): boolean`：对应 `prop in xxx`
  - `Reflect.set(target, propertyKey, value, receiver=target): boolean`：对应 `xxx.prop = value`

- 更短版本 `apply()`: 如果我们想完全安全的对某个函数调用 `apply`，我们不能通过动态分发的方式，因为函数可能拥有一个同名的key为 `apply` 的属性：

  ```js
  func.apply(thisArg, argArray) // 不安全
  Function.prototype.apply.call(func, thisArg, argArray) // 安全
  ```

  使用 `Reflect.apply()` 更短实现安全版本：

  ```js
  Reflect.apply(func, thisArg, argArray)
  ```

- 删除属性是不存在异常：`delete` 操作符在严格模式下删除一个不可配置的自身属性时，会抛出异常。而 `Reflect.deleteProperty()` 返回 `false`



#### Object.* vs Reflect.*

`Object.*` 将操作运行在对其感兴趣的普通应用中，而 `Reflect.*` 将操作运行在更底层



<p id="8"></p>



##  8️⃣ 总结

这里总结深入了解Proxy API。需要注意的是如果对性能有严格要求的，代理会降低代码性能。

另外，性能有时没那么重要，此时代理带来的元编程则很有用。



原文：

- [Metaprogramming with Proxies](https://exploringjs.com/deep-js/ch_proxies.html#further-reading-proxies)



2022年07月03日13:54:56

耗时5天 😅



