---
title: 正则环视断言
---
目录：
[[toc]]


本章将使用示例探索正则表达式中的 **环视断言（`lookaround assertions`）**。*环视断言是非捕获的，并且对输入字符串当前位置的前或后，必须匹配（或者不匹配）* 。🔥



<p id="1"></p>



## 1️⃣ ⭐ Cheatsheet: 环视断言

可用环视断言列表：

| 模式             | 名称                                  |        |
| ---------------- | ------------------------------------- | ------ |
| `(?=«pattern»)`  | 先行断言（`Positive lookahead`）      | ES3    |
| `(?!«pattern»)`  | 正向否定查找（`Negative lookahead`）  | ES3    |
| `(?<=«pattern»)` | 后行断言（`Positive lookbehind`）     | ES2018 |
| `(?<!«pattern»)` | 反向否定查找（`Negative lookbehind`） | ES2018 |

有4种环视断言：

- 正向断言（`Lookahead assertions`） ES3: 即模式在后，匹配前面的内容， `/x(?=y)/` | `x(?!y)`
  - 先行断言（`Positive lookahead`）:  `(?=«pattern»)` 如果模式**匹配**输入字符串中当前位置**之后**的内容，则匹配。（译者注：🌰 `/Jack(?=Sprat)/` 只有 `Jack` 后面跟着 `Sprat` 时才匹配 `Jack`；比如输入字符串 `JackSprat` 就能匹配上，而 `JackMike` 不能匹配上）
  - 正向否定查找（`Negative lookahead`）：`(?!«pattern»)` 如果模式**不匹配**输入字符串中当前位置**之后**的内容，则匹配。（译者注：🌰 `/Jack(?!Sprat)/` 只有 `Jack` 后面跟着的不是 `Sprat` 时才匹配 `Jack`，比如输入字符串 `JackMike` 就能匹配上，而 `JackSprat` 不能匹配上）
- 反向断言（`Lookbehind assertions`） ES2018: 即模式在前，匹配后面的内容，`/(?<=y)x/` | `(?<!y)x`
  - 后行断言（`Positive lookbehind`）： `(?<=«pattern»)` 如果模式**匹配**输入字符串中当前位置**之前**的内容，则匹配。（译者注：🌰 `/(?<=Jack)Sprat/` 只有 `Sprat` 前面跟着 `Jack` 时才匹配 `Sprat`；比如输入字符串 `JackSprat` 就能匹配上，而 `TomasSprat` 不能匹配上）
  - 反向否定查找（`Negative lookbehind`）： `(?<!«pattern»)` 如果模式**不匹配**输入字符串中当前位置**之前**的内容，则匹配。（译者注：🌰 `/(?<!Jack)Sprat/` 只有 `Sprat` 前面跟着的不是 `Jack` 时才匹配 `Sprat`；比如输入字符串 `ThomasSprat` 就能匹配上，而 `JackSprat` 不能匹配上）

🚀译者注：
::: tip
对于如何理解上面4种环视断言，可以从2个方面来分类：
1. `Lookahead` & `Lookbehind`  确定位置
   1. 分别是 `向前看` & `向后看`
   2. 然后再来看字符串中的前与后，`ABCD` -> `A` 在后，`D` 在前 🚨
   3. 以 `BC` 为例，向前看即看 `D` 位置；向后看即看 `A` 位置
2. `Positive` & `Negative` 确定是与否
   1. `Positive` 表示 **肯定**，即前或后存在该模式才能匹配
   2. `Negative` 表示 **否定**，即前或后不能存在该模式才能匹配

因此上面存在 `2 * 2 = 4` 种组合：
1. `Positive` + `Lookahead` -> `/BC(?=D)/`
2. `Negative` + `Lookahead` -> `/BC(?!D)/`
3. `Positive` + `Lookbehind` -> `/(?<=A)BC/`
4. `Negative` + `Lookbehind` -> `/(?<!A)BC/`
:::


<p id="2"></p>



## 2️⃣ 本章警告

- 示例展示可以通过环视断言能完成任务。但是，正则表达式不总是最好的选择。其他技术，比如合适的解析，可能是更好的选择。
- **反向断言** 是一种相对新的技术，有可能不被所有的JS引擎所支持
- 环视断言可能影响性能，特别是对长字符串的匹配



<p id="3"></p>



## 3️⃣ 例子：指定什么能在匹配前或者后（肯定环视）

下面例子，我们提取引号内的单词：

```js
'how "are" "you" doing'.match(/(?<=")[a-z]+(?=")/g)

// ['are', 'you']
```

2个环视断言帮助我们完成这一任务：

1. `(?<=")` 后行断言，即必须在前面加引号 `"xxx`
2. `(?=")` 先行断言，即必须后面跟着引号 `xxx"`

