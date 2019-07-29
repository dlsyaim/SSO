<template>
  <a-card :title="null" :bodyStyle="{padding:0,position:'relative'}">
    <a-spin :spinning="loading">
      <p style="font-size: 16px;font-weight: 600;margin: 8px 0 0 16px">水质情况({{month}}月)</p>
      <div style="width: 100%;height: 240px" id="waterQualityChart"></div>
      <a-button-group style="position: absolute;top: 2px;right: 12px" size="small">
        <a-button :type="isPieChart?'primary':'default'" @click="changeToPieChart">饼状图</a-button>
        <a-button :type="isPieChart?'default':'primary'" @click="changeToHistogram">柱状图</a-button>
      </a-button-group>
    </a-spin>
  </a-card>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_WATER_QUALITY} from "../../api/home";

  export default {
    data() {
      return {
        isPieChart:true,
        loading: true,
        month: '-',
        chartData:{}
      }
    },
    mounted() {
      this.getData();
      this.getMonth();
    },
    methods: {
      getMonth() {
        const now = new Date();
        let month = now.getMonth();
        const day = now.getDate();
        if (month === 0) {
          month = 12;
        }
        if (day < 2) {
          month = month - 1;
        }
        this.month = month;
      },
      getData() {
        this.loading = true;
        get(GET_WATER_QUALITY).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.chartData=res.data;
            this.renderPieChart();
          }
        })
      },
      renderPieChart() {
        const data=this.chartData;
        const type1 = ['Ⅰ-Ⅲ类', 'Ⅳ类', 'Ⅴ类'];
        const type2 = ['劣五类', '黑臭类', '河干'];
        const pieChartOption = {
          tooltip: {
            trigger: 'item',
            confine: true,
            formatter: function (params) {
              return params.name + ' </br> ' + params.value + '个' + '(' + params.percent + '%)';
            }
          },
          color: ['#72a7f5', '#1153b5', '#20d850', '#d2d820', '#e92432', '#3b3636'],
          legend: [
            {
              orient: 'vertical',
              icon: "circle",
              x: '65%',
              y: '25%',
              itemWidth: 10,  // 设置宽度
              itemHeight: 10, // 设置高度
              itemGap: 10,// 设置间距
              data: type1,
            },
            {
              orient: 'vertical',
              icon: "circle",
              x: '80%',
              y: '25%',
              itemWidth: 10,  // 设置宽度
              itemHeight: 10, // 设置高度
              itemGap: 10,// 设置间距
              data: type2,
            }
          ],
          series: [{
            name: '',
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['30%', '35%'],
            data: [
              {
                value: data ? data.one : 0,
                percent: data ? data.onePercent : 0,
                name: 'Ⅰ-Ⅲ类'
              },
              {
                value: data ? data.two : 0,
                percent: data ? data.twoPercent : 0,
                name: 'Ⅳ类'
              },
              {
                value: data ? data.three : 0,
                percent: data ? data.threePercent : 0,
                name: 'Ⅴ类'

              },
              {
                value: data ? data.four : 0,
                percent: data ? data.fourPercent : 0,
                name: '劣五类'
              },
              {
                value: data ? data.five : 0,
                percent: data ? data.fivePercent : 0,
                name: '黑臭类'
              },
              {
                value: data ? data.six : 0,
                percent: data ? data.sixPercent : 0,
                name: '河干'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                textStyle: {
                  color: '#333'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            }
          }]
        };
        echarts.init(document.getElementById('waterQualityChart')).setOption(pieChartOption);
      },
      renderHistogram(){
        const data=this.chartData;
       const histogramOption = {
          tooltip: {
            trigger: 'item',
            confine: true,
            formatter (params) {
              return params.name + ' </br> ' + params.value + '个';
            }
          },
          legend: {show:false},
          xAxis : [
            {
              type : 'category',
              data : ['Ⅰ-Ⅲ类','Ⅳ类','Ⅴ类','劣五类','黑臭类','河干']
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series: [{
            name: '水质情况',
            type: 'bar',
            data: [
              {
                value: data ? data.one : 0,
                percent:data ? data.onePercent : 0,
                name: 'Ⅰ-Ⅲ类'
              },
              {
                value: data ? data.two : 0,
                percent:data ? data.twoPercent : 0,
                name: 'Ⅳ类'
              },
              {
                value: data ? data.three : 0,
                percent:data ? data.threePercent : 0,
                name: 'Ⅴ类'

              },
              {
                value: data ? data.four : 0,
                percent:data ? data.fourPercent : 0,
                name: '劣五类'
              },
              {
                value: data ? data.five : 0,
                percent:data ? data.fivePercent : 0,
                name: '黑臭类'
              },
              {
                value: data ? data.six : 0,
                percent:data ? data.sixPercent : 0,
                name: '河干'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                textStyle: {
                  color: '#333'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            barWidth:30
          }],
          grid: {
            y:10
          }
        };
        echarts.init(document.getElementById('waterQualityChart')).setOption(histogramOption);
      },
      changeToPieChart(){
        this.isPieChart=true;
        this.renderPieChart();
      },
      changeToHistogram(){
        this.isPieChart=false;
        this.renderHistogram();
      }
    }
  }
</script>

<style scoped>

</style>
