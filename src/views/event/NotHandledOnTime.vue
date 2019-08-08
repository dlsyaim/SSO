<template>
  <div class="card-container">
    <a-card title="未及时处理问题" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>开始日期：</span>
        <a-date-picker @change="onStartChange" :value="startTime" style="margin-right: 40px;width: 200px"/>
        <span>结束日期：</span>
        <a-date-picker @change="onEndChange" :value="endTime" style="margin-right: 40px;width: 200px"/>
        <span>委办单位：</span>
        <a-input placeholder="请输入委办单位" v-model="acceptPerson" style="margin-right: 40px;width: 200px"></a-input>
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="resetSearchCondition">重置</a-button>
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

  import {tablePaginationConfig} from "../../config/config";
  import {get} from "../../util/axios";
  import {GET_NOT_HANDLED_ON_TIME_EVENT_LIST} from "../../api/event";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '日期', dataIndex: 'reportTime'},
    {title: '委办单位', dataIndex: 'acceptPerson'},
    {title: '问题点位', dataIndex: 'address'},
    {title: '问题描述', dataIndex: 'typename'},
    {title: '是否办结', dataIndex: 'statusName'},
    {title: '延迟时长', dataIndex: 'delayCout'}
  ];
  export default {
    data() {
      return {
        startTime: null,
        startTimeString: '',
        endTime: null,
        endTimeString: '',
        acceptPerson: '',
        loading: false,
        list: [],
        pagination: tablePaginationConfig,
        columns
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        const params = {
          startdate: this.startTimeString,
          enddate: this.endTimeString,
          acceptPerson: this.acceptPerson,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        this.loading = true;
        get(GET_NOT_HANDLED_ON_TIME_EVENT_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleList(res.data.list);
            this.pagination.total = res.data.total;
          }
        });
      },
      handleList(list) {
        list.forEach((item, index) => {
          item.index = index + 1 + this.pagination.current * this.pagination.pageSize;
          item.statusName=item.resule==='Z'?'办结':'未办结'
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.startTime = null;
        this.endTime = null;
        this.startTimeString = '';
        this.endTimeString = '';
        this.acceptPerson = '';
      },
      onStartChange(date, dateString) {
        this.startTime = date;
        this.startTimeString = dateString;
      },
      onEndChange(date, dateString) {
        this.endTime = date;
        this.endTimeString = dateString;
      },
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
