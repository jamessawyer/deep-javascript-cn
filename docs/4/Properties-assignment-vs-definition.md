---
title: 属性赋值vs属性定义
---

目录：
[[toc]]




📚 有2种方式创建或改变对象 `obj` 的属性 `prop`:

- *赋值*： `obj.prop = true`
- *定义*： `Object.defineProperty(obj, prop, { value: true })`

本章将解释2种方式的工作原理。
::: info
前置知识：属性特性和属性描述器
:::




<p id="1"></p>



## 1️⃣ 赋值 vs. 定义



<p id="1.1"></p>



### 1.1 赋值（assignment）

我们使用 赋值操作符 `=` 给对象 `obj` 上的属性 `.prop` 赋一个值 `value`:

```js
obj.prop = value
```

👩‍🏫 这个操作符工作效果的差异取决于 `.prop` 属性是什么：

- **改变属性**：如果已经存在一个自身数据属性 `.prop`，赋值会将其值更改为 `value`
- **调用setters**：如果对 `.prop` 存在一个自身的或者继承的setter（设置器），赋值会调用该setter 
- **创建属性**： 如果不存在自身或者继承的数据属性 `.prop` 和 没有自身的或者继承的 `setter`，赋值会创建一个新的自身数据属性

::: tip
即：赋值的主要目的是做出改变，这也是为什么它支持setters。（记住这句话，后面内容会围绕着这句话深入说明）
:::


<p id="1.2"></p>



### 1.2 定义（definition）

为了给 `obj` 定义一个属性 `propKey`，我们使用如下面方法的操作：

```js
Object.defineProperty(obj, propKey, propDesc)
```

👩‍🏫 这个方法的工作效果取决于属性看起来是什么：

- **改变属性**：如果自身存在 `propKey`，定义根据属性描述器 `propDesc` 改变其属性特性
- **创建属性**： 如果不存在键为 `propKey` 的属性，定义会使用指定的 `propDesc` 创建一个自身属性，并包含特性。

::: tip
即：定义的主要目的是创建一个自身属性（**即使存在继承的setter，它也会忽略它** 💡），并且改变属性特性。（记住这句话，后面内容会围绕着这句话深入说明）
:::


<p id="2"></p>



## 2️⃣ ⭐理论上的赋值和定义(Assignment and definition in theory)

👩🏻‍🏫 在ECMAScript规范中的属性描述器：

