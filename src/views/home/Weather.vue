<template>
  <div style="background-color: #1192F6;position: relative;padding: 10px;color: #ffffff">
    <iframe width="400" scrolling="no" height="50" frameborder="0" allowtransparency="true"
            src="//i.tianqi.com/index.php?c=code&id=12&color=%23FFFFFF&bgc=%23&icon=1&num=1&site=16"></iframe>
    <div id="dateTimeContainer">
      <span>{{year}} 年 {{month}} 月 {{date}} 日</span>
      <span>{{hour}} : {{minute}} : {{second}}</span>
    </div>
    <p style="font-size: 16px;margin-top: 10px">
      当前巡河
      <span style="font-size: 14px;margin:0 12px 0 8px">次数</span>
      <span style="font-size: 14px">区级</span>
      <span style="font-size: 14px;margin: 0 10px 0 2px">{{riverPatrolCount.countyCount?riverPatrolCount.countyCount:0}}</span>
      <span style="font-size: 14px">街级</span>
      <span style="font-size: 14px;margin: 0 10px 0 2px">{{riverPatrolCount.townCount?riverPatrolCount.townCount:0}}</span>
    </p>
  </div>
</template>

<script>
  import {timer} from 'rxjs'
  import {get} from "../../util/axios";
  import {GET_RIVER_PATROL_COUNT} from "../../api/home";

  export default {
    data() {
      return {
        subscription:null,
        year:'----',
        month:'--',
        date:'--',
        hour:'--',
        minute:'--',
        second:'--',
        riverPatrolCount:{}
      }
    },
    mounted(){
      this.getRiverPatrolCount();
      this.subscription=timer(0,1000).subscribe(()=>{
        const now=new Date();
        this.year=now.getFullYear();
        this.month=now.getMonth()+1;
        this.date=now.getDate();
        let hour=now.getHours();
        if(hour<10){
          hour='0'+hour;
        }
        this.hour=hour;
        let minute=now.getMinutes();
        if(minute<10){
          minute='0'+minute;
        }
        this.minute=minute;
        let second=now.getSeconds();
        if(second<10){
          second='0'+second;
        }
        this.second=second
      })
    },
    beforeDestroy(){
      this.subscription.unsubscribe();
    },
    methods:{
      getRiverPatrolCount(){
        get(GET_RIVER_PATROL_COUNT).then(res=>{
          if(res.resCode===1){
            this.riverPatrolCount=res.data;
          }
        })
      }
    }
  }
</script>

<style scoped>
  #dateTimeContainer {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    height: 54px;
    top: 10px;
    right: 10px;
    font-size: 16px;
  }
</style>
