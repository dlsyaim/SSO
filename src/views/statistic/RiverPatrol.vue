<template>
  <div class="card-container">
    <a-card title="巡河统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 18px">
        <div style="display: flex;align-items: center">
          <span>开始时间：</span>
          <a-date-picker v-model="startTime" class="default-select-width" style="margin-right: 40px"
                         :disabledDate="disableStartDate"/>
          <span>结束时间：</span>
          <a-date-picker v-model="endTime" class="default-select-width" style="margin-right: 40px"
                         :disabledDate="disableEndDate"/>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-radio-group v-model="mode" size="small" buttonStyle="solid">
          <a-radio-button value="table">表格</a-radio-button>
          <a-radio-button value="chart">图表</a-radio-button>
        </a-radio-group>
      </div>
      <a-table :columns="columns"
               v-show="mode==='table'"
               rowKey="id"
               :dataSource="list"
               :pagination="false"
               :loading="loading"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>

  const columns=[

  ];

  export default {
    data() {
      return {
        startTime:null,
        endTime:null,
        mode:'table',
        list:[],
        loading:true,
        columns
      }
    },
    methods:{
      getList(){

      },
      resetSearchCondition(){
        this.startTime=null;
        this.endTime=null;
      },
      disableStartDate(startTime) {
        if (!startTime || !this.endTime) {
          return false
        } else {
          return startTime.valueOf() > this.endTime.valueOf()
        }
      },
      disableEndDate(endTime) {
        if (!endTime || !this.startTime) {
          return false
        } else {
          return endTime.valueOf() < this.startTime.valueOf()
        }
      }
    }
  }
</script>

<style scoped>

</style>