在规范操作中，属性描述器不是JS对象，而是 [Records](https://tc39.es/ecma262/#sec-list-and-record-specification-type)，Records是规范内部数据结构，它拥有 `fields`。*字段的键使用双中括号。* 比如， **`Desc.[[Configurable]]`** 会访问字段 `Desc` 的  `.[[Configurable]]`。Records与外部世界交互时，会转换成JS对象，或者从JS对象转换为Records。



<p id="2.1"></p>

### 2.1 给一个属性赋值（Assigning to a property）

给一个属性赋值的操作实际是通过ECMAScript规范中的 [下面操作](https://tc39.es/ecma262/#sec-ordinarysetwithowndescriptor) 实现的：📒

```js
OrdinarySetWithOwnDescriptor(O, P, V, Receiver, ownDesc): boolean
```

参数含义：

- `O` 表示当前访问的对象
- `P` 表示我们正在赋值的属性的键
- `V` 表示我们正在赋的值
- `Receiver` 表示赋值开始的对象
- `ownDesc` 是 `O[P]` 的描述器，或者属性不存在时为 `null`

返回值表示操作是否成功。**严格模式** 下，如果 `OrdinarySetWithOwnDescriptor()` 失败时，会抛出 `TypeError`。

👩🏻‍🏫 下面是这个算法的大致总结：

- 该算法会遍历 `Receiver` 的原型链，直到它找到键为 `P` 的属性。遍历通过递归调用 `OrdinarySetWithOwnDescriptor()` 完成。在递归的过程中，`O` 会发生变化，指向当前访问的对象，而 `Receiver` 是始终保持不变的。😎
- 取决于遍历找到了什么，会在（遍历开始的地方） `Receiver` 上创建自身属性或者发生其它的事情

这个算法更详细的过程如下：

- 如果 `ownDesc` 是 `undefined`，则表示我们没有发现键为 `P` 的属性：

  - `If`: `O` 有一个原型 `parent`，则返回 `parent.[[Set]](P, V, Receiver)` 。这会延续我们的搜索。方法的调用通常以递归调用 `OrdinarySetWithOwndescriptor()` 结束

  - `Else`:（即 `O` 没有原型）我们对 `P` 属性的搜索失败，然后我们按如下方式设置 `ownDesc`:

    ```js
    {
      [[Value]]: undefined,
      [[Writable]]: true,
      [[Enumerable]]: true,
      [[Configurable]]: true
    }
    ```

    使用这个 `ownDesc`，下一个 `if` 语句会在 `Receiver` 上创建一个自身属性

- 如果 `ownDesc` 指定了一个**数据属性（`data property`）**，则表示我们发现一个属性：

  - 如果 `ownDesc.[[Writable]]` 是 `false`，返回 `false`。**这意味着，任何不可写属性 `P`(自身或继承的)都会阻止赋值操作** 💡
  - 让 `let exstingDescriptor = Receiver.[[GetOwnProperty]](p)`。即在赋值开始的地方取回属性描述器。我们现在就有了如下一些东西：
    - 当前对象 `O` 和 当前属性描述器 `ownDesc` 在一个手上
    - 原始对象 `Receiver` 和原始属性描述器 `existingDescriptor` 在另一个手上
  - 如果 `existingDescriptor` 不是 `undefined`:
    - (如果我们到达这里了，表示我们仍在原型链的开始地方 - 我们只有在 `Receiver` 上不存在属性 `P` 时才开始递归)
    - 下面2个 `if` 条件应当永远不为 `true`，因为 `ownDesc` 和 `existingDescriptor` 应当是相等的：
      - 如果 `existingDescriptor` 指定一个访问器，返回 `false`
      - 如果 `existingDescriptor.[[Writable]] ` 为 `false`，返回 `false`
    - 返回 `Receiver.[[DefineOwnProperty]](P, { [[Value]]: V })`。**这个内部方法执行定义，用于我们改变属性 `Receiver[P]` 的值**。定义算法会在下面子节中描述
  - Else：（如果 `existingDescriptor` 为 `undefined`）
    - （如果我们达到这里，则表示 `Receiver` 不存在键为 `P` 的自身属性）
    - 返回 `CreateDataProperty(Receiver, P, V)` ([这个操作](https://tc39.es/ecma262/#sec-createdataproperty) 会对其第一个参数创建自身属性)

- （如果我们到这里，则表示 `ownDesc` 描述一个自身的或者继承的 **访问器属性（`accessor property`）**）

- `let setter = ownDesc.[[Set]]`

- `if(setter == undefined) return false`

- 执行 `Call(setter, Receiver, «v»)`。[Call()](https://tc39.es/ecma262/#sec-call) 会调用函数对象 `setter`，并将 `this` 设置为 `Receiver`，单一参数为 `v`(法语括号 «» 用于规范中的列表)

- 返回 `true`



> 我们如何从一个赋值到 OrdinarySetWithOwnDescriptor() 的？

不使用解构计算赋值会涉及如下步骤：

1. 在规范中，计算位于 [AssignmentExpression 运行时语义这一节中](https://tc39.es/ecma262/#sec-assignment-operators-runtime-semantics-evaluation)。这一节处理为匿名函数、解构等提供名称的问题
2. 如果没有解构模式，则会使用 [PutValue()](https://tc39.es/ecma262/#sec-putvalue) 完成赋值
3. 对于属性赋值，`PutValue()` 调用内部方法 `.[[Set]]()`
4. 对普通对象，[.[\[Set]\]()](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-set-p-v-receiver) 会调用 `OrdinarySet()` (它又会调用 `OrdinarySetWithOwnDescriptor()`)，然后返回结果😂

🚨 注意的是，在严格模式下，如果 `.[[Set]]()` 的结果为false， `PutValue()` 会抛出 `TypeError`



<p id="2.2"></p>

### 2.2 定义一个属性（Defining a property）

定义一个属性的操作实际是通过ECMAScript规范中的 [下面操作](https://tc39.es/ecma262/#sec-validateandapplypropertydescriptor) 实现的：📒

```js
ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current): boolean
```

参数含义：

- `O` 表示我们想定义属性的对象。当 `O` 为 `undefined` 时，会使用一种特殊的仅验证模式。我们在这里忽略了这种模式。
- `P` 我们想定义的属性key
- `extensible` 指示对象 `O` 是否可扩展
- `Desc` 是属性描述器，用于指定属性的特性
- `current` 如果自身属性 `O[P]` 存在的话，它包含属性描述器，否则 `current` 为 `undefined`

操作的结果是一个布尔值，表示操作是否成功。失败可能导致不同的后果。一些调用者会忽略这些结果，而有些调用者，比如 `Object.defineProperty()` ，在结果为 `false` 时抛出 `TypeError`。

下面是这个算法的总结：

- 如果 `current` 是 `undefined`， 表示属性 `P` 目前还不存在，必须被创建
  - 如果 `extensible` 为 `false`（即对象不可扩展），返回 `false`，表示属性不能被添加
  - 否则，检查 `Desc`，并且创建一个数据属性或者访问器属性
  - 返回 `true`
- 如果 `Desc` 不存在任何字段，返回 `true`，表示这个操作成功了（因为不需要做任何改变）
- 如果 `current.[[Configurable]]` 是 `false`（译者注：即对象不可配置）：
  - （`Desc` 不允许改变除 `value` 之外的任何特性）
  - 如果 `Desc.[[Configurable]]` 存在，它必须和 `current.[[Configurable]]` 是一样的值，如果不是，则返回 `false`
  - 对 `Desc.[[Enumerable]]` 执行相同的检测
- 接下来：我们 *验证* 属性描述器 `Desc`, `current` 所描述的特性值是否可更改为 `Desc` 指定的值？如果不能，则返回 `false`;如果可以，则继续：
  - `If` 描述器是 *通用的*（即没有指定为数据属性还是访问器属性，译者注：即只指定了 `configurable | enumerable`），则验证通过，我们继续
  - `Else if` 一个描述器指定了数据属性，而另一个指定为了访问器属性：
    - 当前属性必须是可以配置的（否者它的特性无法根据需要进行更改）。如果不可配置，则返回 `false`
    - 将当前属性从数据属性更改为访问器属性，反之亦然。当这样做时，`.[[Configurable]]` 和 `.[[Enumerable]]` 的值会保存下来，其它特性得到 [默认值](https://exploringjs.com/deep-js/ch_property-attributes-intro.html#property-attributes)（对象值特性为 `undefined`，布尔值特性为 `false`）
  - `Else if` 2个描述器都为数据属性：
    - 如果 `current.[[Configurable]]` 和 `current.[[Writable]]` 都是 `false`，则不允许任何改变发生，`Desc` 和 `current` 必须指定相同的特性：
      - （因为 `current.[[Configurable]]` 为 `false`, `Desc.[[Configurable]]` 和 `Desc.[[Enumerable]]` 在先前已经被检验，并且已经为正确值）
      - 如果 `Desc.[[Writable]]` 存在，并且是 `true`，则返回 `true`
      - 如果 `Desc.[[Value]]` 存在，并且和 `current.[[Value]]` 值不相同，则返回 `false`
      - 没有其他要做的了，返回 `true` 表示算法成功
      - (*正常情况下，对不可配置属性，我们只能改变其value，而不能更改其它特性，但是存在一个例外规则，我们可以将可写特性更改为不可写。这个算法会正确的处理这个例外情况*)😅
  - `Else` （2个描述器都是访问器属性：）
    - 如果 `current.[[Configurable]]` 是 `false`，则不允许任何改变。并且 `Desc` 和 `current` 必须指定相同特性：
      - （由于 `current.[[Configurable]]` 已经为 `false`，`Desc.[[Configurable]]` 和 `Desc.[[Enumerable]]` 在之前已经校验，并且拥有正确的值） 
      - 如果 `Desc.[[Set]]` 存在，它必须和 `current.[[Set]]` 的值一样，否则返回 `false`
      - `Desc.[[Get]]` 执行相同的校验
      - 没有更多要做的了。返回 `true` 表示算法成功。
- 设置属性 `P` 的特性为 `Desc` 指定的值。通过验证，我们能确保所有的改变是允许的
- 返回 `true`





<p id="3"></p>



## 3️⃣ 定义和赋值实践（Definition and assignment in practice）

本节描述属性定义和赋值工作的一些结果。



<p id="3.1"></p>



### 3.1 只有定义允许使用任何特性创建属性

如果我们通过**赋值**的方式创建一个自身属性，它总是将 `writable` & `enumerable` & `configurable` 特性设置为 `true`:

```js {7-9}
const obj = {}
obj.dataProp = 'abc'
assert.deepEqual(
  Object.getOwnPropertyDescriptor(obj, 'dataProp'),
  {
    value: 'abc',
    writable: true,
    enumerable: true,
    configurable: true
  }
)
```

**因此，如果我们想要指定任意特性，我们必须使用 定义 的方式**。

并且，我们可以在对象字面量中创建 `getters` & `setters`，但是我们不能之后通过赋值的方式添加访问器属性，**是的，我们需要使用定义😏**。



<p id="3.2"></p>



### 3.2 赋值操作符不会改变原型中的属性

让我们看看下面示例，`obj` 从 `proto` 继承了 `prop` 属性:

```js
const proto = { prop: 'a' }
const obj = Object.create(prop)
```

我们不能通过给 `obj.prop` 赋值的方式（破坏性的）改变 `proto.prop`。这样做只会创建一个新的自身属性：

```js {6,12-13}
assert.deepEqual(
  Object.keys(obj),
  []
)

// 赋值
obj.prop = 'b'

// 赋值生效
assert.equal(obj.prop, 'b')

// 但是我们创建的是自身的属性，尝试覆盖 proto.prop
// 并没有改变原型上的属性
assert.deepEqual(
  Object.keys(obj),
  ['prop']
)
assert.equal(proto.prop, 'a')
```

这种行为的理由如下：

原型拥有自己的属性，它的值被所有后代共享。如果我们只想改变它的一个后代中的该属性，我们必须非破坏性的，通过覆盖的形式完成，这样就不会影响到其它后代。



<p id="3.3"></p>



### 3.3 ⭐赋值会调用setters，而定义不会

定义 `obj` 的属性 `prop` 和给它赋值有什么区别呢？

👩🏻‍🏫 如果我们使用**定义**，则我们的意图要么是为了创建一个自身的（非继承的）属性，要么是为了改变一个自身的属性。因此，**下例中定义会忽略 `.prop` 继承的setter**:

🌰

```js {7,17,25,28}
let setterWasCalled = false
const proto = {
  get prop() {
    return 'protoGetter'
  },
  set prop(x) {
    // 🚨 注意这里并没有进行赋值操作 this.prop = x
    setterWasCalled = true
  }
}
// obj 的原型是 proto
const obj = Object.create(proto)

// 原型上的属性
assert.equal(obj.prop, 'propGetter')

// 定义 obj.prop 添加到对象自身
Object.defineProperty(
  obj,
  'prop',
  {
    value: 'objData'
  }
)
// 💡 可以看出 原型中的 setter并没有被触发
assert.equal(setterWasCalled, false)

// 创建了的自身属性，掩盖了原型上的同名属性
assert.equal(obj.prop, 'objData')
```

而，如果我们使用 **赋值**，则我们的意图一般是改变**已经存在的东西**，并且 **该改变会通过 setter 处理** 🤔

```js {7,16,18,22-23}
let setterWasCalled = false
const proto = {
  get prop() {
    return 'protoGetter'
  },
  set prop(x) {
    // 🚨 注意这里并没有进行赋值操作 this.prop = x
    setterWasCalled = true
  }
}
// obj 的原型是 proto
const obj = Object.create(proto)

assert.equal(obj.prop, 'propGetter')

// 给 obj.prop 赋值
obj.prop = 'objData'
// 📚 赋值会触发原型上的 setter
assert.equal(setterWasCalled, false)

// 📚 getter仍是激活的
// 因为上面的 setter 中并没有进行赋值
// 所以这里的 obj.prop 仍旧是 'propGetter'
assert.equal(obj.prop, 'protoGetter')
```



<p id="3.3"></p>



### 3.4 继承的只读属性阻止通过赋值创建自己的属性

假如原型的属性 `.prop` 是只读的，会发生什么呢？

```js {6}
const proto = Object.defineProperty(
  {},
  'prop',
  {
    value: 'protoValue',
    writable: false
  }
)
```

👩🏻‍🏫 **任何从 `proto` 继承只读属性 `.prop` 的对象，都不能通过赋值的方式创建自身同名属性**

🌰：

```js {1,5-6}
'use strict';

const obj = Object.create(proto)
assert.throw(
  // 尝试在对象上使用赋值的方式 创建同名属性
  () => obj.prop = 'objValue',
  /^TypeError: Cannot assign to read only property 'prop'/
)
```

为什么我们不能赋值呢？理由是，通过创建自身属性的方式覆盖继承的属性，被视作是 [非破坏性改变](https://exploringjs.com/deep-js/ch_updating-destructively-and-nondestructively.html) 继承的属性。**按理说，如果一个属性是不可写的，我们不能去覆盖它**。

🤣 然而，**定义** `.prop` 仍可正常工作，让我们覆盖它：

```js {9}
Object.defineProperty(
  obj,
  'prop',
  {
    value: 'objValue'
  }
)

assert.equal(obj.prop, 'objValue')
```

*没有 `setter` 的访问器属性，也可被认作是只读属性*：💡

```js {11-12}
'use strict';

const proto = {
  get prop() {
    return 'protoValue'
  }
}
const obj = Object.create(proto)

assert.throw(
  // 尝试在对象上使用赋值的方式 创建同名属性
  () => obj.prop = 'objValue',
  /^Uncaught TypeError: Cannot set property x of #<Object> which has only a getter'/
)
```

💡 *override mistake*: 优点和缺点

事实上，原型链上只读属性阻止赋值，之前称之为 *override mistake*:

- 它在ECMAScript5.1 中被引入

- 一方面，这种行为和原型链继承以及setters工作原理保持一致性（所以，这并不是一个错误😅）

- 另一方面，这种行为，在深度冻结全局对象时，会引发不想要的副作用

- 曾尝试改变这种行为，但会破坏Lodash这个库，因此被放弃了 [PR On GitHub](https://github.com/tc39/ecma262/pull/1320#issuecomment-443485524)

- 背景知识

  - [PR On GitHub](https://github.com/tc39/ecma262/pull/1307)
  - [Wiki page onn ECMAScript](http://wiki.ecmascript.org/doku.php?id=strawman:fixing_override_mistake)

  

<p id="4"></p>



## 4️⃣ 哪些语言构造使用定义，哪些使用赋值？

这一节，我们看看语言构造中哪些是使用定义，哪些又是使用赋值的。**我们通过跟踪是否调用了继承的setter来检测使用了哪个操作。** 可以查看上面 `3.3` 这一小节。



<p id="4.1"></p>



### 4.1 ⭐对象字面量的属性是通过定义添加的

👩🏻‍🏫 当我们创建属性通过一个对象字面量，JS总是使用定义（因此，永远不会调用继承的setters）：

```js {9-12}
let lastSetterArgument
const proto = {
  set prop(x) {
    lastSetterArgument = x
  }
}

const obj = {
  __proto__: proto, // 字面量的方式添加原型
  // 通过 `定义` 的方式添加
  // 并不会触发原型上的 setter
  prop: 'abc'
}

assert.equal(lastSetterArgument, undefined)
```



<p id="4.2"></p>



### 4.2 赋值操作符 = 总是使用赋值

赋值操作符 `=` 总是使用赋值方式创建或者改变属性

```js {12-13}
let lastSetterArgument
const proto = {
  set prop(x) {
    lastSetterArgument = x
  }
}

const obj = Object.create(proto) 

// 正常赋值
obj.prop = 'abc'
// 💡 可以看出会赋值调用原型setter
assert.equal(lastSetterArgument, 'abc')

// 通过解构方式赋值：
[obj.prop] = ['def']
assert.equal(lastSetterArgument, 'def')
```



<p id="4.3"></p>



### 4.3 ⭐ 公有类字段通过赋值的方式添加



👩🏻‍🏫 即使类中公有字段和赋值语法一样，但是 **它们没有使用赋值的方式创建属性，而是使用定义的方式**（类似对象字面量中的属性）

```js {18,22,28-29,32}
let lastSetterArgument1
let lastSetterArgument2

class A {
  set prop1(x) {
    console.log('A prop1 set')
    lastSetterArgument1 = x
  }
  
  set prop2(x) {
    console.log('A prop2 set')
    lastSetterArgument2 = x
  }
}

class B extends A {
  // 和父类设置器中同名属性
  prop1 = 'one'
  
  constructor() {
    super()
    this.prop2 = 'two'
  }
}

new B()

// 📚 公有字段使用 `定义`
// 因此不会触发原型上的同名setter
assert.equal(lastSetterArgument1, 'undefined')

// 在构造器中，触发 `赋值`
assert.equal(lastSetterArgument2, 'two')
```



<p id="5"></p>



## 5️⃣ 进一步阅读和本章源码

- [Property chains - JS for impatient programmers](https://exploringjs.com/impatient-js/ch_proto-chains-classes.html#prototype-chains)
- [es-discuss mailing list](https://mail.mozilla.org/pipermail/es-discuss/2012-July/024227.html) 当ES只拥有数据属性，并且ES代码无法操作属性特性时，赋值和定义之间的区别就不是很重要了

## 6️⃣ 小结（译者注）

1. 赋值的主要目的是什么？ 做出改变，支持setters（和继承密切相关）
2. 定义的主要目的是什么？ 创建一个自身的属性，忽略继承的setters
3. 理论上，赋值和定义在ECMAScript规范中的算法实现过程
4. 定义可以添加任何属性特性
5. 赋值不会改变原型链上的同名属性
6. 赋值会调用原型上的同名 setter，而定义不会（🚀）
7. 继承只读属性，赋值和父类同名的属性，会抛出错误；而定义不会
8. 对象字面量属性是通过定义形式创建的（🚀）
9. `=` 操作符总是执行赋值操作
10. 类的公有字段通过定义创建；而类构造器中的属性通过赋值创建（🚀）

2022年07月19日23:36:28
