<template>
  <div class="card-container">
    <a-card title="问题反馈" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <!--<div style="display: flex;align-items: center">-->
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
        <a-button @click="exportFile"><a-icon type="download" style="font-size: 18px;"/>导出</a-button>
      </div>
      <div style="margin-top: 18px;">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :loading="loading">
          <!--<span slot="action" slot-scope="item">-->
          <!--<span data-method="detail" :data-id="item.id" class="table-operation">详情</span>-->
          <!--<a-divider type="vertical"/>-->
          <!--<span data-method="modify" :data-id="item.id" class="table-operation">修改</span>-->
          <!--<a-divider type="vertical"/>-->
          <!--<a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">-->
          <!--<span data-method="delete" :data-id="item.id" class="table-operation">删除</span>-->
          <!--</a-popconfirm>-->
          <!--</span>-->
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import moment from 'moment';
  import {BASE_URL, REGION_ID} from "../../config/config";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '区号', dataIndex: 'eventBelongTown'},
    {title: '问题总计', dataIndex: 'totalCount'},
    {title: '未处理', dataIndex: 'beginCount'},
    {title: '处理中', dataIndex: 'processCount'},
    {title: '已结案', dataIndex: 'endCount'},
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
        this.loading = true;
        const params = {
          startDate: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          endDate: this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : null,
          countryId: REGION_ID
        };
        get(`${BASE_URL}/analysis/v1/patrolRiverProblemStatistics/getListTown`, params).then(res => {
          this.loading=false;
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
      },
      exportFile(){
        const startDate= this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : '';
        const  endDate= this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : '';
        window.location.href=`${BASE_URL}/analysis/v1/patrolRiverProblemStatistics/exportData?beginDate=${startDate}&endDate=${endDate}`
      }
    }
  }
</script>

<style scoped>

</style>
