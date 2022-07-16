export default {
  title: 'Deep JavaScript',
  description: 'A book in the depths of JavaScript',
  lastUpdated: true,
  themeConfig: {
    editLink: {
      text: '在GitHub编辑此页',
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path'
    },
    sidebar: [
      {
        text: '深入学习JavaScript',
        items: [
          {
            text: '介绍',
            link: '/index'
          },
          {
            text: '快速入门',
            link: '/getting-started'
          }
        ]
      }
    ]
  }
}
