---
title: 结构算法
---
目录：
[[toc]]



本章，我们将从不同角度看解构：作为递归匹配算法。

*这个算法让我们更好的理解默认值。* 这将在最后有用，我们将试图找出以下两个函数的不同之处:

```js
function move({x = 0, y = 0} = {}) { }
function move({x, y} = { x: 0, y: 0}) {}
```



<p id="1"></p>



## 1️⃣ 为模式匹配算法做准备

📚 解构赋值看起来如下：

```bash
«pattern» = «value»
```

*我们想使用 `pattern` 从 `value` 中提取数据*。

👩🏻‍🏫 我们将学习一种执行这种赋值的算法。 这个算法在函数式编程成称之为 *模式匹配（`pattern matching` 简称为：匹配）* 😎。它指定操作符 `←` (" match against ")，该操作符将 *模式* 与 *值* 匹配，并在这样做时赋值给变量:
```bash
«pattern» ← «value»
```

我们这里只探索解构赋值，但是解构变量声明（`destructuring variable declarations`）和 解构参数定义（`destructuring parameter definitions`） 工作原理类似。我们也不会深入一些高级功能：计算属性keys，属性值简写，以及对象属性和数组元素作为赋值的目标，这些都超出了本章的范围。

匹配操作符的规范由声明性规则组成，这些规则深入到两个操作数的结构中。声明符号可能需要一段时间适应，但是它使得规范更加的简洁。



<p id="1.1"></p>



### 1.1 使用声明式规则指定匹配算法

本章中使用的声明式规则对输入进行操作，并通过副作用（`side effects`）的形式产生算法的结果。下面就是这样的一个规则📚：

```bash {1}
// 规则 (2c)
{key: «pattern», «properties»} ← obj // head

«pattern» ← obj.key                  // body
{«properties»} ← obj
```

这个规则包含下面部分：

1. `(2c)` 是规则的编号（number），这个编号用于表示该规则
2. 头（`head` 第一行） 描述，输入必须是什么样子的，才能应用这个规则
3. 主体（`body` 后面2行）描述应用规则后会发生什么



在规则 `(2c)` 中，head意味着如果存在具有至少一个属性（其键是 `key`）和零个或多个剩余属性的对象模式，则可以应用此规则。*这个规则的效果是继续执行与 `obj.key` 匹配的属性值模式和其他属性和 `obj` 相匹配。*



让我们考虑本章另一个规则：

```bash {1}
// 规则 (2e)
{} ← obj(no properties left)  // head

// 我们已经完成了               // body
```

在规则 `(2e)` 中， head表示，如果空对象模式 `{}` 与值obj匹配，则执行此规则。而body则表示，这种情况下，我们已经完成了。

🚀 **规则`(2c)`和规则`(2e)`共同形成一个声明性循环，在箭头左侧的模式属性上迭代。**



<p id="1.2"></p>



### 1.2 基于声明式规则计算表达式

*完成算法是通过一系列声明式规则指定的。😎* 假设我们想计算下面匹配表达式：

```bash
{first: f, last: l} ← obj
```

为了应用一系列规则，我们从上到下检查他们，然后执行第一个可应用的规则。如果该规则body中存在匹配表达式，则该规则再次被应用，依此类推。

*📚 有时head会包含一个条件来决定规则是否可被应用*， 比如：

```bash {1}
// 规则 (3a)
[«elements»] ← non_iterable    // head
if (!isIterable(non_iterable)) // head中的条件

	throw new TypeError();         // body
```



<p id="2"></p>



## 2️⃣ ⭐模式匹配算法



<p id="2.1"></p>



### 2.1 模式

🚀🚀 一个模式是下面中的某一种：

- 一个变量： `x`
- 一个对象模式： `{«properties»}`
- 一个数组模式：`[«elements»]`



接下来的三个部分指定了在匹配表达式中处理这三种情况的规则。



<p id="2.2"></p>



### 2.2 对变量的规则

规则 `1`

```bash {1}
// 规则 1
x ← value (包含 null 和 undefined)
x = value
```



<p id="2.3"></p>



### 2.3 对对象模式的规则

规则 `(2a)`:

```bash
{«properties»} ← undefined (illegal value)
 
throw new TypeError();
```

规则 `(2b)`:

```bash
{«properties»} ← null (illegal value)

throw new TypeError();
```

规则 `(2c)`:

```bash
{key: «pattern», «properties»} ← obj

«pattern» ← obj.key  // 表示 obj.key 匹配 pattern
{«properties»} ← obj // 表示 obj 其余属性匹配 properties
```

规则 `(2d)`:

```bash
{key: «pattern» = default_value, «properties»} ← obj

const tmp = obj.key
if (tmp !== undefined) {
	«pattern» ← tmp  // 如果匹配的值不为 undefined 则直接匹配
} else {
	«pattern» ← default_value // 如果匹配的值为undefined 则将 默认值匹配给模式
}
{«properties»} ← obj
```

