<template>
  <div class="card-container">
    <a-card title="信息发布详情" :bordered="false" style="min-height: 100%" id="card">
      <a-button type="primary" slot="extra" @click="$router.push('/publish/info-publish')">返回</a-button>
      <img v-if="showImage" style="margin-bottom: 20px" :src="imageUrl"/>
      <PDF height="700px" v-if="showPDF" :src="pdfUrl"></PDF>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../../util/axios";
  import {BASE_URL, FILE_URL_PREFIX} from "../../../config/config";
  import PDF from '../../../components/PDF';

  export default {
    components:{PDF},
    data() {
      return {
        id:'',
        showImage:false,
        showPDF:false,
        imageUrl:'',
        pdfUrl:''
      }
    },
    beforeMount(){
      this.id=this.$route.query.id;
    },
    mounted(){
      this.getDetail();
    },
    methods:{
      getDetail(){
        get(`${BASE_URL}/bulletin/v1/bulletin/detail?id=${this.id}`).then(res=>{
          if(res.resCode===1){
            this.handleDetail(res.data);
          }
        })
      },
      handleDetail(detail){
        const index=detail.picUrl.indexOf('.');
        const afterFix=detail.picUrl.slice(index+1).toLowerCase();
        if(afterFix==='jpg'||afterFix==='png'||afterFix==='jpeg'){
          this.showImage=true;
          this.imageUrl=FILE_URL_PREFIX+detail.attand_url;
        }else {
          this.showImage=false;
        }
        const fileIndex=detail.detail_url.indexOf('.');
        const fileAfterFix=detail.detail_url.slice(fileIndex+1).toLowerCase();
        if(detail.detail_url&&fileAfterFix==='pdf'){
          this.showPDF=true;
          this.pdfUrl=FILE_URL_PREFIX+detail.detail_url;
        }else {
          this.showPDF=false;
        }
      }
    }

  }
</script>

<style scoped>

</style>
