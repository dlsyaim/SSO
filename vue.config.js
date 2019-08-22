module.exports = {
  publicPath: '/hzz/',
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 表格内边距
          'table-padding-vertical': '4px',
          'table-padding-horizontal': '12px',
          // 字体颜色
          'text-color': 'rgba(0, 0, 0, .8)',
          // 布局,light主题
          'layout-sider-background-light': '#3366FF',
        },
        javascriptEnabled: true
      }
    }
  }
};
