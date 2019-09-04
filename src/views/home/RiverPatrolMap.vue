<template>
  <div id="map" style="position: relative;width:100%; height:100%;border-radius: 4px;border: 1px solid #cccccc">
    <a-icon type="fullscreen-exit" class="map-control full-screen" title="进入全屏" v-if="isFullScreen"
            @click="existFullScreen"/>
    <a-icon type="fullscreen" class="map-control exist-full-screen" title="退出全屏" v-else @click="fullScreen"/>
    <div id="regionSelect" class="map-control">
      <div
        style="height: 100%;width: 100%;position: absolute;top: 0;left: 0;opacity: 0.3;background-color: black;z-index: -1;border-radius: 4px"></div>
      <span style="color: white;margin-right: 12px;font-size: 14px">选择区域</span>
      <select style="width: 180px;height: 32px;padding-left: 12px;font-size: 14px;color: rgba(0,0,0,0.85)"
              v-model="regionId">
        <option value="">-- 请选择 --</option>
        <option v-for="item in regionList" :key="item.id" :value="item.id">{{item.name}}</option>
      </select>
    </div>
    <div class="map-control" style="bottom: 12px;right: 12px;box-shadow: none;height: 90px;width: 135px;padding: 10px;background-color: white;font-size: 14px;color: rgba(0,0,0,.85)">
      <p style="border-left: solid 3px #9c9b9b;color: rgba(0,0,0,.85);padding-left: 10px;margin: 0">图标类别</p>
      <ul style="list-style: none;margin-top: 4px;padding-left: 4px">
        <li style="display: flex;padding: 2px 0;align-items: center;flex-wrap: nowrap">
          <img src="../../../public/river-patrol-legend.gif" width="20"/>
          <span style="margin-left: 5px">巡河：</span>
          <span>{{patrolAmount}} 人</span>
        </li>
        <li style="display: flex;padding: 2px;align-items: center;flex-wrap: nowrap">
          <img src="../../../public/online-legend.png" width="20"/>
          <span style="margin-left: 5px">在线：</span>
          <span>{{onlineAmount}} 人</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_PATROL_AND_ONLINE_DATA, GET_REGION_LIST} from "../../api/event";
  import {GET_RIVER_PATROL_AND_ONLINE_DETAIL} from "../../api/home";
  import {REGION_ID} from "../../config/config";
  import {timer} from 'rxjs';

  export default {
    data() {
      return {
        isFullScreen: false,
        regionList: [],
        regionId: '',
        map:null,
        onlineAmount:'-',
        patrolAmount:'-',
        subscription:null,
        polyline:null
      }
    },
    mounted() {
      this.getRegionList();
      this.initMap();
    },
    beforeDestroy(){
      this.subscription.unsubscribe();
    },
    methods: {
      getRegionList() {
        get(GET_REGION_LIST).then(res => {
          if (res.resCode === 1) {
            this.regionList = res.data;
          }
        })
      },
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.222880472695, 39.07894444826), 13);
        setTimeout(()=>{
          this.map.checkResize();
        },100);
        // 地图初始化完毕后开始轮询
        this.subscription=timer(500, 30000).subscribe(()=>{
          this.getPatrolAndOnlineDetail();
          this.getPatrolAndOnlineAmount();
        });
      },
      getPatrolAndOnlineAmount(){
        get(`${GET_PATROL_AND_ONLINE_DATA}${REGION_ID}`).then(res=>{
          if(res.resCode===1){
            this.patrolAmount=res.data.countPatrol;
            this.onlineAmount=res.data.countOnline;
          }
        });
      },
      fullScreen() {
        const el = document.getElementById("map");
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
        this.isFullScreen = true;
      },
      existFullScreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullScreen = false;
      },
      repaint(region){
        if(region.longitude&&region.latitude){
          this.map.panTo(new T.LngLat(region.longitude,region.latitude),10+region.grade);
        }else {
          this.$message.warn('无经纬度，无法绘制');
        }
        // if(region.spatialData){
        //   const pointStringArray=region.spatialData.slice(15,region.spatialData.length-3).split(',');
        //   const arr=[];
        //   pointStringArray.forEach(item=>{
        //     let LngLatArr= item.split(' ');
        //     arr.push(new T.LngLat(parseFloat(LngLatArr[0]),parseFloat(LngLatArr[1])))
        //   });
        //   console.log(arr);
        //   const polyline = new T.Polyline(arr, {color:"red", weight:3, opacity:0.5});
        //   this.map.addOverLay(polyline);
        //   this.polyline=Object.freeze(polyline);
        // }
      },
      getPatrolAndOnlineDetail(){
        const params= {
          hzname: "",
          status: "Y,L", //Y在线,L巡河,O离线
          level: "2,3,4,5"
        };
        get(`${GET_RIVER_PATROL_AND_ONLINE_DETAIL}/${REGION_ID}`,params).then(res=>{
          if(res.resCode===1){
            this.map.clearOverLays();// 把所有覆盖物都删除了，之后还得把边界线给加上
            const onlineIcon = new T.Icon({
              iconUrl: '/hzz/online-legend.png',
              iconSize: new T.Point(24, 24),
              iconAnchor: new T.Point(10, 25)
            });
            const patrolIcon = new T.Icon({
              iconUrl: '/hzz/river-patrol-legend.gif',
              iconSize: new T.Point(32, 32),
              iconAnchor: new T.Point(10, 25)
            });
            res.data.forEach(item=>{
              if(item.status===1){
                const marker = new T.Marker(new T.LngLat(item.longitude, item.latitude), {icon: onlineIcon});
                this.map.addOverLay(marker);
              }else if(item.status===2){
                const marker = new T.Marker(new T.LngLat(item.longitude, item.latitude), {icon: patrolIcon});
                this.map.addOverLay(marker);
              }
            })
          }
        })
      }
    },
    watch: {
      regionId(newValue) {
        const selectedRegion = this.regionList.find(item => item.id === newValue);
        this.repaint(selectedRegion);
      }
    }
  }
</script>

<style scoped>
  .map-control {
    position: absolute;
    box-shadow: 2px 2px 2px rgba(35, 4, 4, 0.54);
    z-index: 500;
    border-radius: 4px;
  }

  .full-screen, .exist-full-screen {
    color: #000;
    padding: 8px;
    background-color: rgba(255, 255, 255, .8);
    top: 12px;
    left: 12px;
    font-size: 28px;
    cursor: pointer;
  }

  #regionSelect {
    height: 50px;
    padding: 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 12px;
    right: 12px;
  }
</style>
