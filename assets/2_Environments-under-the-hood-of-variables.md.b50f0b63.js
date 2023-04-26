import{_ as s,c as a,o as n,O as l}from"./chunks/framework.103df890.js";const o="/deep-javascript-cn/assets/04-recursion-1.2b2205ff.png",p="/deep-javascript-cn/assets/04-recursion-2.e3ce9096.png",e="/deep-javascript-cn/assets/04-recursion-3.f506810c.png",c="/deep-javascript-cn/assets/04-scope-1.f6202637.png",t="/deep-javascript-cn/assets/04-scope-2.25f5e6b3.png",r="/deep-javascript-cn/assets/04-scope-3.7a973295.png",i="/deep-javascript-cn/assets/04-closure-1.b67e274c.png",y="/deep-javascript-cn/assets/04-closure-2.15b4b13a.png",d="/deep-javascript-cn/assets/04-closure-3.5ad9827a.png",v=JSON.parse('{"title":"环境-变量声明的幕后","description":"","frontmatter":{"title":"环境-变量声明的幕后"},"headers":[],"relativePath":"2/Environments-under-the-hood-of-variables.md","lastUpdated":1682474873000}'),F={name:"2/Environments-under-the-hood-of-variables.md"},A=l(`<p>目录：</p><nav class="table-of-contents"><ul><li><a href="#_1️⃣-环境-一种管理变量的数据结构">1️⃣ 环境：一种管理变量的数据结构</a></li><li><a href="#_2️⃣-通过环境进行递归">2️⃣ 通过环境进行递归</a><ul><li><a href="#_2-1-执行代码">2.1 执行代码</a></li></ul></li><li><a href="#_3️⃣-通过环境形成嵌套作用域">3️⃣ 通过环境形成嵌套作用域</a><ul><li><a href="#_3-1-执行代码">3.1 执行代码</a></li></ul></li><li><a href="#_4️⃣-闭包与环境">4️⃣ 闭包与环境</a><ul><li><a href="#_4-1-执行代码">4.1 执行代码</a></li></ul></li></ul></nav><h2 id="_1️⃣-环境-一种管理变量的数据结构" tabindex="-1">1️⃣ 环境：一种管理变量的数据结构 <a class="header-anchor" href="#_1️⃣-环境-一种管理变量的数据结构" aria-label="Permalink to &quot;1️⃣ 环境：一种管理变量的数据结构&quot;">​</a></h2><p>🚀 <em>环境是ECMAScript规范中用于管理变量的一种数据结构</em></p><ul><li>它是一个字典，其keys是变量名，其值是对应变量的值</li><li>每个作用域（<code>scope</code>）都有相关联的环境</li><li>💡环境必须支持以下与变量相关的现象 <ul><li>递归（<code>Recursion</code>）</li><li>嵌套作用域（<code>Nested scopes</code>）</li><li>闭包（<code>Closures</code>）</li></ul></li></ul><p>接下来会用示例演示每一种现象是如何完成的。</p><p id="2"></p><h2 id="_2️⃣-通过环境进行递归" tabindex="-1">2️⃣ 通过环境进行递归 <a class="header-anchor" href="#_2️⃣-通过环境进行递归" aria-label="Permalink to &quot;2️⃣ 通过环境进行递归&quot;">​</a></h2><p>我们先处理递归，演示代码：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">f</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">g</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">y</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">tmp</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">f</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">tmp</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equal</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">g</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">3</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">8</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>对每个函数的调用，你需要为调用的函数的变量（<em>参数和本地变量</em>）刷新存储空间。</p><p>👩🏻‍🏫</p><ol><li>这是通过一种叫做 <em>执行上下文（<code>execution contexts</code>）的<strong>栈</strong>管理的</em>，这个执行上下文指向环境（<code>environments</code>）😎</li><li>环境自身是存在于堆（<code>Heap</code>）中的。存在于堆中是有必要的，因为在执行离开它们的作用域后，它们偶尔会继续存在（闭包现象）。因此它们不能通过栈就行管理</li></ol><p id="2.1"></p><h3 id="_2-1-执行代码" tabindex="-1">2.1 执行代码 <a class="header-anchor" href="#_2-1-执行代码" aria-label="Permalink to &quot;2.1 执行代码&quot;">​</a></h3><p>当执行代码时，我们做下面暂停⏸（<code>pauses</code>）:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">f</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 暂停3</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">g</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">y</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">tmp</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span></span>
<span class="line highlighted"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 暂停2</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">f</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">tmp</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">// 暂停1</span></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equal</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">g</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">3</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">8</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>这个过程是：</p><ul><li>暂停1：在调用 <code>g()</code> 之前</li><li>暂停2：当执行 <code>g()</code> 时</li><li>暂停3：当执行 <code>f()</code> 时</li><li>剩下步骤：每次碰到 <code>return</code> 语句时，一个 <em>执行上下文（<code>execution context</code>）</em> 从栈（<code>stack</code>） 中移除</li></ul><p>步骤图解：</p><p><img src="`+o+'" alt="04-recursion-1"></p><p>👆🏻暂停1 - 在调用 <code>g()</code> 之前：执行上下文栈有一个条目(<code>entry</code>)，指向最顶层的环境（译者注：最顶层环境为全局环境）。在这个环境中有2个条目：一个是<code>f()</code>另一个是 <code>g()</code>。</p><p><img src="'+p+'" alt="04-recursion-2"></p><p>暂停2 - 执行 <code>g()</code> 时：最顶部的执行上下文栈（译者注：调用g()函数时，g()函数压入栈，位于栈的最顶部）指向为 <code>g()</code> 函数创建的环境（新的一个环境）。这个环境包括了参数 <code>y</code> 和本地变量 <code>tmp</code> 2个条目。</p><p><img src="'+e+`" alt="04-recursion-3"></p><p>暂停3 - 当执行 <code>f()</code> 函数时：最上层的执行上下文（译者注：此时是 <code>f(x)</code> 在栈的最上层）指向 <code>f()</code> 创建的环境。</p><p id="3"></p><h2 id="_3️⃣-通过环境形成嵌套作用域" tabindex="-1">3️⃣ 通过环境形成嵌套作用域 <a class="header-anchor" href="#_3️⃣-通过环境形成嵌套作用域" aria-label="Permalink to &quot;3️⃣ 通过环境形成嵌套作用域&quot;">​</a></h2><p>使用下面代码探索如何通过环境形成嵌套作用域（<code>Nestes Scopes</code>）:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">f</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">square</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">result</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">result</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">sqaure</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equal</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">f</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">6</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">36</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>这里我们有3个嵌套作用域：最上层的作用域（译者注：全局作用域），<code>f()</code> 的作用域，<code>square()</code> 的作用域。观察：</p><ul><li>📚作用域是连在一起的。内部作用域继承所有外部作用域的变量，除了哪些被遮挡（<code>shadowed</code>）的变量（译者注：比如外部作用域定义了一个 <code>const a = 10</code>, 而内部作用域也定义了一个 <code>a</code> 变量，则内部作用域的变量 <code>a</code> 会遮挡外部作用域的变量 <code>a</code>）</li><li>嵌套作用域是独立于递归的机制。递归最好由独立的环境堆管理，而嵌套作用域则表示环境与其创建环境之间的关系</li></ul><p>🚀 因此，<em>每个作用域的环境通过一个名为 <code>outer</code> 的属性指向它周围作用域的环境</em>。</p><ul><li>当我们查询一个变量的值时，我们先在当前环境中搜索该名字的变量</li><li>如果找不到就在其外部环境（<code>outer environment</code>）中查找，如果还找不到，就接着在外部环境的外部环境中查找（译者注：类似原型链）</li><li>当前环境能访问整个外部环境链中包含的所有变量（除了遮挡的变量）</li></ul><p>🚀 <em>当你调用函数时，就会创建一个新的环境</em>。当前环境的外部环境是创建该函数的环境📚。为了帮助设置通过函数调用而生成的环境的 <code>outer</code> 属性，每个函数内部有一个叫 <code>[[Scope]]</code> 的属性会指向其出生环境（<code>birth environment</code>） 🤩。</p><p id="3.1"></p><h3 id="_3-1-执行代码" tabindex="-1">3.1 执行代码 <a class="header-anchor" href="#_3-1-执行代码" aria-label="Permalink to &quot;3.1 执行代码&quot;">​</a></h3><p>下面是我们执行代码是的暂停点：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">f</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">square</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">result</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span></span>
<span class="line highlighted"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 暂停3</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">result</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span></span>
<span class="line highlighted"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 暂停2</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">sqaure</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">// 暂停1</span></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equal</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">f</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">6</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">36</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>这个过程是：</p><ul><li>暂停1 - 在调用 <code>f()</code> 函数前</li><li>暂停2 - 当执行 <code>f()</code> 函数时</li><li>暂停3 - 当执行 <code>square()</code> 函数时</li><li>之后，<code>return</code> 语句函数出栈</li></ul><p>步骤图解：</p><p><img src="`+c+'" alt="04-scope-1"></p><p>👆🏻暂停1 - 在调用 <code>f()</code> 函数前：最上层环境（全局环境）有一个条目，即 <code>f()</code>。 而 <code>f()</code> 函数的出生环境为最上层环境（译者注：即这里的全局环境）。因此 f 函数的 <code>[[Scope]]</code> 指向这个全局环境。</p><p><img src="'+t+'" alt="04-scope-2"></p><p>暂停2 - 当执行 <code>f()</code> 函数时：现在已经存在一个调用 <code>f(6)</code> 的环境了（译者注：全局环境）。全局环境是<code>f()</code> 函数执行时所生成的环境的出生环境，因此执行 <code>f()</code> 函数的环境的 <code>outer</code> 属性指向全局环境。而新函数 <code>square()</code> 的 <code>[[Scope]]</code> 指向创建它的环境（即这里的 f(x)执行生成的环境）。</p><p><img src="'+r+`" alt="04-scope-3"></p><p>暂停3 - 当执行 <code>square()</code> 函数时：重复先前模式：square函数执行生成的环境的 <code>outer</code> 指向其 <code>[[Scope]]</code> 指向的环境。<em>作用域链通过 <code>outer</code> 属性创建，包含所有活动的变量📚</em>。例如，如果我们愿意的话，可以访问 <code>result</code> &amp; <code>square</code> &amp; <code>f</code> 变量。环境反应了变量的2个方面：</p><ol><li>外部环境链反应了嵌套静态作用域</li><li>执行上下文栈反应了正在动态调用哪一个函数</li></ol><p id="4"></p><h2 id="_4️⃣-闭包与环境" tabindex="-1">4️⃣ 闭包与环境 <a class="header-anchor" href="#_4️⃣-闭包与环境" aria-label="Permalink to &quot;4️⃣ 闭包与环境&quot;">​</a></h2><p>为了了解环境如何用于实现 <a href="https://exploringjs.com/impatient-js/ch_variables-assignment.html#closures" target="_blank" rel="noreferrer">闭包（<code>closures</code>）</a>，我们使用下面示例：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">add</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">y</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// A</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equal</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">add</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">3</span><span style="color:#A6ACCD;">)(</span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">4</span><span style="color:#A6ACCD;">) </span><span style="color:#676E95;font-style:italic;">// B</span></span></code></pre></div><p>这里发生了什么？<code>add()</code> 是一个函数，它返回另一个函数。当我们在B行位置调用嵌套函数 <code>add(3)(1)</code> 时，第一个参数是给 <code>add()</code> 的，第2个参数则是给它返回的函数的。 <em>这是可行的，因为在A行位置创建的函数在离开出生作用域（<code>birth scope</code>）时不会失去与该作用域的连接。</em> 关联的环境通过这种联系得以存活下来，函数仍可访问变量 那个环境中的 <code>x</code>（x在该函数中被释放）。</p><p>这种嵌套调用 <code>add()</code> 的方式有个优点：你可以先调用第一个函数，得到一个参数已经填充的 <code>add()</code> 版本：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> plus2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">add</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#82AAFF;">assert</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">plus2</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">5</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">7</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>📚将一个有2个参数的函数转换为参数各1个的2个嵌套的函数，这称之为库里（<code>currying</code>）, <code>add()</code> 就是一个库里化的函数。</p><p>只填充函数的部分参数称之为 <em>部分应用（<code>partial application</code>）</em> （函数还没有完全应用）。<a href="https://exploringjs.com/impatient-js/ch_single-objects.html#function-prototype-bind" target="_blank" rel="noreferrer">bind()</a> 函数便执行了部分应用。在上面的例子中，我们可以发现，对一个函数进行库里化，部分应用变得很简单。</p><p id="4.1"></p><h3 id="_4-1-执行代码" tabindex="-1">4.1 执行代码 <a class="header-anchor" href="#_4-1-执行代码" aria-label="Permalink to &quot;4.1 执行代码&quot;">​</a></h3><p>当我们执行上面代码时，添加3个暂停点：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">add</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">y</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 暂停3：plus2(5)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 暂停1：add(2)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> plus2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">add</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">// 暂停2</span></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equal</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">plus2</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">5</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">7</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>这个过程是：</p><ul><li>暂停1 - 在执行 <code>add(2)</code> 过程</li><li>暂停2 - 在执行 <code>add(2)</code> 之后</li><li>暂停3 - 当执行 <code>plus2(5)</code> 时</li></ul><p>步骤图解：</p><p><img src="`+i+'" alt="04-closure-1"></p><p>👆🏻暂停1 - 在执行 <code>add(2)</code> 过程：这里可以看到 <code>add()</code> 返回的函数已经存在（右下角），因此返回的函数的内部属性 <code>[[Scope]]</code> 指向它的出生环境（<code>birth environment</code>）。</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>plus2</code> 处于临时死区（<code>TDZ</code>） ，未被初始化。</p></div><p><img src="'+y+'" alt="04-closure-2"></p><p>🚀暂停2 - 在执行 <code>add(2)</code> 之后：<code>plus2</code> 现在指向 <code>add(2)</code> 返回的函数。该函数通过 <code>[[Scope]]</code> 属性保持它的出生环境（即 <code>add(2)</code> 执行环境）在 <code>add(2)</code> 执行完成出栈之后仍旧存活。</p><p><img src="'+d+'" alt="04-closure-3"></p><p>暂停3 - 当执行 <code>plus2(5)</code> 时：执行 <code>plus2(5)</code> 产生的新环境的 <code>outer</code>属性指向 <code>plus2</code> 指向的 <code> [[Scope]]</code> 指向的环境，这也是为什么当前函数能访问 <code>x</code> 的原因 😎。</p><p>原文链接：</p><ul><li><a href="https://exploringjs.com/deep-js/ch_environments.html" target="_blank" rel="noreferrer">4 Environments: under the hood of variables</a></li></ul><p>2022年07月05日01:04:21</p><p>PS: 相比于原版配图，自己画的图添加了一些色彩和注解，但整体流程是一致的。</p>',76),D=[A];function C(u,h,f,g,m,_){return n(),a("div",null,D)}const x=s(F,[["render",C]]);export{v as __pageData,x as default};