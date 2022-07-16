export default {
  title: 'Deep JavaScript',
  description: 'A book in the depths of JavaScript',
  lastUpdated: true,
  themeConfig: {
    editLink: {
      text: '在GitHub编辑此页',
      pattern: 'https://github.com/jamessawyer/deep-javascript-cn/edit/main/docs/:path'
    },
    sidebar: [
      {
        text: '2.类型，值，和变量',
        items: [
          {
            text: '⚡JS中的类型强转',
            link: '/2/Type-coercion-in-JavaScript'
          },
          {
            text: '⚡环境-变量的幕后',
            link: '/2/Environments-under-the-hood-of-variables'
          }
        ]
      },
      {
        text: '3.处理数据',
        items: []
      },
      {
        text: '4.OOP：对象属性特性',
        items:[]
      },
      {
        text: '5.OOP技术',
        items: [
          {
            text: '属性特性介绍',
            link: '/5/Property-attributes-an-Introduction'
          }
        ]
      },
      {
        text: '6.正则表达式',
        items: []
      },
      {
        text: '7.其它话题：元编程',
        items: []
      }
    ]
  },
  markdown: {
    // lineNumbers: true, // 是否显示行号
    // options for markdown-it-toc-done-right
    toc: { level: [1, 2] },
  }
}
