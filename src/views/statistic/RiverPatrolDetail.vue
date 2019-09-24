<template>
  <div class="card-container">
    <a-card title="巡河情况" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 18px">
        <div style="display: flex;align-items: center">
          <span>开始时间：</span>
          <a-date-picker v-model="startTime" class="default-select-width" style="margin-right: 40px"
                         :disabledDate="disableStartDate"/>
          <span>结束时间：</span>
          <a-date-picker v-model="endTime" class="default-select-width" style="margin-right: 40px"
                         :disabledDate="disableEndDate"/>
          <a-radio-group v-model="type" style="margin-right: 40px">
            <a-radio value="1">本年</a-radio>
            <a-radio value="2">本月</a-radio>
            <a-radio value="3">上月</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
      </div>
      <a-table :columns="columns"
               style="margin-top: 18px"
               rowKey="id"
               @change="handleTableChange"
               :dataSource="list"
               :pagination="pagination"
               :loading="loading"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>

  import {get} from "../../util/axios";
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import moment from 'moment';

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '姓名', dataIndex: 'reachmanName'},
    {title: '级别', dataIndex: 'reachmanLevel'},
    {title: '应巡', dataIndex: 'needReachNum'},
    {title: '已巡', dataIndex: 'hadReachNum'},
    {title: '达标率(%)', dataIndex: 'patrolRate'},
  ];

  export default {
    data() {
      return {
        regionId: '',
        type: '2',
        startTime: null,
        endTime: null,
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns
      }
    },
    beforeMount() {
      this.regionId = this.$route.query.region_id;
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          regionId: this.regionId,
          type: this.type,
          grade:4,//TODO
          startTime: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          endTime: this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : null,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/resumption/v1/resumption/findPersonReachNum`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.list);
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
        this.type = '2';
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
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
