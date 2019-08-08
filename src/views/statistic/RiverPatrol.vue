<template>
  <div class="card-container">
    <a-card title="巡河统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 18px">
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
        <a-radio-group v-model="mode" size="small" buttonStyle="solid">
          <a-radio-button value="table">表格</a-radio-button>
          <a-radio-button value="chart">图表</a-radio-button>
        </a-radio-group>
      </div>
      <div @click="handleTableClick" v-show="mode==='table'">
        <a-table :columns="columns"
                 rowKey="index"
                 :dataSource="list"
                 :pagination="false"
                 :loading="loading"
        >
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" slot="countyHasPatrolNum"
                slot-scope="item">{{item.countyHasPatrolNum}}</span>
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" slot="countyPatrolRate"
                slot-scope="item">{{item.countyPatrolRate}}%</span>
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" slot="townHasPatrolNum"
                slot-scope="item">{{item.townHasPatrolNum}}</span>
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" slot="townPatrolRate"
                slot-scope="item">{{item.townPatrolRate}}%</span>
        </a-table>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center" v-show="mode==='chart'">
        <div id="chart1" style="height: 400px;width: 80%"></div>
        <div id="chart2" style="height: 400px;width: 80%;margin-top: 20px"></div>
      </div>
    </a-card>
  </div>
</template>

<script>

  import {get} from "../../util/axios";
  import {BASE_URL} from "../../config/config";
  import moment from 'moment';

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '行政区域', dataIndex: 'regionName'},
    {title: '街级河长巡河次数', key: 'townHasPatrolNum', scopedSlots: {customRender: 'townHasPatrolNum'}, align: 'center'},
    {title: '街级达标率(%)', key: 'townPatrolRate', scopedSlots: {customRender: 'townPatrolRate'}, align: 'center'}
  ];

  export default {
    data() {
      return {
        startTime: null,
        endTime: null,
        mode: 'table',
        list: [],
        loading: true,
        grade:null,
        columns,
        isChartInit: false
      }
    },
    mounted() {
      this.getGrade();
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          startTime: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          endTime: this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : null
        };
        get(`${BASE_URL}/resumption/v1/resumption/listReachPatrolNumStatistic`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.list);
            if (!this.isChartInit) {
              this.initChart();
            }
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = index + 1;
        });
        this.list = list;
      },
      getGrade() {
        get(`${BASE_URL}/resumption/v1/resumption/findCurrentUserGrade`).then(res => {
          if (res.resCode === 1) {
            this.grade=res.data;
            if (res.data < 3) {
              this.columns = [
                {title: '序号', dataIndex: 'index'},
                {title: '行政区域', dataIndex: 'regionName'},
                {
                  title: '区级河长巡河次数',
                  key: 'countyHasPatrolNum',
                  scopedSlots: {customRender: 'countyHasPatrolNum'},
                  align: 'center'
                },
                {
                  title: '区级达标率(%)',
                  key: 'countyPatrolRate',
                  scopedSlots: {customRender: 'countyPatrolRate'},
                  align: 'center'
                },
                {
                  title: '街级河长巡河次数',
                  key: 'townHasPatrolNum',
                  scopedSlots: {customRender: 'townHasPatrolNum'},
                  align: 'center'
                },
                {
                  title: '街级达标率(%)',
                  key: 'townPatrolRate',
                  scopedSlots: {customRender: 'townPatrolRate'},
                  align: 'center'
                }
              ];
            } else if (res.data < 4) {
              this.columns = [
                {title: '序号', dataIndex: 'index'},
                {title: '行政区域', dataIndex: 'regionName'},
                {
                  title: '街级河长巡河次数',
                  key: 'townHasPatrolNum',
                  scopedSlots: {customRender: 'townHasPatrolNum'},
                  align: 'center'
                },
                {
                  title: '街级达标率(%)',
                  key: 'townPatrolRate',
                  scopedSlots: {customRender: 'townPatrolRate'},
                  align: 'center'
                }
              ];
            }
          }
        })
      },
      resetSearchCondition() {
        this.startTime = null;
        this.endTime = null;
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
      handleTableClick(e) {
        const regionId = e.target.dataset.id;
        if (regionId) {
          this.$router.push({path: '/statistic/river-patrol-detail', query: {region_id: regionId}});
        }
      },
      initChart() {
        const chartOption1 = {
          title: {
            text: '区级河长巡河情况',
            left: 'center'
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            top: 40,
            data: ['已巡查次数', '应巡查次数', '巡查达标率'],
          },
          grid: {
            top: '50%',
            height: '120'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{a0}: {c}<br />{a1}: {c1}<br />{a2}: {c2}%'
          },
          xAxis: {
            data: [],
            silent: false,
            axisLine: {onZero: true},
            splitLine: {show: false},
            splitArea: {show: false}
          },
          yAxis: [
            {
              type: 'value',
              name: '次数',
              splitLine: {show: false}
            },
            {
              type: 'value',
              name: '达标率',
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: '已巡查次数',
              type: 'bar',
              stack: '总数',
              barWidth: 30,
              data: [],
              itemStyle: {
                normal: {
                  color: 'rgb(143,195,31)'
                }
              },
            },
            {
              name: '应巡查次数',
              type: 'bar',
              stack: '总数',
              data: [],
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: 'rgb(85,205,246)'
                }
              }
            },
            {
              name: '巡查达标率',
              type: 'line',
              yAxisIndex: 1,
              data: [],
              itemStyle: {
                normal: {
                  color: 'rgb(63,182,117)'
                }
              }
            }
          ]
        };
        const chartOption2 = {
          title: {
            text: '街级河长巡河情况',
            left: 'center'
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            top: 40,
            data: ['已巡查次数', '应巡查次数', '巡查达标率'],
          },
          grid: {
            top: '50%',
            height: '120'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{a0}: {c}<br />{a1}: {c1}<br />{a2}: {c2}%'
          },
          xAxis: {
            data: [],
            silent: false,
            axisLine: {onZero: true},
            splitLine: {show: false},
            splitArea: {show: false}
          },
          yAxis: [
            {
              type: 'value',
              name: '次数',
              splitLine: {show: false}
            },
            {
              type: 'value',
              name: '达标率',
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: '已巡查次数',
              type: 'bar',
              stack: '总数',
              barWidth: 30,
              data: [],
              itemStyle: {
                normal: {
                  color: 'rgb(143,195,31)'
                }
              },
            },
            {
              name: '应巡查次数',
              type: 'bar',
              stack: '总数',
              data: [],
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: 'rgb(85,205,246)'
                }
              }
            },
            {
              name: '巡查达标率',
              type: 'line',
              yAxisIndex: 1,
              data: [],
              itemStyle: {
                normal: {
                  color: 'rgb(63,182,117)'
                }
              }
            }
          ]
        };
        this.list.forEach(item=>{
          chartOption1.xAxis.data.push(item.regionName);
          chartOption1.series[0].data.push(item.countyHasPatrolNum);
          chartOption1.series[1].data.push(item.countyNeedPatrolNum);
          chartOption1.series[2].data.push(item.countyPatrolRate);
          chartOption2.xAxis.data.push(item.regionName);
          chartOption2.series[0].data.push(item.townHasPatrolNum);
          chartOption2.series[1].data.push(item.townNeedPatrolNum);
          chartOption2.series[2].data.push(item.townPatrolRate);
        });
        echarts.init(document.getElementById('chart1')).setOption(chartOption1);
        echarts.init(document.getElementById('chart2')).setOption(chartOption2);
      }
    }
  }
</script>

<style scoped>

</style>