即被匹配的字符串前后都必须有引号，只有上面的 `are` & `you` 满足匹配。

环视断言对 `.match()` 在 `/g` 模式下特别方便，它会返回整个匹配（捕获组 `0`）。**无论环视断言匹配的模式是什么，都不会被捕获。📚** 如果不使用环视断言，则引号也会被包含到匹配结果中去：

```js
'how "are" "you" doing'.match(/"([a-z]+)"/g)

['"are"', '"you"']
```



<p id="4"></p>

## 4️⃣ 示例：指定什么不能在匹配前或者后（否定环视）

如果想取得和上面例子相反的结果，提取所有没有被字符串包裹的部分？

- 输入： `'how "are" "you" doing'`
- 输出：`['how', 'doing']`

我们第一次尝试，简单的将肯定环视断言转换为否定环视断言。但这会失败：

```js
'how "are" "you" doing'.match(/(?<!")[a-z]+(?!")/g)

['how', 'r', 'o', 'doing']
```

问题在于我们提取的字符序列是没有被引号括起来。意味着在字符串 `'"are"'`的 `r` 在中间也被认为前后没有引号括起来，因为它前面是 `a`，后面是 `e`，完全满足匹配模式。

我们可以通过限定前缀后缀必须既不是引号也不是字母来修复这个问题：

```js
'how "are" "you" doing'.match(/(?<!["a-z])[a-z]+(?!["a-z])/g)

['how', 'doing']
```

💡另一个解决方案是通过`\b`要求字符序列`[a-z]+`以单词边界开始和结束:

```js
'how "are" "you" doing'.match(/(?<!")\b[a-z]+\b(?!")/g)

['how', 'doing']
```

关于 **反向否定查找（`negative lookbehind`）** 和 **正向否定查找（`negative lookahead`）** 很棒的点在于，它们各自都支持在字符串的开头或字符串的结尾 - 正如示例所示.



<p id="4.1"></p>

### 4.1 否定环视断言没有简单的替代方案



否定环视断言是一种很强大的工具，通常不太可能通过其它正则表达式进行模拟。

如果我们不想使用它们，我们通常必须采取一种完全不同的方式。例如，在本例中，我们可以将有引号的和没有引号的单词进行拆分，然后过滤：

```js
const str = 'how "are" "you" doing'

const allWords = str.match(/"?[a-z]+"?/g)
// allWords -> ['how', '"are"', '"you"', 'doing']

// 不带引号的
const unquoteWords = allWords.filter(
  w => !w.startsWith('"') || !w.endsWith('"')
)
// ['how', 'doing']
```

这种方式的好处：

- 对老的JS引擎友好
- 易于理解



<p id="5"></p>



## 5️⃣ 插曲: 指指四周，断言向内

我们目前所见的所有例子都有个共同点，环视断言规定匹配之前或之后必须出现什么字符，但不包括匹配中的这些字符。

本章后续部分展示的正则表达式有所不同：它们的环视断言指向内部，并限制匹配内部的内容。



<p id="6"></p>



## 6️⃣ 示例：匹配不以 `abc` 开头的字符串



假设我们想匹配所有不以 `abc` 开头的字符串。我们首先尝试的正则表达式可能是 `/^(?!abc)/`。

这对 `.test()` 正常工作：

```js
/^(?!abc)/.test('xyz')

// true
```

但是 `.exec()` 返回空字符串😅：

```js {3}
/^(?!abc)/.exec('xyz')

{0: '', index: 0, input: 'xyz', groups: undeinfed}
```

📚 **问题在于，断言，比如环视断言，不会扩展匹配的文字。** 即，它们不会捕获输入字符，它们仅仅对输入的当前位置提出要求。🔥

因此，*解决方式便是，添加一个模式用于捕获输入的字符*：

```js {1}
/^(?!abc).*$/.exec('xyz')

{0: 'xyz', index: 0, input: 'xyz', groups: undeinfed}
```

正如想要的，这个新正则表达式拒绝以 `abc` 作为前缀的字符串：

```js
/^(?!abc).*$/.exec('abc') // null
/^(?!abc).*$/.exec('abcd') // null
```

并且它接受没有完全匹配前缀的字符串：

```js
/^(?!abc).*$/.exec('ab')

{0: 'ab', index: 0, input: 'xyz', groups: undeinfed}
```



<p id="7"></p>



## 7️⃣ 示例：匹配不包含 `.mjs` 的子字符串

下面例子中，我们像找出：

```js
import ... from '«module-specifier»';
```

`module-specifier` 处不能以 `.mjs` 结尾：

