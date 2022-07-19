---
title: 保护对象不被修改
---

目录：
[[toc]]

本章我们将学习如何保护对象不被修改。包含例子：阻止属性的添加和改变。

前置知识：*上一章的属性特性*





## 1️⃣ 保护级别：阻止扩展，密封，冻结



JS在对象保护上有3个级别：(译者注：一级比一级严格)

1. *阻止扩展（`preventing extensions`）* 使对象无法添加新的属性。**但是我们仍可以删除和改变属性🚨**;
   - 方法： `Object.preventExtensions(obj)`
2. *密封（`Sealing`）* 在阻止扩展的基础上，也使所有属性变得 *不可配置（`unconfigurable`）*(即我们不能再改变属性的特性，除了将 `writable: true` 特性更改为 `writable: false`)
   - 方法：`Object.seal(obj)`
3. *冻结（`Freezing`）* 使所有属性变得 *不可写（`non-writable`）* 之后再密封对象。即对象不可扩展，所有属性只读，并且没有办法更改
   - 方法：`Object.freeze(obj)`





## 2️⃣ 阻止对象扩展（Prevent extensions of objects）

📒签名： `Object.preventExtensions<T>(obj: T): T`

作用：

1. 如果 `obj` 不是一个对象，则直接返回
2. 否则，它会改变 `obj` 导致我们不能添加属性，然后返回该对象
3. 参数类型 `<T>` 表示返回结果和参数类型一样

🌰：

```js {1,5}
'use strict';

const obj = { first: 'Jane' }
Object.preventExtensions(obj)
// 译者注：严格模式抛出错误 松散模式没有效果
assert.throws(
  () => obj.last = 'Doe',
	/^TypeError: Cannot add property last, object is not extensible$/)
)
```
::: warning
我们仍可删除属性😅：
:::

```js {6,7}
assert.deepEquals(
  Object.keys(obj),
  ['first']
)

// 仍可以删除属性
delete obj.first

assert.deepEquals(
  Object.keys(obj),
  []
)
```


### 2.1 检测对象是否可扩展

📒 签名：`Object.isExtensible(obj: any): boolean`

🌰：

```js
const obj = {}
Object.isExtensible(obj) // true

Object.preventExtensions(obj)
Object.isExtensible(obj) // false
```




## 3️⃣ 密封对象（Sealing objects）

📒 签名：`Object.seal<T>(obj: T): T`

作用：

1. 如果 `obj` 不是一个对象，则直接返回它
2. 否则，它会阻止 `obj` 扩展，将所有属性变为 *不可配置（`unconfigurable`）*，然后返回它。属性变得不可配置，意味着它不能被改变（**除了它的值 🚨**）：只读属性仍旧只读，可枚举属性仍可枚举，等等

🌰 下面示例展示了密封使得对象不可扩展，并且其属性不可配置：

```js {6,26-27,29,38,44}
const obj = {
  first: 'Jane',
  last: 'Doe'
}

// 密封前
assert.equal(Object.isExtensible(obj), true)
assert.deepEqual(
  Object.getOwnPropertyDescriptors(obj),
  {
    first: {
      value: 'Jane',
      writable: true,
      enumerable: true,
      configurable: true
    },
    last: {
      value: 'Doe',
      writable: true,
      enumerable: true,
      configurable: true
    }
  }
)

// 密封
Object.seal(obj)

// 密封后
assert.equal(Object.isExtensible(obj), false) // 不可扩展
assert.deepEqual(
  Object.getOwnPropertyDescriptors(obj),
  {
    first: {
      value: 'Jane',
      writable: true,
      enumerable: true,
      configurable: false // 不可配置
    },
    last: {
      value: 'Doe',
      writable: true,
      enumerable: true,
      configurable: false
    }
  }
)
```

我们先改变属性 `.first` 的值：

```js
obj.first = 'John'
assert.deepEqual(
  obj,
  {
    first: 'John',
    last: 'Doe'
  }
)
```

但是我们不能改变其特性：

```js {1,7}
'use strict';

assert.throw(
  () => Object.defineProperty(obj, 'first', {
    enumerable: false
  }),
  /^TypeError: Cannot redefine property: first$/
)
```
::: tip
译者注：*不可配置的属性，可以将其 `writable: true` 改为 `writable: false`，这个过程是不可逆的*，具体可以参考上一章
:::

