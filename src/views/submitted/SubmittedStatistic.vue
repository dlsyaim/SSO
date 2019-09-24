<template>
  <div class="card-container">
    <a-card title="报送统计" :bordered="false" style="min-height: 100%">
        <div style="display: flex;align-items: center">
          <span>开始时间：</span>
          <a-date-picker v-model="startTime" class="default-select-width" style="margin-right: 40px"
                         :disabledDate="disableStartDate"/>
          <span>结束时间：</span>
          <a-date-picker v-model="endTime" class="default-select-width" style="margin-right: 40px"
                         :disabledDate="disableEndDate"/>
          <span>统计方式：</span>
          <a-select v-model="kind" class="default-select-width" style="margin-right: 40px;" placeholder="请选择统计方式">
            <a-select-option value="1">工作简报</a-select-option>
            <a-select-option value="2">信息报送</a-select-option>
            <a-select-option value="3">周动态</a-select-option>
          </a-select>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
      <a-table :columns="columns"
               style="margin-top: 18px;"
               rowKey="id"
               :dataSource="list"
               :pagination="false"
               :loading="loading"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {BASE_URL} from "../../config/config";

  const columns=[
    {title:'序号',dataIndex:'index'},
    {title:'行政区域',dataIndex:'region'},
    {title:'报送次数',dataIndex:'sentNumber'},
    {title:'采纳次数',dataIndex:'acceptNumber'},
    {title:'退回次数',dataIndex:'returnNumber'},
    {title:'延迟汇报次数',dataIndex:'overtime'}
  ];

  export default {
    data() {
      return {
        startTime: null,
        endTime: null,
        kind: undefined,
        list: [],
        loading: true,
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
          startTime: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          endTime: this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : null,
          kind: this.kind
        };
        get(`${BASE_URL}/messageSent/v1/MsSentInfo/selectList`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.list = res.data;
          }
        });
      },
      resetSearchCondition() {
        this.startTime = null;
        this.endTime = null;
        this.kind = undefined;
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
    }
  }
</script>

<style scoped>

</style>