```js {9}
const code = `
import {transform} from './util';
import {Person} from './person.mjs';
import {zip} from 'lodash';
`.trim()


assert.deepEqual(
  code.match(/^import .*? from '[^']+(?<!\.mjs)';$/umg),
  [
    "import {transform} from './util';",
    "import {zip} from 'lodash';",
  ])
```

这里，反向否定断言（`(?<!\.mjs)`） 充当 **守卫（`guard`）**，阻止正则表达式匹配在此位置包含 `.mjs` 的字符串。

译者注：上面的flags `umg` 说明:

- `u`： 匹配 unicode
- `m`： 匹配多行
- `g`： 全局匹配



<p id="8"></p>



## 8️⃣ 示例：跳过包含注释的行

场景：我们像解析包含设置的行，跳过注释。比如：

```js
const RE_SETTING = /^(?!#)([^:]*):(.*)$/

const lines = [
  'indent: 2', // setting
  '# Trim trailing whitespace:', // comment
  'whitespace: trim', // setting
]

for (const line of lines) {
  const match = RE_SETTING.exec(line);
  if (match) {
    const key = JSON.stringify(match[1]);
    const value = JSON.stringify(match[2]);
    console.log(`KEY: ${key} VALUE: ${value}`);
  }
}

// 输出
// 'KEY: "indent" VALUE: " 2"'
// 'KEY: "whitespace" VALUE: " trim"'
```

我们如何到达正则表达式 `RE_SETTING` 的？

我们对settings使用下面正则表达式：

```js
/^([^:]*):(.*)$/
```

很直觉的，这是一个包含下面部分的序列：

- 这行的开始位置
- 非 `:` （0至多个）
- 单个 `:`
- 任意字符 （0至多个）
- 结尾位置

这个正则表达式会否定某些comments:

```js
/^([^:]*):(.*)$/.test('# Comment')
// false
```

但是会接受其它的（包含冒号的）：

```js
/^([^:]*):(.*)$/.test('# Comment:')
// true
```

我们可以通过添加 `(?!#)` 前缀作为守卫。直觉上，它表示：输入字符串中的当前位置不能后跟字符`#`。

新的正则表达式正如我们想要的效果：😎

```js
/^(?!#)([^:]*):(.*)$/.test('# Comment:')
// false
```



<p id="9"></p>



## 9️⃣ 示例：智能引号

假如我们想要允许下面通过后斜杠（`\` ）转义的引号怎么办？我们可以在引号前使用 `(?<!\\)` 守卫：

```js
const regExp = /(?<!\\)"(.*?)(?<!\\)"/g
String.raw`\"straight\" andd "curly"`.replace(regExp, '{$1}')
'\\"straight\\" and {curly}'
```

作为后处理步骤，我们仍需要做：

```js
.replace(/\\"/g, `"`)
// '"straight" and {curly}'
```

然后，正则表达式可能失败，当存在后斜杠自己的转义时：

```js
String.raw`Backslash: "\\"`.replace(/(?<!\\)"(.*?)(?<!\\)"/g, '{$1}')

'Backslash: "\\\\"'
```

第二个 `\` 注重了引号变为 `{}`。

我们可以通过将守卫变得更复杂来修复这个问题（💡 `?:` 表示使组变为不可捕获）：

```js
(?<=[^\\](?:\\\\)*)
```

新的守卫允许引号前出现成对的 `\`:

```js
const regExp = /(?<=[^\\](?:\\\\)*)"(.*?)(?<=[^\\](?:\\\\)*)"/g

String.raw`Backslash: "\\"`.replace(regExp, '{$1}')
'Backslash: {\\\\}'
```

我们的问题仍旧存在。这个守卫阻止第一个引号如果出现在开头时被匹配：

```js
const regExp = /(?<=[^\\](?:\\\\)*)"(.*?)(?<=[^\\](?:\\\\)*)"/g

`"abc"`.replace(regExp, '{$1}')
// '"abc"'
```

我们可以将第一个守卫变为： `(?<=[^\\](?:\\\\)*)|^`:

```js
const regExp = /(?<=[^\\](?:\\\\)*|^)"(.*?)(?<=[^\\](?:\\\\)*)"/g

`"abc"`.replace(regExp, '{$1}')

// '{abc}'
```



<p id="10"></p>



## 🔟 鸣谢

- 第一个处理转义 `\` 前的引号的正则表达式来自 [jonasraoni Twitter](https://twitter.com/jonasraoni/status/992506010454683650)



## 1️⃣1️⃣ 进一步阅读

- [Regular expressions (RegExp)](https://exploringjs.com/impatient-js/ch_regexps.html) JS for impatient programmers

译者注：

1. [MDN RegExp 中文版](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions) 可以查看上面术语的中文翻译，以及简单的示例，帮助理解
2. [regex101 正则可视化](https://regex101.com/)





2022年08月01日22:58:09

