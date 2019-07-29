<template>
  <a-card :title="null" :bodyStyle="{padding:0}">
    <a-spin :spinning="loading" id="problemSummaryTable">
      <p style="font-size: 16px;font-weight: 600;margin: 8px 0 0 16px">河湖问题汇总</p>
      <a-table :columns="columns"
               size="small"
               style="margin-top: 24px;min-height: 280px"
               :rowKey="record => record.index"
               :dataSource="list">
      </a-table>
    </a-spin>
  </a-card>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_PROBLEM_SUMMARY_LIST} from "../../api/home";

  const columns = [
    {title: '序号', dataIndex: 'index',width:30},
    {title: '所在区域', dataIndex: 'regionName',width:80},
    {title: '河段名称', dataIndex: 'riverName',width:100},
    {title: '河长', dataIndex: 'chairmanName',width:60},
    {title: '问题类型', dataIndex: 'problemType'}
  ];
  export default {
    data() {
      return {
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
        get(GET_PROBLEM_SUMMARY_LIST).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.list = res.data.map((item, index) => {
              item.index = index + 1;
              return item;
            });
          }
        });
      }
    }
  }
</script>

<style>
  #problemSummaryTable .ant-table-small thead>tr>th,#problemSummaryTable .ant-table-small tbody>tr>td {
    padding: 4px;
  }
</style>
