import{_ as s,c as n,o as a,a as l}from"./app.bd65658a.js";const i=JSON.parse('{"title":"\u7C7B\u5B9E\u4F8B\u62F7\u8D1D\u6280\u672F","description":"","frontmatter":{"title":"\u7C7B\u5B9E\u4F8B\u62F7\u8D1D\u6280\u672F"},"headers":[{"level":2,"title":"1\uFE0F\u20E3 .clone()\u65B9\u6CD5","slug":"_1\uFE0F\u20E3-clone-\u65B9\u6CD5","link":"#_1\uFE0F\u20E3-clone-\u65B9\u6CD5","children":[]},{"level":2,"title":"2\uFE0F\u20E3 \u9759\u6001\u5DE5\u5382\u65B9\u6CD5","slug":"_2\uFE0F\u20E3-\u9759\u6001\u5DE5\u5382\u65B9\u6CD5","link":"#_2\uFE0F\u20E3-\u9759\u6001\u5DE5\u5382\u65B9\u6CD5","children":[]},{"level":2,"title":"3\uFE0F\u20E3 \u9E23\u8C22\uFF08Acknowledgements\uFF09","slug":"_3\uFE0F\u20E3-\u9E23\u8C22\uFF08acknowledgements\uFF09","link":"#_3\uFE0F\u20E3-\u9E23\u8C22\uFF08acknowledgements\uFF09","children":[]}],"relativePath":"5/Copying-instances-of-classes-clone-vs-copy-constructors.md","lastUpdated":1666666358000}'),p={name:"5/Copying-instances-of-classes-clone-vs-copy-constructors.md"},o=l(`<p>\u76EE\u5F55\uFF1A</p><nav class="table-of-contents"><ul><li><a href="#_1\uFE0F\u20E3-clone-\u65B9\u6CD5">1\uFE0F\u20E3 .clone()\u65B9\u6CD5</a></li><li><a href="#_2\uFE0F\u20E3-\u9759\u6001\u5DE5\u5382\u65B9\u6CD5">2\uFE0F\u20E3 \u9759\u6001\u5DE5\u5382\u65B9\u6CD5</a></li><li><a href="#_3\uFE0F\u20E3-\u9E23\u8C22\uFF08acknowledgements\uFF09">3\uFE0F\u20E3 \u9E23\u8C22\uFF08Acknowledgements\uFF09</a></li></ul></nav><p>\u672C\u7AE0\uFF0C\u6211\u4EEC\u5C06\u770B2\u4E2A\u7528\u4E8E\u5B9E\u73B0\u5BF9\u7C7B\u5B9E\u4F8B\u7684\u62F7\u8D1D\u7684\u6280\u672F</p><ul><li><code>.clone()</code> \u65B9\u6CD5</li><li>\u6240\u8C13\u7684 <strong>\u62F7\u8D1D\u6784\u9020\u5668\uFF08<code>copy constructors</code>\uFF09</strong>,\u6784\u9020\u5668\u63A5\u6536\u53E6\u4E00\u4E2A\u5F53\u524D\u7C7B\u7684\u5B9E\u4F8B\uFF0C\u7136\u540E\u7528\u5B83\u521D\u59CB\u5316\u5F53\u524D\u5B9E\u4F8B</li></ul><p id="1"></p><h2 id="_1\uFE0F\u20E3-clone-\u65B9\u6CD5" tabindex="-1">1\uFE0F\u20E3 .clone()\u65B9\u6CD5 <a class="header-anchor" href="#_1\uFE0F\u20E3-clone-\u65B9\u6CD5" aria-hidden="true">#</a></h2><p>\u8FD9\u4E2A\u6280\u672F\u5728\u9700\u8981\u88AB\u62F7\u8D1D\u7684\u7C7B\u4E2D\u5F15\u5165\u4E00\u4E2A <code>.clone()</code> \u65B9\u6CD5\u3002\u5B83\u8FD4\u56DE\u4E00\u4E2A <code>this</code>\uFF08\u5373\u7C7B\u5B9E\u4F8B\uFF09 \u7684\u6DF1\u62F7\u8D1D\u3002\u4E0B\u9762\u793A\u4F8B\uFF0C\u5C55\u793A\u4E863\u4E2A\u53EF\u88AB\u62F7\u8D1D\u7684\u7C7B\u3002</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Point</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line highlighted"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">clone</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Point</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;">)</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Color</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">name</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line highlighted"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">clone</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Color</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;">)</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ColorPoint</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Point</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">color</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">super</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">color</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">color</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line highlighted"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">clone</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">ColorPoint</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">color</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">clone</span><span style="color:#F07178;">()) </span><span style="color:#676E95;">// A \u{1F6A8}</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u884C <code>A</code> \u5C55\u793A\u4E86\u8FD9\u4E2A\u6280\u672F\u7684\u4E00\u4E2A\u91CD\u70B9\uFF1A\u590D\u5408\u5B9E\u4F8B\u5C5E\u6027\u503C\u5FC5\u987B<strong>\u9012\u5F52\u5730\u514B\u9686</strong>\u3002</p><p id="2"></p><h2 id="_2\uFE0F\u20E3-\u9759\u6001\u5DE5\u5382\u65B9\u6CD5" tabindex="-1">2\uFE0F\u20E3 \u9759\u6001\u5DE5\u5382\u65B9\u6CD5 <a class="header-anchor" href="#_2\uFE0F\u20E3-\u9759\u6001\u5DE5\u5382\u65B9\u6CD5" aria-hidden="true">#</a></h2><p>\u{1F469}\u{1F3FB}\u200D\u{1F3EB} <strong>\u62F7\u8D1D\u6784\u9020\u5668</strong> \u662F\u4F7F\u7528\u5F53\u524D\u7C7B\u7684\u53E6\u4E00\u4E2A\u5B9E\u4F8B\u6765\u8BBE\u7F6E\u5F53\u524D\u5B9E\u4F8B\u7684\u6784\u9020\u5668\u3002</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u62F7\u8D1D\u6784\u9020\u5668\u5728\u4E00\u4E9B\u9759\u6001\u8BED\u8A00\uFF0C\u6BD4\u5982C++\uFF0CJava\u7B49\u8BED\u8A00\u4E2D\u6BD4\u8F83\u6D41\u884C\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7 <strong>\u9759\u6001\u91CD\u8F7D\uFF08<code>static overloading</code>\uFF09</strong> \u7684\u65B9\u5F0F\u63D0\u4F9B\u591A\u4E2A\u7248\u672C\u7684\u6784\u9020\u5668\u3002\u8FD9\u91CC\uFF0C<strong>\u9759\u6001</strong> \u610F\u5473\u7740\u5728\u7F16\u8BD1\u65F6\u9009\u62E9\u4F7F\u7528\u54EA\u4E2A\u7248\u672C\u3002</p></div><p>\u5728JS\u4E2D\uFF0C\u6211\u4EEC\u5FC5\u987B\u5728<strong>\u8FD0\u884C\u65F6</strong>\u505A\u51FA\u51B3\u5B9A\uFF0C\u8FD9\u4E5F\u5BFC\u81F4\u4E00\u4E9B\u4E0D\u4F18\u96C5\u7684\u4EE3\u7801\u{1F605}</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Point</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(...</span><span style="color:#A6ACCD;">args</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">args</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">instanceof</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Point</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#89DDFF;">      </span><span style="color:#676E95;">// \u62F7\u8D1D\u6784\u9020\u5668\uFF08Copy Constructor\uFF09</span></span>
<span class="line highlighted"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">]</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">args</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">]</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">args</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u4F7F\u7528\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> original </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Point</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">4</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#676E95;">// \u{1F4A1}\u4F20\u5165\u53E6\u4E00\u4E2APoint\u5B9E\u4F8B\u5230\u6784\u9020\u5668\u4E2D\u521B\u5EFA\u5F53\u524D\u5B9E\u4F8B \u5B9E\u73B0\u5BF9original\u5B9E\u4F8B\u7684\u62F7\u8D1D</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> copy </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Point</span><span style="color:#A6ACCD;">(original)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">deepEqual</span><span style="color:#A6ACCD;">(copy</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> original)</span></span>
<span class="line"></span></code></pre></div><p><strong>\u9759\u6001\u5DE5\u5382\u65B9\u6CD5\uFF08<code>static factory methods</code>\uFF09</strong> \u662F\u6784\u9020\u5668\u7684\u53E6\u4E00\u79CD\u65B9\u5F0F\uFF0C\u5E76\u4E14\u6548\u679C\u66F4\u597D\uFF0C\u56E0\u4E3A\u6211\u4EEC\u53EF\u4EE5\u76F4\u63A5\u8C03\u7528\u60F3\u8981\u7684\u529F\u80FD\u{1F929}\u3002\uFF08\u8FD9\u91CC\uFF0C<strong>\u9759\u6001</strong> \u8868\u793A\u5DE5\u5382\u65B9\u6CD5\u662F\u7C7B\u65B9\u6CD5\uFF09</p><p>\u4E0B\u9762\u793A\u4F8B\uFF0C3\u4E2A\u7C7B <code>Point</code>, <code>Color</code> &amp; <code>ColorPoint</code> \u6BCF\u4E2A\u90FD\u6709\u4E00\u4E2A\u9759\u6001\u5DE5\u5382\u65B9\u6CD5 <code>.from()</code>:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Point</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">x</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line highlighted"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">from</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Point</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;">)</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Color</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">name</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line highlighted"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">from</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Color</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;">)</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ColorPoint</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">exentds</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Point</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">color</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">super</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">color</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">color</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line highlighted"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">from</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">ColorPoint</span><span style="color:#F07178;">(</span></span>
<span class="line highlighted"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">,</span></span>
<span class="line highlighted"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">,</span></span>
<span class="line highlighted"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">Color</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">from</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">other</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">color</span><span style="color:#F07178;">) </span><span style="color:#676E95;">// A \u{1F6A8}</span></span>
<span class="line highlighted"><span style="color:#F07178;">    )</span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u884C <code>A</code> \u6211\u4EEC\u518D\u4E00\u6B21\u9012\u5F52\u7684\u62F7\u8D1D\u4E86\u{1F4A1}\u3002</p><p>\u793A\u4F8B\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> original </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ColorPoint</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Color</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">red</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">))</span></span>
<span class="line highlighted"><span style="color:#676E95;">// \u9759\u6001\u5DE5\u5382\u65B9\u6CD5\u521B\u5EFA\u526F\u672C</span></span>
<span class="line highlighted"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> copy </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> ColorPoint</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">from</span><span style="color:#A6ACCD;">(original)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">assert</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">deepEqual</span><span style="color:#A6ACCD;">(copy</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> original)</span></span>
<span class="line"></span></code></pre></div><p id="3"></p><h2 id="_3\uFE0F\u20E3-\u9E23\u8C22\uFF08acknowledgements\uFF09" tabindex="-1">3\uFE0F\u20E3 \u9E23\u8C22\uFF08Acknowledgements\uFF09 <a class="header-anchor" href="#_3\uFE0F\u20E3-\u9E23\u8C22\uFF08acknowledgements\uFF09" aria-hidden="true">#</a></h2><p><a href="https://github.com/ronkorving" target="_blank" rel="noreferrer">Ron Korvig</a> \u63D0\u9192\u6211\u5728JavaScript\u4E2D\u4F7F\u7528\u9759\u6001\u5DE5\u5382\u65B9\u6CD5\uFF0C\u800C\u4E0D\u662F\u91CD\u8F7D\u6784\u9020\u51FD\u6570\u8FDB\u884C\u6DF1\u5EA6\u590D\u5236\u3002</p><p>\u603B\u7ED3\uFF08\u8BD1\u8005\u6CE8\uFF09\uFF1A</p><ul><li>\u672C\u7AE0\u63D0\u4F9B\u4E862\u79CD\u7C7B\u5B9E\u4F8B\u62F7\u8D1D\u76842\u79CD\u65B9\u5F0F</li><li><code>clone()</code> \u65B9\u6CD5\u4E2D\u8C03\u7528\u6784\u9020\u5668\u521B\u5EFA\u65B0\u7684\u5B9E\u4F8B\uFF0C\u8FD4\u56DE\u5F53\u524D\u7C7B <code>this</code> \u7684\u6DF1\u62F7\u8D1D</li><li>\u9759\u6001\u5DE5\u5382\u65B9\u6CD5\u62F7\u8D1D\uFF0C\u4E00\u822C\u547D\u540D <code>static from(other) {}</code>\uFF0C\u7C7B\u4F3C\u4E8E <code>Array.from()</code> \uFF08\u63A8\u8350\u{1F60E}\uFF09</li></ul><p>2022\u5E7407\u670827\u65E523:50:51</p>`,29),e=[o];function c(t,r,y,F,D,C){return a(),n("div",null,e)}const h=s(p,[["render",c]]);export{i as __pageData,h as default};
