<template>
  <!--<p>巡河管理</p>-->
<div>
  <a-button @click="visible=true">选择区域</a-button>
  <region-tree-modal v-model="visible"></region-tree-modal>
</div>
</template>

<script>

  import RegionTreeModal from "../../components/RegionTreeModal";
  export default {
    components: {RegionTreeModal},
    data() {
      return {
        visible:false
      }
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
