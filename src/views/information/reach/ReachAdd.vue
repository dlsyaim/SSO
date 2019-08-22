<template>
  <div class="card-container">
    <a-card title="新增河段" :bordered="false" style="min-height: 100%">
      <div style="display: flex;justify-content: space-between;">
        <div style="width: 70%"></div>
        <div style="width: 400px;height: 400px;border: 1px solid #cccccc;position: relative">
          <div id="map" style="height: 100%;width: 100%"></div>
          <a-button-group style="position: absolute;right: 10px;top: 10px;z-index: 600">
            <a-button title="画面" style="padding: 0 8px"><a-icon type="highlight" style="font-size: 20px"/></a-button>
            <a-button title="删除" style="padding: 0 8px"><a-icon type="delete" style="font-size: 20px"/></a-button>
            <a-button title="显示" style="padding: 0 8px"><a-icon type="fund" style="font-size: 20px"/></a-button>
            <a-button title="缩放" style="padding: 0 8px" v-if="isMapMax"><a-icon type="fullscreen-exit" style="font-size: 20px"/></a-button>
            <a-button title="最大化" style="padding: 0 8px" v-else><a-icon type="fullscreen" style="font-size: 20px"/></a-button>
          </a-button-group>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        map:null,
        isMapMax:false
      }
    },
    mounted(){
      this.initMap();
    },
    methods:{
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat( 117.113299075426,39.02788956452), 11);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
      },
    }
  }
</script>

<style scoped>

</style>
