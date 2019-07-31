<template>
  <div class="card-container">
    <a-card title="区级督查督办统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>开始日期：</span>
          <a-date-picker v-model="startTime" :disabledDate="disableStartDate" style="margin-right: 40px"/>
          <span>结束日期：</span>
          <a-date-picker v-model="endTime" :disabledDate="disableEndDate" style="margin-right: 40px"/>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="exportFile">
          <a-icon type="download" style="font-size: 18px;"/>
          导出
        </a-button>
      </div>
      <a-table :columns="columns"
               style="margin-top: 18px;"
               :rowKey="record => record.index"
               :dataSource="list"
               :pagination="false"
               :loading="loading">
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import moment from 'moment';
  import {GET_SUPERVISE_STATISTIC_LIST} from "../../api/statistic";
  import {BASE_URL} from "../../config/config";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '行政区域', dataIndex: 'areaName'},
    {title: '全面督查次数', dataIndex: 'totalCount'},
    {title: '专项督查次数', dataIndex: 'specCount'},
    {title: '发现问题数', dataIndex: 'proCount'},
    {title: '未整改问题数', dataIndex: 'noDealCount'}
  ];
  export default {
    data() {
      return {
        startTime: null,
        endTime: null,
        loading: true,
        list: [],
        columns
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        const params = {
          beginDate: this.startTime ? moment(this.startTime).format('YYYY-mm-dd') : '',
          endDate: this.endTime ? moment(this.endTime).format('YYYY-mm-dd') : ''
        };
        this.loading = true;
        get(GET_SUPERVISE_STATISTIC_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data);
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = index + 1;
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.startTime = null;
        this.endTime = null;
        this.acceptPerson = '';
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
      },
      exportFile() {
        const beginDate = this.startTime ? moment(this.startTime).format('YYYY-mm-dd') : '';
        const endDate = this.endTime ? moment(this.endTime).format('YYYY-mm-dd') : '';
        window.location.href = `${BASE_URL}/analysis/v1/inspectionStatistics/exportData?beginDate=${beginDate}&endDate=${endDate}`;
      }
    }
  }
</script>

<style scoped>

</style>