规则 `(2e)`:

```bash
{} ← obj (no properties left)

// We are finished
```

- 规则 `2a` & `2b` 处理非法值
- 规则 `2c-2e` 循环遍历模式的属性
- 规则 `2d` 表示如果没有匹配到 `obj` 中的属性，则使用默认值



<p id="2.4"></p>



### 2.4 对数组模式的规则

**数组模式和可迭代**。数组解构算法从数组模式和可迭代开始：

规则 `(3a)`:

```bash
[«elements»] ← non_iterable (illegal value)
if (!isIterable(non_iterable))

	throw new TypeError();
```

规则 `(3b)`:

```bash
[«elements»] ← iterable
if (isIterable(iterable)) // 如果是可迭代的

	const iterator = iterable[Symbol.iterator](); // 获取迭代器
	«elements» ← iterator
```

辅助函数：

```js
function isIterable(value) {
  return (
    value !== null
    && typeof value === 'object'
    && typeof value[Symbol.iterator] === 'function' // 可迭代对象包含 [Symbol.iterator] 方法
  )
}
```

**数组元素和迭代器**。这个算法继续：

- 模式元素（箭头左侧 `«elements»`）
- 迭代器通过可迭代获取（箭头右侧 `iterator`）

下面是规则：

规则 `(3c)`:

```bash
«pattern», «elements» ← iterator

«pattern» ← getNext(iterator) // 最后一个item是 undefined
«elements» ← iterator
```

规则 `(3d)`:

```bash
«pattern» = default_value, «elements» ← iterator

const tmp = getNext(iterator);  // 最后一个item是 undefined
if (tmp !== undefined) {
  «pattern» ← tmp
} else {
  «pattern» ← default_value
}
«elements» ← iterator
```

规则 `(3e)`:

```bash
, «elements» ← iterator (hole, elision) // `,` 表示第一个元素跳过匹配

getNext(iterator); // skip
«elements» ← iterator
```

规则 `(3f)`: (spreading操作符)

```bash
 ...«pattern» ← iterator  // (always last part!) 展开符总是在最后
 
const tmp = [];
for (const elem of iterator) {
  tmp.push(elem);
}
«pattern» ← tmp
```

规则 `(3g)`: 

```bash
← iterator   // (no elements left) 没有剩余元素了

// We are finished
```

辅助函数：

```js
function getNext(iterator) {
  const { done, value } = iterator.next()
  return (done ? undefined : value)
}
```

**一个迭代器结束和对象中属性缺失类似。😅**





<p id="3"></p>



## 3️⃣ 空对象模式和空数组模式

这个算法规则存在有趣的结果：*我们可以解构空对象模式和空数组模式*。😎 (译者注：模式是箭头左侧，值是箭头右侧， `«pattern» ← «value»`)

给定一个空对象模式 `{}`：如果待解构的值既不是 `undefined` 也不是 `null`，则什么也不会发生，否则，如果对 `undefined | null` 进行解构，会抛出 `TypeError`

```js {1,4}
// 被解构的既不是 `undefined` 也不是 `null`
const {} = 123  // OK

// 解构 null 直接抛出 TypeError
assert.throws(
  () => {
    const {} = null
  },
  /^TypeError: Cannot destructure 'null' as it is null.$/
)
```

给定一个空的数组模式 `[]` ： 如果被解构的值是可迭代的，则什么也不会发生，否则，，会抛出 `TypeError`

```js {6}
// 字符串是可迭代的
const [] = 'abc' // OK

assert.throws(
  () => {
    const [] = 123 // 数字是不可迭代的
  },
  /^TypeError: 123 is not iterable$/
)
```

换句话讲：**空解构模式（`Empty destructuring patterns`） 强制 值（`value`）必须符合某种特质，但是没有任何效果**



<p id="4"></p>



## 4️⃣ 应用该算法

