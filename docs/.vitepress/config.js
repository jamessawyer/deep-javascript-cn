export default {
  title: 'Deep JavaScript',
  description: 'A book in the depths of JavaScript',
  lastUpdated: true,
  base: '/deep-javascript-cn/',
  themeConfig: {
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
          }
        ]
      },
      {
        text: 'Ⅲ.处理数据',
        collapsible: true,
        items: []
      },
      {
        text: 'Ⅳ.OOP：对象属性特性',
        collapsible: true,
        items:[]
      },
      {
        text: 'Ⅴ.OOP技术',
        collapsible: true,
        items: [
          {
            text: '属性特性介绍',
            link: '/5/Property-attributes-an-Introduction'
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
        items: []
      }
    ]
  },
  markdown: {
    // lineNumbers: true, // 是否显示行号
    // options for markdown-it-toc-done-right
    toc: { level: [1, 2, 3] },
  }
}
