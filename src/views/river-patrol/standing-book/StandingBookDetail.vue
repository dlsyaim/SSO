<template>
  <div class="card-container">
    <a-card title="巡河台账详情" :bordered="false" style="min-height: 100%" id="card">
      <a-button type="primary" slot="extra" @click="$router.push('/river-patrol/standing-book')">返回</a-button>
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id:'',
        level:'',
      }
    },
    beforeMount(){
      this.id=this.$route.query.id;
      this.level=this.$route.query.level;
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(){

      }
    }

  }
</script>

<style scoped>

</style>
