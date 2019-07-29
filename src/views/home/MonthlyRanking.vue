<template>
  <a-card :title="null">
    <a-spin :spinning="loading">
      <div style="width: 100%;height: 280px"></div>
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
        month: ''
      }
    },
    mounted() {
      this.initDate();
      this.getData();
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
        if(month<9){
          month='0'+month;
        }
        this.year = year;
        this.month = month;
      },
      getData() {
        this.loading = true;

        const params = {
          date: `${this.year}-${this.month}`
        };
        get(GET_MONTH_RANK, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            console.log(res);
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
