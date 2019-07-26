# 组件使用说明
注：@input表示传递props，使用v-bind，@output表示发出一个自定义事件，使用v-on接收

## 富文本编辑器 RichTextEditor
### @input
1. tagId，string类型，实例在当前页面的唯一标识。
2. initialContent，string类型，编辑器初始值。
### @output
1. getEditorContent，string类型，返回符文编辑器内容

## 区域选择弹出框
### @input
1. visible,boolean类型，使用v-model双向绑定
### @output
1. getRegion,返回一个区域对象