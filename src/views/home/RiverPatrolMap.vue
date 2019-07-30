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
    <div class="map-control" style="bottom: 12px;right: 12px;box-shadow: none;height: 90px;width: 125px;padding: 10px;background-color: white;font-size: 14px;color: rgba(0,0,0,.85)">
      <p style="border-left: solid 3px #9c9b9b;color: rgba(0,0,0,.85);padding-left: 10px;margin: 0">图标类别</p>
      <ul style="list-style: none;margin-top: 4px;padding-left: 4px">
        <li style="display: flex;padding: 2px 0;align-items: center">
          <img src="../../assets/river-patrol-legend.gif" width="20"/>
          <span style="margin-left: 5px">巡河：</span>
          <span>{{patrolAmount}} 人</span>
        </li>
        <li style="display: flex;padding: 2px;align-items: center">
          <img src="../../assets/online-legend.png" width="20"/>
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

  export default {
    data() {
      return {
        isFullScreen: false,
        regionList: [],
        regionId: '',
        map:null,
        onlineAmount:'-',
        patrolAmount:'-'
      }
    },
    mounted() {
      this.getRegionList();
      this.initMap();
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
        this.getPatrolAndOnlineData();
      },
      getPatrolAndOnlineData(){
        get(`${GET_PATROL_AND_ONLINE_DATA}120103000000`).then(res=>{
          if(res.resCode===1){
            console.log(res.data);
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
        this.map.panTo(new T.LngLat(region.longitude,region.latitude),10+region.grade)
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
