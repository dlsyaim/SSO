<template>
  <div class="card-container">
    <a-card title="通报批评" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>标题：</span>
          <a-input v-model="title" placeholder="请输入标题" style="margin-right: 40px;width: 200px"></a-input>
          <span>发起日期：</span>
          <a-date-picker v-model="startTime" style="margin-right: 40px" class="default-select-width"/>
          <span>通知类别：</span>
          <a-select v-model="informType" placeholder="请选择通知类别" class="default-select-width" style="margin-right: 40px">
            <a-select-option value="600101">信息通知</a-select-option>
            <a-select-option value="600102">信息通报</a-select-option>
            <a-select-option value="600103">督查</a-select-option>
            <a-select-option value="600104">督办</a-select-option>
            <a-select-option value="600105">一区一单</a-select-option>
          </a-select>
          <span>是否已阅：</span>
          <a-radio-group v-model="readStatus" style="margin-right: 40px">
            <a-radio value="1">已阅</a-radio>
            <a-radio value="2">未阅</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <div>
          <a-button @click="showAddModal" style="margin-right: 20px">
            <a-icon type="plus" style="font-size: 16px;"/>
            发起通知通报
          </a-button>
          <a-button @click="exportFile">
            <a-icon type="download" style="font-size: 16px;"/>
            导出
          </a-button>
        </div>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 @change="handleTableChange"
                 :rowKey="record => record.id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading">
          <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
          <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
          <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
          </a-popconfirm>
          </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import {get} from "../../util/axios";
  import moment from 'moment';

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '标题', dataIndex: 'title', sorter: true},
    {title: '通知类别', dataIndex: 'informType_name', sorter: true},
    {title: '发起人', dataIndex: 'createPerson', sorter: true},
    {title: '发起日期', dataIndex: 'createDate', sorter: true},
    {title: '是否上报', key: 'weatherSent', sorter: true, scopedSlots: {customRender: 'weatherSent'}},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'},width:200}
  ];

  export default {
    data() {
      return {
        title: null,
        startTime: null,
        informType: undefined,
        readStatus: undefined,
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        sortColumn: '',
        sortOrder: ''
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          title: this.title,
          createDate: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          informType: this.informType,
          readStatus: this.readStatus,
          column: this.sortColumn,
          order: this.sortOrder,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/inform/v1/informReport/list`, params).then(res => {
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
      resetSearchCondition() {
        this.title = null;
        this.startTime = null;
        this.informType = undefined;
        this.readStatus = undefined;
        this.sortColumn = '';
        this.sortOrder = '';
      },
      showAddModal() {

      },
      exportFile() {

      },
      handleTableClick(e) {

      },
      handleTableChange(pagination, filters, sorter) {
        this.pagination = pagination;
        if (sorter.order === 'ascend') {
          this.sortColumn = sorter.columnKey;
          this.sortOrder = 'asc';
        } else if (sorter.order === 'descend') {
          this.sortOrder = 'desc';
          this.sortColumn = sorter.columnKey;
        } else {
          this.sortOrder = '';
          this.sortColumn = '';
        }
        this.getList();
      },
      deleteItem(){

      }
    }
  }
</script>

<style scoped>

</style>