📚 在JS中，具名参数通过对象进行模拟：调用者（`the caller`， 函数执行）使用对象字面量，被调用者（`the callee` ， 函数定义）使用解构。这种模拟可参考 [named-parameters - impatient-js](https://exploringjs.com/impatient-js/ch_callables.html#named-parameters) 。 下面示例🌰：`move1()`有2个参数 `x` & `y` ：

```js
function move1({x = 0, y = 0} = {}) { // A
  return [x, y]
}

assert.deepEqual(
  move1({x: 3, y: 8}),
  [3, 8]
)

assert.deepEqual(
  move1({x: 3}),
  [3, 0]
)

assert.deepEqual(
  move1({}),
  [0, 0]
)

assert.deepEqual(
  move1(),
  [0, 0]
)
```

`A` 行中有3个默认值：

- 前2个默认值（`{x = 0, y = 0}`）允许我们忽略 `x` & `y`
- 第3个默认值（`{x = 0, y = 0} = {}`）允许我们调用 `move1()` 不传入参数

为什么我们要像上面那样定义参数，而不是像下面呢：

```js
function move2({x, y} = {x: 0, y: 0}) {
  return [x, y]
}
```

为了查看为什么 `move1()` 是正确的，我们将在2个例子中同时用2个函数。在这之前，我们先看看传入的参数如何通过 *匹配* 来解释😎。



<p id="4.1"></p>



### 4.1 背景：通过匹配传入参数

对于函数调用，*形参（在函数定义内）与实参（在函数调用内）相匹配*。作为示例，下面分别是函数定义和函数调用：

```js
// 函数定义
// a, b 是形参
function func(a = 0, b = 0) {}

// 函数调用 
// 1, 2是实参
func(1, 2)
```

参数 `a` & `b` 的设置类似下面解构：

```bash
[a=0, b=0] ← []
```



<p id="4.2"></p>



### 4.2 使用 move2()

我们先看看函数 `move2` 中的解构效果。

> **示例1**🌰 调用 `move2()`

 导致下面解构：

```bash
[{ x, y } = { x: 0, y: 0}] ← []
```

左侧的单数组元素模式没有匹配到右侧的空数组值，这也是为什么 `{x, y}` 匹配默认值，而不是来自右侧的数据（规则 `3b` & `3d`）:

```bash
{ x, y } ← { x: 0, y: 0 }
```

左侧包含 *属性值简写（`property value shorthands`）*。它实际的形式为：

```bash
{ x: x, y: y } ← { x: 0, y: 0 }
```

这个解构导致下面2个赋值（规则 [2c](#2.4) & 规则 [1](#2.1)）:

```js
x = 0;
y = 0;
```

这是我们想要的。但是，下面例子中，我们就没有那么幸运了。



>  **示例2**🌰 我们调用 `move2({z: 3})`

这将导致如下解构：

```bash
[{ x, y } = { x: 0, y: 0}] ← [{ z: 3 }]
```

右侧在数组索引 `0` 位置有一个数组元素。因此，默认值被忽略，下一个步骤是（规则 [3d](#2.4)）:

```bash
{ x, y } ← { z: 3 }
```

这导致x和y都被设置为 `undefined`，这并不是我们想要的😥。问题在于 `{x, y}` 没有匹配默认值，而是匹配到了 `{z: 3}`



<p id="4.3"></p>



### 4.3 使用 move1()

>  **示例1**🌰 调用 `move1()` 

导致下面解构：

```bash
[{ x=0, y=0} = {}] ← []
```

右侧数组元素为空，因此使用默认值（规则 [3d](#2.4)）:

```bash
{x=0, y=0} ← {}
```

左侧包含属性简写，相当于：

```bash
{x: x=0, y: y=0} ← {}
```

`x` 和 `y` 都没有匹配到右侧的空对象值。因此，默认值被使用，下面结构被执行 （规则 [2d](#2.3)）:

```bash
x ← 0
y ← 0
```

这将导致下面赋值（规则 [1](#2.1)）：

```js
x = 0
y = 0
```

这正是我们想要的。





> **示例2**🌰 move1({z: 3})

解构：

```bash
[{x=0, y=0} = {}] ← [{ z: 3 }]
```

数组模式第一个元素匹配右侧，这个匹配导致解构继续（规则 [3d](#2.4)）:

```bash
{ x=0, y=0 } ← { z: 3 }
```

和示例1一样，右侧不存在x,y属性，因此默认值被使用：

```js
x = 0
y = 0
```

这正是我们想要的🤩。现在 `x & y` 和 `{z: 3}` 再去匹配不再是问题，因为它们拥有本地默认值。



<p id="4.4"></p>



### 4.4 总结：默认值是模式部分的一个功能

上面例子展示了默认值是模式部分（即模式匹配的左侧部分，对象属性或者数组元素）。如果某个部分没有匹配或者匹配了 `undefined`，则默认值将会被使用。即，**使用模式匹配默认值代替**。😎





译者注：

1. 从模式匹配的角度讲解解构
2. 模式匹配分为 **左侧 模式** + **右侧 值**
3. 模式匹配的3种情形
   1. 变量赋值
   2. 对象模式匹配
   3. 数组模式匹配
4. 空对象模式和空数组模式匹配对右侧值部分的要求
   1. 空对象模式要求值不能为 `null` | `undefined` ，否则抛出错误
   2. 空数组模式要求值具有可迭代，否则抛出错误
5. 不同默认参数的写法，会导致不同的模式匹配，从而产生的效果也是不同的



2022年07月14日17:59:59
