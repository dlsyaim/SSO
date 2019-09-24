<template>
  <div class="card-container">
    <a-card title="水系详情" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="width: 100%;height: 400px;border: 1px solid #cccccc;position: relative;z-index: 10;">
        <div id="map" style="height: 100%;width: 100%;"></div>
      </div>
      <a-row class="modal-detail-item" style="margin-top: 30px">
        <a-col span="6">
          <span class="detail-item-label">水系名称：</span>
          <span>{{detail.waterName}}</span>
        </a-col>
        <a-col span="6">
          <span class="detail-item-label">所属流域：</span>
          <span>{{detail.basinName}}</span>
        </a-col>
      </a-row>
      <div class="modal-detail-item">
        <span class="detail-item-label">概述内容：</span>
        <div style="display: inline-block" v-html="detail.overView"></div>
      </div>
      <div class="modal-detail-item">
        <span class="detail-item-label">备注信息：</span>
        <span>{{detail.remark}}</span>
      </div>
      <div class="modal-detail-item">
        <span class="detail-item-label">图片：</span>
        <div style="display: inline-flex;">
          <ImagePreview v-for="(item,index) in detail.jsonImages" :key="index" :image-url="item.virtualPath"></ImagePreview>
        </div>
      </div>
      <div class="modal-detail-item">
        <span class="detail-item-label">文件：</span>
        <div style="display: inline-block">
          <span  v-for="(item,index) in detail.jsonFiles" :key="index"><a :href="FILE_URL_PREFIX+item.virtualPath" target="_blank">{{item.name}}</a><br/></span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {BASE_URL, FILE_URL_PREFIX} from "../../../config/config";
  import {get} from "../../../util/axios";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import calculateCenterPoint from "../../../util/calculateCenterPoiont";
  import ImagePreview from "../../../components/ImagePreview";

  export default {
    components: {ImagePreview, ACol, ARow},
    data() {
      return {
        detail: {},
        map: null,
        FILE_URL_PREFIX
      }
    },
    mounted() {
      const id = this.$route.query.id;
      this.getDetail(id);
    },
    methods: {
      getDetail(id) {
        get(`${BASE_URL}/watersource/v1/waterSystem/detail?id=${id}`).then(res => {
          if (res.resCode === 1) {
            this.detail = res.data;
            console.log(res.data);
            this.initMap();
          }
        })
      },
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.113299075426, 39.02788956452), 11);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
        const pointString=this.detail.linePoints;
        const pointArray=[];
        if(pointString){
          const points = [];
          pointString.split(',').forEach(item=>{
            let arr=item.split(' ').map(item=>+item);
            pointArray.push(arr);
          });
          this.map.centerAndZoom(new T.LngLat(pointArray[0][0], pointArray[0][1]), 12);
          pointArray.forEach(item=>{
            points.push(new T.LngLat(item[0], item[1]));
          });
          const polygon = new T.Polygon(points);
          this.map.addOverLay(polygon);
        }
      }
    }
  }
</script>

<style scoped>

</style>
