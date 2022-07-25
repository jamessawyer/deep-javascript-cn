export default {
  title: 'Deep JavaScript',
  description: 'A book in the depths of JavaScript',
  lastUpdated: true,
  base: '/deep-javascript-cn/', // 非常重要这个属性！！！
  
  head:[
    ['link', { rel: 'icon', href: '/deep-javascript-cn/favicon.ico' }]
  ],
  
  themeConfig: {
    logo: '/js.svg',
    editLink: {
      text: '在GitHub编辑此页',
      pattern: 'https://github.com/jamessawyer/deep-javascript-cn/edit/main/docs/:path'
    },
    sidebar: [
      {
        text: 'Ⅱ.类型，值，和变量',
        collapsible: true,
        items: [
          {
            text: '2.⚡JS中的类型强转',
            link: '/2/Type-coercion-in-JavaScript',
          },
          {
            text: '3.解构算法',
            link: '/2/The-destructuring-algorithm'
          },
          {
            text: '4.⚡环境-变量背后的原理',
            link: '/2/Environments-under-the-hood-of-variables',
          },
          {
            text: '5.⚡深入理解全局变量',
            link: '/2/A-detailed-look-at-global-variables',
          },
        ]
      },
      {
        text: 'Ⅲ.数据处理',
        collapsible: true,
        items: []
      },
      {
        text: 'Ⅳ.OOP：对象属性特性',
        collapsible: true,
        items:[
          {
            text: '10.⚡属性特性介绍',
            link: '/4/Property-attributes-an-Introduction',
          },
          {
            text: '11.保护对象更改',
            link: '/4/Protecting-objects-from-changed',
          },
          {
            text: '12.⚡属性赋值和属性定义',
            link: '/4/Properties-assignment-vs-definition',
          },
          {
            text: '13.属性的可枚举性',
            link: '/4/Enumerability-of-Properties',
          },
        ]
      },
      {
        text: 'Ⅴ.OOP技术',
        collapsible: true,
        items: [
          {
            text: '14.⚡实例化类技术（异步属性）',
            link: '/5/Techniques-for-instantiating-classes'
          }
        ]
      },
      {
        text: 'Ⅵ.正则表达式',
        collapsible: true,
        items: []
      },
      {
        text: 'Ⅶ.其它话题：元编程',
        collapsible: true,
        items: [
          {
            text: '20.⚡使用Proxies进行元编程',
            link: '/7/Metaprogramming-with-Proxies'
          }
        ]
      }
    ]
  },
  markdown: {
    // lineNumbers: true, // 是否显示行号
    // options for markdown-it-toc-done-right
    toc: { level: [1, 2, 3] },
  }
}
