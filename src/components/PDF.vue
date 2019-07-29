<template>
  <div id="pdfContainer" style="border: 2px solid rgba(0, 0, 0, .1)" :style="{height:height}"></div>
</template>

<script>
  import pdf from 'pdfobject';
  export default {
    props: {
      src: {
        type: String,
        required: true
      },
      height:{
        type:String,
        default:'600px'
      }
    },
    mounted(){
      pdf.embed(this.src, "#pdfContainer");
    }
  }
</script>
