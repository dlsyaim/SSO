<template>
  <div class="card-container">
    <a-card title="待办问题" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>问题来源：</span>
        <a-select class="default-select-width" style="margin-right: 40px" placeholder="请选择问题来源" @change="handleProblemSourceSelectChange">
          <a-select-option value="A">河长APP</a-select-option>
          <a-select-option value="S">市平台同步</a-select-option>
        </a-select>
        <span>问题等级：</span>
        <a-select class="default-select-width" style="margin-right: 40px" placeholder="请选择问题等级" @change="handleProblemLevelSelectChange">
          <a-select-option value="0">一般</a-select-option>
          <a-select-option value="1">紧急</a-select-option>
          <a-select-option value="2">特急</a-select-option>
        </a-select>
        <a-button type="primary" @click="getList">查询</a-button>
      </div>
      <a-table :columns="columns"
               style="margin-top: 24px;"
               :rowKey="record => record.id"
               :dataSource="list"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange">
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_PROBLEM_LIST, GET_PROBLEM_TYPE} from "../../api/event";
  import {tablePaginationConfig} from "../../config/config";
  import {eventStatusEnum} from "../../config/enum";

  const columns = [
    {title: '到达时间', dataIndex: 'arrivalTime'},
    {title: '问题来源', dataIndex: 'eventResourceName'},
    {title: '问题等级', dataIndex: 'eventLevelName'},
    {title: '发现时间', dataIndex: 'createtime'},
    {title: '问题内容', dataIndex: 'content'},
    {title: '所属区域', dataIndex: 'belongArea'},
    {title: '问题状态', dataIndex: 'eventStatusName'},
    {title: '委办单位', dataIndex: 'acceptperson'},
    {title: '扣分分值', dataIndex: 'deductionScore'}
  ];
  const problemSourceEnum = {
    'A': '河长APP',
    'B': '电话上报',
    'C': '公众APP',
    'D': '微信',
    'F': '曝光台',
    'G': '钉钉平台',
    'S': '市平台同步'
  };
  const problemLevelEnum={
    '0':'一般',
    '1':'紧急',
    '2':'特急',
  };
  export default {
    data() {
      return {
        searchCondition: {
          userId: '',
          eventResource: null,
          eventLevel:null
        },
        columns,
        list: [],
        loading: false,
        pagination: tablePaginationConfig,
        problemSourceEnum,
        problemLevelEnum,
        eventStatusEnum,
        problemTypeList:[]
      }
    },
    mounted() {
      this.searchCondition.userId = JSON.parse(sessionStorage.getItem('userDTO')).id;
      this.getList();
      this.getProblemType();
    },
    methods: {
      getList() {
        const params = {
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
          acceptPerson: this.searchCondition.acceptPerson,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize
        };
        this.loading = true;
        get(GET_PROBLEM_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleList(res.data.list);
            this.pagination.total=res.data.total;
          }
        })
      },
      handleList(list){
        list.forEach(item=>{
          item.eventResourceName=this.problemSourceEnum[item.eventresource];
          item.eventLevelName=this.problemLevelEnum[item.eventlevel];
          item.belongArea=item.eventbelongcity+item.eventbelongcounty+item.eventbelongtown+item.eventbelongvillage;
          item.eventStatusName=this.eventStatusEnum[item.status];
        });
        this.list=list;
      },
      getProblemType(){
        get(GET_PROBLEM_TYPE).then(res=>{
          if(res.resCode){
            const problemTypeList=[];
            res.data.forEach(item=>{
              if(!item.isParent){
                problemTypeList.push(item);
              }
            })
            // this.problemTypeList=res.data.map()
          }
        });
      },
      handleProblemSourceSelectChange(e) {
        this.searchCondition.eventResource = e;
      },
      handleProblemLevelSelectChange(e){
        this.searchCondition.eventLevel=e;
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
