module.exports = {
  publicPath: '/hzz/',
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 表格内边距
          'table-padding-vertical': '8px',
          'table-padding-horizontal': '12px',
          // 字体颜色
          'text-color': 'rgba(0, 0, 0, .8)',
          // 输入框行高
          'input-height-base':'34px'
        },
        javascriptEnabled: true
      }
    }
  }
};
