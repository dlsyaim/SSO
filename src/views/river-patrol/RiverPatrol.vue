<template>
  <!--<p>巡河管理</p>-->
<rich-text-editor :tag-id="'12'" @getEditorContent="getEditorContent"></rich-text-editor>
</template>

<script>

  import RichTextEditor from "../../components/RichTextEditor";
  export default {
    components: {RichTextEditor},
    data() {
      return {}
    },
    methods:{
      getEditorContent(e){

      }
    }
  }
</script>

<style scoped>

</style>
