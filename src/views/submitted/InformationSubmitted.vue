<template>
  <div class="card-container">
    <a-card title="信息报送" :bordered="false" style="min-height: 100%">
      <a-row>
        <a-col span="5">
          <span>报送标题：</span>
          <a-input style="width: 200px;" placeholder="请输入报送标题" v-model="title"></a-input>
        </a-col>
        <a-col span="5">
          <span>发起时间：</span>
          <a-date-picker v-model="startTime" style="width: 200px" :disabledDate="disableStartDate"/>
        </a-col>
        <a-col span="5">
          <span>截止时间：</span>
          <a-date-picker v-model="endTime" style="width: 200px" :disabledDate="disableEndDate"/>
        </a-col>
        <a-col span="5">
          <span>应报送区域：</span>
          <a-input style="width: 200px;cursor: pointer" @click="visible=true" readOnly placeholder="请选择应报送区域"
                   :value="region.name"></a-input>
          <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="5">
          <span>报送状态：</span>
          <a-select v-model="sentState" style="width: 200px;" placeholder="请选择报送状态">
            <a-select-option value="1">已上报</a-select-option>
            <a-select-option value="2">未上报</a-select-option>
            <a-select-option value="3">已退回</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>报送方向：</span>
          <a-select v-model="direction" style="width: 200px;margin-right: 40px" placeholder="请选择报送状态">
            <a-select-option value="1">发起方</a-select-option>
            <a-select-option value="2">报送方</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </a-col>
        <a-col span="9" style="display: flex;justify-content: flex-end">
          <a-button type="primary">
            <a-icon type="download" style="font-size: 18px;"/>
            导出
          </a-button>
        </a-col>
      </a-row>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
          <span slot="weatherSent" slot-scope="item">
            <a-tag v-if="item.weatherSent===1">已上报</a-tag>
            <a-tag v-if="item.weatherSent===2">未上报</a-tag>
            <a-tag v-if="item.weatherSent===3">已退回</a-tag>
            <a-tag v-if="item.weatherSent===4">延时上报</a-tag>
          </span>
          <span slot="weatherAccept" slot-scope="item">
            <a-tag v-if="item.weatherAccept===1">已采纳</a-tag>
            <a-tag v-if="item.weatherAccept===2">未采纳</a-tag>
          </span>
            <span slot="action" slot-scope="item">
            <span data-method="see" :data-id="item.id" class="table-operation">查看</span>
            <template>
              <a-divider type="vertical"/>
              <span data-method="detail" :data-id="item.id" class="table-operation">答复</span>
            </template>
            <template>
              <a-divider type="vertical"/>
              <span data-method="report" :data-id="item.id" class="table-operation">上报</span>
            </template>
            <template>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
                <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {tablePaginationConfig} from "../../config/config";
  import RegionTreeModal from "../../components/RegionTreeModal";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import {get} from "../../util/axios";
  import {GET_INFORMATION_SUBMITTED_LIST} from "../../api/submited";
  import moment from 'moment';

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '报送标题', dataIndex: 'title', sorter: true},
    {title: '发起时间', dataIndex: 'sentTimeStart', sorter: true},
    {title: '截止时间', dataIndex: 'sentTimeEnd', sorter: true},
    {title: '应报送区域', dataIndex: 'sentRegion', sorter: true},
    {title: '报送方向', dataIndex: 'direction', sorter: true},
    {title: '是否上报', key: 'weatherSent', sorter: true, scopedSlots: {customRender: 'weatherSent'}},
    {title: '是否采纳', key: 'weatherAccept', sorter: true, scopedSlots: {customRender: 'weatherAccept'}},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'},width:240}
  ];

  export default {
    components: {ACol, ARow, RegionTreeModal},
    data() {
      return {
        title: '',
        startTime: null,
        endTime: null,
        region: {},
        visible: false,
        sentState: undefined,
        direction: undefined,
        sortColumn: null,
        sortOrder: null,
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
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
          title: this.title,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current,
          sentTimeStart: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          sentTimeEnd: this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : null,
          sentRegion: this.region.id,
          sentState: this.state,
          direction: this.direction,
          column: this.sortColumn,
          order: this.sortOrder
        };
        get(GET_INFORMATION_SUBMITTED_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {

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
      getRegion(e) {
        this.region = e;
      },
      resetSearchCondition() {
        this.title = '';
        this.startTime = null;
        this.endTime = null;
        this.region = {};
        this.sentState = undefined;
        this.direction = undefined;
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
          this.sortOrder = null;
          this.sortColumn = null;
        }
        this.getList();
      },
      handleTableClick(e) {

      },
      deleteItem(){

      }
    }
  }
</script>

<style scoped>

</style>
