<template>
  <div>
    <img height="60" width="60" style="margin-right: 10px;cursor: pointer" :src="imageUrl"/>
    <a-modal></a-modal>
  </div>
</template>

<script>
  export default {
    props:{
      imageUrl:{
        type:String,
        required:true
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>

</style>
