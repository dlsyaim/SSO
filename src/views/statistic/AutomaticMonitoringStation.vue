<template>
  <div style="padding: 18px;height: 99%;width: 100%;display: flex;justify-content: space-between">
    <div style="width: 49%;height: 100%">
      <a-card :bodyStyle="{padding:0}" :bordered="false" style="min-height: 100%;">
        <div class="card-title">水质指标趋势图</div>
        <div class="card-body">
          <div>
            <span>监测站名字：</span>
            <a-select :value="selectedStationId" style="width: 240px" @change="handleStationChange"
                      placeholder="请选择监测站名称">
              <a-select-option v-for="item in stationList" :value="item.id" :key="item.id">
                {{item.stationName}}
              </a-select-option>
            </a-select>
          </div>
          <div style="height: 700px;overflow-y: auto;margin: 10px 0">
            <div style="height: 300px" id="chart1"></div>
            <div style="height: 300px" id="chart2"></div>
            <div style="height: 300px" id="chart3"></div>
            <div style="height: 300px" id="chart4"></div>
            <div style="height: 300px" id="chart5"></div>
          </div>
        </div>
      </a-card>
    </div>
    <div style="width: 49%;height: 100%;display: flex;flex-direction: column;justify-content: space-between">
      <div style="width: 100%;height: 48%">
        <a-card :bodyStyle="{padding:0}" :bordered="false" style="height: 100%">
          <div class="card-title">水质指标环比趋势图</div>
          <div class="card-body">
            <div>
              <span>监测站名字：</span>
              <a-select :value="selectedStationId1" style="width: 240px" @change="handleStationChange1" placeholder="请选择监测站名称">
                <a-select-option v-for="item in stationList" :value="item.id" :key="item.id">
                  {{item.stationName}}
                </a-select-option>
              </a-select>
            </div>
            <div style="height: 300px" id="chart6"></div>
          </div>
        </a-card>
      </div>
      <div style="width: 100%;height: 48%">
        <a-card :bodyStyle="{padding:0}" :bordered="false" style="height: 100%">
          <div class="card-title">水质指标横向对比图</div>
          <div class="card-body">
            <div>
              <span>指标选择：</span>
              <a-select :value="selectedStationId2" @change="handleStationChange2" style="width: 240px" placeholder="请选择指标">
                <a-select-option value="ammoniaNitrogenIndex">
                  氨氮
                </a-select-option>
                <a-select-option value="codcrIndex">
                  C0DCr
                </a-select-option>
                <a-select-option value="totalPhosphorusIndex">
                  总磷
                </a-select-option>
                <a-select-option value="dissolvedOxygenIndex">
                  溶解氧
                </a-select-option>
                <a-select-option value="potassiumPermanganateIndex">
                  高锰酸钾
                </a-select-option>
              </a-select>
            </div>
            <div style="height: 300px" id="chart7"></div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';

  const indexTypeEnum = {
    'ammoniaNitrogen': '氨氮',
    'codcrIndex': 'C0DCr',
    'totalPhosphorus': '总磷',
    'dissolvedOxygen': '溶解氧',
    'potassiumPermanganate': '高锰酸钾',
  };

  export default {
    data() {
      return {
        baseUrl:'http://122.224.129.35:9092',
        selectedStationId: undefined,
        selectedStationId1: undefined,
        selectedStationId2: 'ammoniaNitrogenIndex',
        stationList: [],
        stationDetail: {},
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null,
        chart5: null,
        indexTypeEnum,
        c_name: [],
        momValue: [],
        yoyValue: [],
        jc_name:[],
        jc_data:[],
      }
    },
    mounted() {
      this.getStationList();
    },
    methods: {
      handleStationChange(e) {
        this.selectedStationId = e;
        console.log(e);
        this.getStationDetail();
      },
      handleStationChange1(e) {
        this.selectedStationId1 = e;
        console.log(e);
        this.getDataContrastByStaionId();
      },
      handleStationChange2(e) {
        this.selectedStationId2 = e;
        console.log(e);
        this.getStationContrastByIndex();
      },
      getStationList() {
        axios({
          method: 'get',
          url: `${this.baseUrl}/v6/waterMonitorStation/getStationNameAndIdList`,
          headers: {
            'Access-Token': sessionStorage.getItem('Access-Token')
          },
        }).then(res => {
          this.loading=false;
          if (res.status === 200) {
            if(res.data.code===200){
              this.stationList = res.data.results;
              this.e_charts1();
              if (this.stationList.length !== 0) {
                this.selectedStationId = this.stationList[0].id;
                this.selectedStationId1 = this.stationList[0].id;
                this.getStationDetail();
                this.getDataContrastByStaionId();
                this.getStationContrastByIndex();
              }
            } else {
              this.$message.error(res.data.msg);
            }
          }else {
            this.$message.error('服务器出错')
          }
        }).catch(err => {
          this.$message.error('请求出错')
        });
      },
      getStationDetail() {
        if (this.selectedStationId) {
          axios({
            method: 'get',
            url: `${this.baseUrl}/v6/waterQualityDetail/getDataTreadByStationId?stationId=${this.selectedStationId}`,
            headers: {
              'Access-Token': sessionStorage.getItem('Access-Token')
            }
          }).then(res => {
            this.loading=false;
            if (res.status === 200) {
              if(res.data.code===200){
                this.stationDetail = res.data.results;
                this.paint();
              } else {
                this.$message.error(res.data.msg);
              }
            }else {
              this.$message.error('服务器出错')
            }
          }).catch(err => {
            this.$message.error('请求出错')
          });
        }
      },
      getDataContrastByStaionId() {
        axios({
          method: 'get',
          url: `${this.baseUrl}/v6/waterQualityDetail/getDataContrastByStaionId?stationId=${this.selectedStationId1}`,
          headers: {
            'Access-Token': sessionStorage.getItem('Access-Token')
          }
        }).then(res => {
          this.loading=false;
          if (res.status === 200) {
            if(res.data.code===200){
              for (let i = 0; i < res.data.results.length; i++) {
                this.c_name[i] = res.data.results[i].name;
                this.yoyValue[i] = res.data.results[i].yoyValue;
                this.momValue[i] = res.data.results[i].momValue;
              }
              this.e_charts();
            } else {
              this.$message.error(res.data.msg);
            }
          }else {
            this.$message.error('服务器出错')
          }
        }).catch(err => {
          this.$message.error('请求出错')
        });
      },
      getStationContrastByIndex() {
        axios({
          method: 'get',
          url: `${this.baseUrl}/v6/waterQualityDetail/getStationContrastByIndex?index=${this.selectedStationId2}`,
          headers: {
            'Access-Token': sessionStorage.getItem('Access-Token')
          }
        }).then(res => {
          this.loading=false;
          if (res.status === 200) {
            if(res.data.code===200){
              for (let i = 0; i < res.data.results.length; i++) {
                this.jc_name[i] = res.data.results[i].stationNeame;
                this.jc_data[i] = res.data.results[i].val;
              }
              this.e_charts1();
            } else {
              this.$message.error(res.data.msg);
            }
          }else {
            this.$message.error('服务器出错')
          }
        }).catch(err => {
          this.$message.error('请求出错')
        });
      },
      paint() {
        this.chart1 = echarts.init(document.getElementById('chart1'));
        this.chart2 = echarts.init(document.getElementById('chart2'));
        this.chart3 = echarts.init(document.getElementById('chart3'));
        this.chart4 = echarts.init(document.getElementById('chart4'));
        this.chart5 = echarts.init(document.getElementById('chart5'));
        const option = {
          tooltip: {
            formatter: '指标：{a}<br/>时间：{b}<br/>数值：{c} mg/L'
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              rotate: 20
            },
            name: '时间',
            data: []
          },
          yAxis: {
            name: ''
          },
          series: [{
            name: '',
            type: 'line',
            data: []
          }]
        };
        this.stationDetail.data.forEach((item, index) => {
          option.xAxis.data = item.values.map(item => item.date);
          option.series[0].data = item.values.map(item => item.value);
          option.series[0].name = this.indexTypeEnum[item.index];
          option.yAxis.name = `${this.indexTypeEnum[item.index]} （单位：mg/L）`;
          this['chart' + (1 + index)].setOption(option);
        })
      },
      e_charts() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart6'));
// 绘制图表
        myChart.setOption({
          legend: {
            data: ['同比', '环比']
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.c_name,
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '同比',
              type: 'bar',
              data: this.momValue,
            },
            {
              name: '环比',
              type: 'bar',
              data: this.yoyValue,
            }
          ]
        });
      },
      e_charts1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart7'));
// 绘制图表
        myChart.setOption({
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : this.jc_name,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'直接访问',
              type:'bar',
              barWidth: '60%',
              data:this.jc_data
            }
          ]
        });
      },

    }
  }
</script>

<style scoped>
  .card-title {
    height: 48px;
    width: 100%;
    padding-left: 24px;
    display: flex;
    align-items: center;
    background-color: #438AFE;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
  }

  .card-body {
    padding: 20px;
  }
</style>
