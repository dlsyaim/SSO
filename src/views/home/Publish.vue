<template>
  <div @click="getDetail">
    <a-collapse accordion defaultActiveKey="1">
      <a-collapse-panel :style="headerStyle" header="工作动态" key="1">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list1" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="工作简报" key="2">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list2" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="暗查暗访" key="3">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list3" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="督导检查" key="4">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list4" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="考核通报" key="5">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list5" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="政策文件" key="6">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list6" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="水质报告" key="7">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list7" :key="item.id" class="publish-item" :data-id="item.id">
            <span :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
      <a-collapse-panel :style="headerStyle" header="督办单" key="8">
        <ul style="padding: 0;margin: 0">
          <li v-for="item in list8" :key="item.id" class="publish-item" :data-id="item.id">
            <span class="publish-item-title" :data-id="item.id">{{item.title}}</span>
            <span :data-id="item.id">{{item.post_time}}</span>
          </li>
        </ul>
      </a-collapse-panel>
    </a-collapse>
    <a-modal
      v-model="showDetail"
      @ok="showDetail=false"
      :width="isMax?'100%':'900px'"
      destroyOnClose
      centered
      :footer="null"
    >
      <slot name="title">
        <p style="display: flex;justify-content: space-between;align-items: center;font-size: 16px;font-weight: 500;color: rgba(0,0,0,.85)">
          <span>{{detail.title}}</span>
          <a-icon v-if="isMax"  class="modal-header-icon" title="最小化" @click="isMax=false" type="minus" />
          <a-icon v-else class="modal-header-icon" type="plus" @click="isMax=true" title="最大化" />
        </p>
      </slot>
      <a-spin :spinning="loadingDetail">
        <div :style="{height:isMax?'auto':'600px',overflowY:isMax?'hidden':'auto'}">
          <div v-html="detail.detail"></div>
          <img v-if="detail.showImage" :src="detail.imageUrl"/>
          <PDF :height="isMax?'880px':'600px'" v-if="detail.showPDF" :src="detail.pdfUrl"></PDF>
        </div>
      </a-spin>

    </a-modal>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_PUBLISH_DETAIL, GET_PUBLISH_LIST} from "../../api/home";
  import {FILE_URL_PREFIX, PDF_FILE_URL} from "../../config/config";
  import PDF from "../../components/PDF";
  export default {
    components:{PDF},
    data() {
      return {
        list1: [],
        list2: [],
        list3: [],
        list4: [],
        list5: [],
        list6: [],
        list7: [],
        list8: [],
        showDetail: false,
        detail: {},
        loadingDetail:false,
        isMax:false
      }
    },
    computed:{
      headerStyle(){
        return {
          fontSize:'16px'
        }
      }
    },
    mounted() {
      this.getList1();
      this.getList2();
      this.getList3();
      this.getList4();
      this.getList5();
      this.getList6();
      this.getList7();
      this.getList8();
    },
    methods: {
      getList1() {
        get(GET_PUBLISH_LIST, {type: 2}).then(res => {
          if (res.resCode === 1) {
            this.list1 = res.data;
          }
        })
      },
      getList2() {
        get(GET_PUBLISH_LIST, {type: 3}).then(res => {
          if (res.resCode === 1) {
            this.list2 = res.data;
          }
        })
      },
      getList3() {
        get(GET_PUBLISH_LIST, {type: 1}).then(res => {
          if (res.resCode === 1) {
            this.list3 = res.data;
          }
        })
      },
      getList4() {
        get(GET_PUBLISH_LIST, {type: 4}).then(res => {
          if (res.resCode === 1) {
            this.list4 = res.data;
          }
        })
      },
      getList5() {
        get(GET_PUBLISH_LIST, {type: 5}).then(res => {
          if (res.resCode === 1) {
            this.list5 = res.data;
          }
        })
      },
      getList6() {
        get(GET_PUBLISH_LIST, {type: 6}).then(res => {
          if (res.resCode === 1) {
            this.list6 = res.data;
          }
        })
      },
      getList7() {
        get(GET_PUBLISH_LIST, {type: 7}).then(res => {
          if (res.resCode === 1) {
            this.list7 = res.data;
          }
        })
      },
      getList8() {
        get(GET_PUBLISH_LIST, {type: 8}).then(res => {
          if (res.resCode === 1) {
            this.list8 = res.data;
          }
        })
      },
      getDetail(e) {
        const id = e.target.dataset.id;
        if (id) {
          this.showDetail = true;
          this.loadingDetail=true;
          get(GET_PUBLISH_DETAIL, {id: id}).then(res => {
            this.loadingDetail=false;
            if(res.resCode===1){
              this.handleDetail(res.data);
            }
          });
        }
      },
      handleDetail(detail){
        const index=detail.ren.indexOf('.');
        const afterFix=detail.ren.slice(index+1).toLowerCase();
        if(afterFix==='jpg'||afterFix==='png'||afterFix==='jpeg'){
          detail.showImage=true;
          detail.imageUrl=FILE_URL_PREFIX+detail.attand_url;
        }else {
          detail.showImage=false;
        }
        if(detail.detail_url&&afterFix==='pdf'){
          detail.showPDF=true;
          detail.pdfUrl=PDF_FILE_URL+detail.detail_url;
        }else {
          detail.showPDF=false;
        }
        this.detail=detail;
      }
    }
  }
</script>

<style scoped>
  .publish-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    cursor: pointer;
    font-size: 14px;
    color: rgba(0,0,0,0.8);
    font-weight: normal;
    padding: 0 6px;
  }

  .publish-item:hover {
    background-color: #f2f2f2;
  }

  .publish-item-title{
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<style>
  .modal-header-icon{
    transform: translateY(-15px);
    margin-right: 30px;
    padding: 10px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color .2s ease-in-out;
  }
  .modal-header-icon:hover{
    color: rgba(0, 0, 0, 0.8);;
  }
</style>
