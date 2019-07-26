<template>
  <div class="card-container">
    <a-card title="待办问题" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>问题来源：</span>
        <a-select class="default-select-width" style="margin-right: 40px" placeholder="请选择问题来源" @change="handleProblemSelectChange">
          <a-select-option value="A">河长APP</a-select-option>
          <a-select-option value="S">市平台同步</a-select-option>
        </a-select>
        <span>问题等级：</span>
        <a-select class="default-select-width" style="margin-right: 40px" placeholder="请选择问题等级" @change="handleProblemSelectChange">
          <a-select-option value="A">河长APP</a-select-option>
          <a-select-option value="S">市平台同步</a-select-option>
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
  import {GET_PROBLEM_LIST} from "../../api/problem";
  import {tablePaginationConfig} from "../../config/config";

  const columns = [
    {title: '到达时间', dataIndex: 'arrivalTime'},
    {title: '问题来源', dataIndex: 'eventResourceName'},
    {title: '发现时间', dataIndex: 'createtime'}
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
  export default {
    data() {
      return {
        searchCondition: {
          userId: '',
          eventResource: null
        },
        columns,
        list: [],
        loading: false,
        pagination: tablePaginationConfig,
        problemSourceEnum
      }
    },
    mounted() {
      this.searchCondition.userId = JSON.parse(sessionStorage.getItem('userDTO')).id;
      this.getList();
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
            this.list = res.data.list.map(item=>{
              item.eventResourceName=this.problemSourceEnum[item.eventresource];
              return item;
            });
          }
        })
      },
      handleProblemSelectChange(e) {
        this.params.eventResource = e;
      },
      handleTableChange(e) {
        this.pagination = e;
      }
    }
  }
</script>

<style scoped>

</style>