```js {7,16}
'use strict';

Object.defineProperty(
  obj,
  'first',
  {
    writable: false // Ok 不会抛出错误
  }
)

Object.getPropertyDescriptor(obj, 'first')
// 打印结果
{
  first: {
    value: 'John',
    writable: false,
    enumerable: true,
    configurable: false
  }
}
```




### 3.1 检测对象是否密封

📒 签名：`Object.isSealed(obj: any): boolean`

🌰：

```js
const obj = {}
Object.isSealed(obj) // false

Object.seal(obj)
Object.isSealed(obj) // true
```




## 4️⃣ 冻结对象（Freezing objects）

📒 签名：`Object.freeze<T>(obj: T): T`

作用：

1. 如果 `obj` 不是一个对象，则直接返回它
2. 否则，它使得 `obj` 上所有属性不可写，然后密封 `obj`，最后返回它。即，*`obj` 不可扩展，所有属性只读，没有办法改变它😎*

🌰：

```js {6,12,18}
'use strict';

const point = { x: 17, y: -5 }
Object.freeze(point)

// 冻结对象不可写，尝试改变只读属性 抛出错误
assert.throws(
  () => point.x = 2,
  /^TypeError: Cannot assign to read only property 'x'/
)

// 冻结对象不可配置，尝试改变属性特性，抛出错误
assert.throws(
  () => Object.defineProperty(point, 'x', { enumerable: false }),
  /^TypeError: Cannot redefine property: x$/
)

// 冻结对象不可扩展 尝试添加新属性 抛出错误
assert.throws(
  () => point.z = 4,
  /^TypeError: Cannot add property z, object is not extensible$/
)
```



### 4.1 检查对象是否被冻结

📒 签名：`Object.isFrozen(obj: any): boolean`

🌰：

```js
const point = {x: 17, y: 5}
Object.isFrozen(point) // false

Object.freeze(point) // 返回冻结后的对象 {x: 17, y: 5}
Object.isFrozen(point) // true
```




### 4.2 冻结是浅冻结

👩🏻‍🏫 `Object.freeze(obj)` 只会冻结 `obj` 和它的属性，**它不会这些对象属性的内部的值**，🌰：

```js
'use strict';

const teacher = {
  name: 'Edna Krabappel',
	students: ['Bart'],
}

Object.freeze(teacher)


// 我们不能改变自身的属性
assert.throws(
  () => teacher.name = 'Elizabeth Hoover',
  /^TypeError: Cannot assign to read only property 'name'/)

// 🚨 但是我们可以改变对象属性内部的值
teacher.students.push('Lisa')

assert.deepEqual(
  teacher, 
  {
    name: 'Edna Krabappel',
    students: ['Bart', 'Lisa'],
  }
)
```





### 4.3 ⭐ 实现深度冻结

如果我们想实现深度冻结，我们可以自己实现：

```js {4,9,}
function deepFreeze(value) {
  if (Array.isArray(value)) {
    for (const element of value) {
      // 如果是对象，遍历每个元素，然后递归
      deepFreeze(element)
    }
    Object.freeze(value) // 对数组进行冻结
  } else if (typeof value === 'object' && value !== null) {
    // 如果 value 是一个对象
    for (const v of Object.values(value)) {
      // 对值进行冻结
      deepFreeze(v)
    }  
    Object.freeze(value) // 对对象进行冻结
  } else {
    // 不用做什么：因为原始值已经是不可变的了
  }
  return value
}
```

对上面的 `teacher` 对象进行深度冻结：

```js {8,9}
const teacher = {
  name: 'Edna Krabappel',
  students: ['Bart'],
}

deepFreeze(teacher)
assert.throws(
  () => teacher.students.push('Lisa'),
  /^TypeError: Cannot add property 1, object is not extensible$/
)
```





## 5️⃣ 进一步阅读

- 更多关于阻止数据结构被改变可参考： [Immutable wrappers for collections](https://exploringjs.com/deep-js/ch_immutable-collection-wrappers.html)



译者注：

1. 本章将的3种保护对象不被修改的方式日常使用的比较少，一般第三方库中可能会使用到，也是比较简单的一章内容
2. 可以参考
   1. [Object.preventExtensions() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)
   2. [Object.seal() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
   3.  [Object.freeze() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
3. 关于冻结为浅冻结，我们可以使用递归的方式，实现深度冻结的方法😎



2022年07月15日22:51:09



