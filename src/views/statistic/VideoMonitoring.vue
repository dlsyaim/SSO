<template>
  <div class="card-container">
    <a-card title="视频监控预警分析统计" :bordered="false" style="min-height: 100%">
      <!--<div style="display: flex;align-items: center">-->
        <!--<span>月份：</span>-->
        <!--<a-month-picker v-model="month" placeholder="请选择月份" style="margin-right: 40px" />-->
        <!--<a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>-->
        <!--<a-button @click="resetSearchCondition">重置</a-button>-->
      <!--</div>-->
      <div style="margin-top: 18px;" @click="handleTableClick">
        <!--<a-table :columns="columns"-->
                 <!--:rowKey="record => record.index"-->
                 <!--:dataSource="list"-->
                 <!--:pagination="false"-->
                 <!--:loading="loading">-->
        <!--<span slot="action" slot-scope="item">-->
          <!--<span data-method="modify" :data-id="item.id" class="table-operation">分值修正</span>-->
        <!--</span>-->
        <!--</a-table>-->
      </div>
    </a-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(){

      },
      handleTableClick(e){

      }
    }
  }
</script>

<style scoped>

</style>
