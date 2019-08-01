<template>
  <div class="card-container">
    <a-card title="水质变化与达标情况统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>断面名称：</span>
        <a-input style="width: 240px;margin-right: 40px"></a-input>
        <span>检测周期：</span>
        <a-range-picker style="margin-right: 40px" v-model="date" />
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="resetSearchCondition">重置</a-button>
      </div>
      <!--<div style="margin-top: 18px;" @click="handleTableClick">-->
        <a-table :columns="columns"
                 :rowKey="record => record.index"
                 :dataSource="list"
                 :pagination="false"
                 :loading="loading">
        <span slot="action" slot-scope="item">
          <span data-method="modify" :data-id="item.id" class="table-operation">分值修正</span>
        </span>
        </a-table>
      <!--</div>-->
    </a-card>
  </div>
</template>

<script>
  const columns=[];
  export default {
    data() {
      return {
        list:[],
        loading:true,
        date:[],
        columns
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(){

      },
      handleData(){

      },
      resetSearchCondition(){

      }
    }
  }
</script>

<style scoped>

</style>
