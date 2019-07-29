<template>
  <a-card :title="null" :bodyStyle="{padding:0}">
    <a-spin :spinning="loading">
      <p style="font-size: 16px;font-weight: 600;margin: 8px 0 0 10px">月度考核排名({{month}}月)</p>
      <div style="width: 100%;height: 360px" id="monthlyRankingChart"></div>
    </a-spin>
  </a-card>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_MONTH_RANK} from "../../api/home";

  export default {
    data() {
      return {
        loading: true,
        year: '',
        month: '',
        chartInstance: null
      }
    },
    mounted() {
      this.initDate();
      this.getData();
      this.chartInstance = echarts.init(document.getElementById('monthlyRankingChart'));
    },
    methods: {
      initDate() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        const day = now.getDate();
        if (month === 0) {
          month = 12;
          year = year - 1;
        }
        if (day < 2) {
          month = month - 1;
        }
        this.year = year;
        this.month = month;
      },
      getData() {
        this.loading = true;
        const params = {
          date: `${this.year}-${this.month<9?'0'+this.month:this.month}`
        };
        get(GET_MONTH_RANK, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.renderChart(res.data);
          }
        })
      },
      renderChart(data) {
        const regionArray = [];
        const scoreArray = [];
        data.forEach(item => {
          regionArray.unshift(item.regionName);
          scoreArray.unshift(Number(item.resultScore));
        });
        const chartSetting = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            formatter(params) {
              return params[0].name + ' : ' + params[0].value;
            }
          },
          color: ['#ff0000', '#000000', '#000099', '#008000', '#00dd88'],
          grid: {
            top: 12,
            left:116,
            right:12,
            bottom:28
          },
          xAxis: [{
            type: 'value',
            position: 'bottom',
            data: [],
            axisTick: {
              alignWithLabel: false
            }
          }],
          yAxis: {
            type: 'category',
            data: regionArray,
            nameLocation: 'start',
            nameTextStyle: {
              fontSize: 10
            },
          },
          series: [{
            name: '',
            type: 'bar',
            data: scoreArray,
            barWidth: '30%',
            barGap: '1%',
            itemStyle: {   //配置样式，设置每个柱子的颜色
              normal: {
                color: function (params) {
                  const colorList = ['#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#00ae4f', '#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#60a6ec', '#0473e2', '#60a6ec', '#00ae4f', '#ffc000', '#0473e2', '#00ae4f'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }],
        };
        this.chartInstance.setOption(chartSetting);
      }
    }
  }
</script>

<style scoped>

</style>
