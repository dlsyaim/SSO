<template>
  <div class="card-container">
    <a-card title="督办" :bordered="false" style="min-height: 100%">
      <a-row>
        <a-col span="5">
          <span>督办事项：</span>
          <a-input class="default-select-width" placeholder="请输入督办事项" v-model="searchCondition.project"></a-input>
        </a-col>
        <a-col span="5">
          <span>督办标题：</span>
          <a-input class="default-select-width" placeholder="请输入督办标题" v-model="searchCondition.title"></a-input>
        </a-col>
        <a-col span="5">
          <span>行政区域：</span>
          <a-select class="default-select-width" v-model="searchCondition.region" placeholder="请选择行政区域">
            <a-select-option value="1">未办结</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>开始时间：</span>
          <a-date-picker class="default-select-width" v-model="searchCondition.startTime"
                         :disabledDate="disableStartDate"/>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="5">
          <span>结束时间：</span>
          <a-date-picker class="default-select-width" v-model="searchCondition.endTime" :disabledDate="disableEndDate"/>
        </a-col>
        <a-col span="5">
          <span>督办文号：</span>
          <a-input class="default-select-width" placeholder="请输入督办文号" v-model="searchCondition.proof"></a-input>
        </a-col>
        <a-col span="5">
          <span>是否办结：</span>
          <a-select class="default-select-width" v-model="searchCondition.status" placeholder="请选择是否办结">
            <a-select-option value="1">未办结</a-select-option>
            <a-select-option value="2">未按期整改</a-select-option>
            <a-select-option value="3">已办结</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>督办类型：</span>
          <a-select class="default-select-width" v-model="searchCondition.type" placeholder="请选择督办类型">
            <a-select-option value="1">普通督办</a-select-option>
            <a-select-option value="2">现场督办</a-select-option>
            <a-select-option value="3">挂牌督办</a-select-option>
          </a-select>
        </a-col>
        <a-col span="4">
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </a-col>
      </a-row>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange"
        >
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import moment from 'moment';
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import {get} from "../../util/axios";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '督办标题', dataIndex: 'title',sorter:true},
    {title: '督办事项', dataIndex: 'project',sorter:true},
    {title: '督办对象', dataIndex: 'region',sorter:true},
    {title: '督办单文号', dataIndex: 'dubandanProof',sorter:true},
    {title: '督办函文号', dataIndex: 'dubanhanProof',sorter:true},
    {title: '应回复日期', dataIndex: 'deadlinedate',sorter:true},
    {title: '督办点位', dataIndex: 'address',sorter:true},
  ];

  export default {
    components: {ARow},
    data() {
      return {
        searchCondition: {
          project: '',
          title: '',
          region: undefined,
          startTime: null,
          endTime: null,
          proof: '',
          status: undefined,
          type: undefined,
          column: undefined,
          order: undefined,
        },
        list: [],
        loading: false,
        pagination: tablePaginationConfig,
        columns
      }
    },
    mounted(){
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          project: this.searchCondition.project,
          title: this.searchCondition.title,
          region: this.searchCondition.region,
          startTime: this.searchCondition.startTime ? moment(this.searchCondition.startTime).format('YYYY-MM-DD') : null,
          endTime: this.searchCondition.endTime ? moment(this.searchCondition.endTime).format('YYYY-MM-DD') : null,
          proof: this.searchCondition.proof,
          status: this.searchCondition.status,
          type: this.searchCondition.type,
          column:this.searchCondition.column,
          order:this.searchCondition.order,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/duban/v1/DubanSupervision/list`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.list);
            this.pagination.total = res.data.total;
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
        });
        this.list = list;
      },
      disableStartDate(startTime) {
        if (!startTime || !this.searchCondition.endTime) {
          return false
        } else {
          return startTime.valueOf() > this.searchCondition.endTime.valueOf()
        }
      },
      disableEndDate(endTime) {
        if (!endTime || !this.searchCondition.startTime) {
          return false
        } else {
          return endTime.valueOf() < this.searchCondition.startTime.valueOf()
        }
      },
      resetSearchCondition() {
        this.searchCondition = {
          project: '',
          title: '',
          region: undefined,
          startTime: null,
          endTime: null,
          proof: '',
          status: undefined,
          type: undefined,
          column: undefined,
          order: undefined,
        };
      },
      handleTableChange(pagination, filters, sorter){
        this.pagination=pagination;
        if (sorter.order === 'ascend') {
          this.searchCondition.column = sorter.columnKey;
          this.searchCondition.order = 'asc';
        } else if (sorter.order === 'descend') {
          this.searchCondition.column = sorter.columnKey;
          this.searchCondition.order = 'desc';
        } else {
          this.searchCondition.column = '';
          this.searchCondition.order = '';
        }
        this.getList();
      },
      handleTableClick(e) {

      }
    }
  }
</script>

<style scoped>

</style>
