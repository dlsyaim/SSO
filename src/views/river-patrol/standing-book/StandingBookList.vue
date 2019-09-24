<template>
  <div class="card-container">
    <a-card title="河长巡河台账" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>行政区域：</span>
          <a-input style="cursor: pointer;margin-right: 40px;" class="default-select-width" placeholder="请选择行政区域" readOnly
                   :value="region.name" @click="visible=true"></a-input>
          <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
          <span>河长姓名：</span>
          <a-input v-model="chairmanName" style="margin-right: 40px;" class="default-select-width" placeholder="请输入河长姓名"></a-input>
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
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 :rowKey="record => record.id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
          <span slot="riverChiefName" slot-scope="item">
            <span data-level="1" :data-id="item.id" class="table-operation">{{item.chairman_name}}</span>
          </span>
          <span slot="problem" slot-scope="item">
            <span data-level="2" :data-id="item.id" class="table-operation">{{item.problemCount}}</span>
          </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {tablePaginationConfig} from "../../../config/config";
  import RegionTreeModal from "../../../components/RegionTreeModal";
  import {get} from "../../../util/axios";
  import {GET_RIVER_PATROL_STANDING_BOOK} from "../../../api/riverPatrol";
  import moment from 'moment';

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '巡河日期', dataIndex: 'patrolDate'},
    {title: '行政区域', dataIndex: 'regionName'},
    {title: '河长姓名', key: 'riverChiefName', scopedSlots: {customRender: 'riverChiefName'}, width: 120},
    {title: '级别', dataIndex: 'chairmanLevelName'},
    {title: '管辖河段名称', dataIndex: 'reachName'},
    {title: '巡查河段名称', dataIndex: 'patrolReachName'},
    {title: '职务', dataIndex: 'position'},
    {title: '电话', dataIndex: 'unit_cellphone'},
    {title: '问题数', key: 'problemCount', scopedSlots: {customRender: 'problem'}, width: 120}
  ];

  const formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 15}
  };
  export default {
    components: {RegionTreeModal},
    data() {
      return {
        region: {},
        visible: false,
        chairmanName: '',
        startTime: null,
        endTime: null,
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
          beginDate: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : '',
          endDate: this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : '',
          regionId: this.region.id,
          chairmanName: this.chairmanName,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        };
        get(GET_RIVER_PATROL_STANDING_BOOK, params).then(res => {
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
      exportFile() {

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
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      resetSearchCondition() {
        this.region = {};
        this.chairmanName = '';
        this.startTime = null;
        this.endTime = null;
      },
      getRegion(e) {
        this.region = e;
      },
      handleTableClick(e) {
        const id = e.target.dataset.id;
        const level = e.target.dataset.level;
        if (id && method) {
          const query = {
            id: id,
            level: level
          };
          this.$router.push({path: '/river-patrol/standing-book/detail', query: query});
        }
      }
    }
  }
</script>

<style scoped>

</style>
