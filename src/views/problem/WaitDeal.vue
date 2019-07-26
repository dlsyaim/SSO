<template>
  <div class="card-container">
    <a-card title="待办问题" :bordered="false" style="height: 100%">
      <div style="display: flex;align-items: center">
        <span>问题来源：</span>
        <a-select class="default-select-width" placeholder="请选择问题来源" @change="handleProblemSelectChange">
          <a-select-option value="A">河长APP</a-select-option>
          <a-select-option value="S">市平台同步</a-select-option>
        </a-select>
      </div>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="list"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange">
        <template slot="name" slot-scope="name">
          {{name.first}} {{name.last}}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_PROBLEM_LIST} from "../../api/problem";
  import {tablePaginationConfig} from "../../config/config";

  const columns=[

  ];
  export default {
    data() {
      return {
        searchCondition:{
          userId:'',
          eventResource:null
        },
        columns,
        list:[],
        loading:false,
        pagination:tablePaginationConfig
      }
    },
    mounted(){
      this.searchCondition.userId='cec2efacb0e449a4acec3d5ab0beede7';
      this.getList();
    },
    methods:{
      getList(){
        const params={
          userId: this.searchCondition.userId,
          eventResource: this.searchCondition.eventResource,
          eventLevel: this.searchCondition.eventLevel,
          eventTypeId: this.searchCondition.eventTypeId,
          content: this.searchCondition.eventContent,
          regionId: this.searchCondition.regionId,
          startTime: this.searchCondition.beginTime,
          endTime: this.searchCondition.endTime,
          status: this.searchCondition.status,
          reportPhone: this.searchCondition.eventTel,
          acceptPerson:this.searchCondition.acceptPerson,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize
        };
        this.loading=true;
        get(GET_PROBLEM_LIST,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.list=res.data.list;
          }
        })
      },
      handleProblemSelectChange(e){
        this.params.eventResource=e;
      },
      handleTableChange(e){
         this.pagination=e;
      }
    }
  }
</script>

<style scoped>

</style>
