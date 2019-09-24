<template>
  <div class="card-container">
    <a-card title="无人机巡河预警分析" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>预警内容：</span>
        <a-select class="default-select-width" style="margin-right: 40px" v-model="content" placeholder="请选择预警内容">
          <a-select-option v-for="(value,key) in warnContentEnum" :key="key" :value="key">{{value}}</a-select-option>
        </a-select>
        <span>预警内容：</span>
        <a-select v-model="videoId" class="default-select-width" style="margin-right: 40px" placeholder="请选择预警内容">
          <a-select-option v-for="item in videoList" :value="item.id" :key="item.id">{{item.uavName}}</a-select-option>
        </a-select>
        <span>预警状态：</span>
        <a-select class="default-select-width" style="margin-right: 40px" v-model="type" placeholder="请选择预警状态">
          <a-select-option v-for="(value,key) in warnTypeEnum" :key="key" :value="key">{{value}}</a-select-option>
        </a-select>
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="resetSearchCondition">重置</a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="false"
                 :loading="loading">
        <span slot="imageFile" slot-scope="item">
          <image-preview :image-url="item.imageFile?item.imageFile:''"></image-preview>
        </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>
<script>
  import axios from "axios";
  import ImagePreview from "../../components/ImagePreview";

  const warnContentEnum={
    '1':'河道垃圾预警',
    '2':'违章建筑预警'
  };

  const warnTypeEnum={
    '0':'已处理',
    '1':'已取消',
    '2':'未处理'
  };

  const columns=[
    {title:'序号',dataIndex:'index'},
    {title:'预警内容',dataIndex:'warningContent'},
    {title:'预警无人机名称',dataIndex:'uavName'},
    {title:'预警状态',dataIndex:'warningTypeName'},
    {title: '预警图片', key: 'imageFile', scopedSlots: {customRender: 'imageFile'},width:120}
  ];

  export default {
    components: {ImagePreview},
    data() {
      return {
        content:undefined,
        videoId:undefined,
        type:undefined,
        videoList:[],
        list:[],
        columns,
        warnContentEnum,
        warnTypeEnum,
        loading:true
      }
    },
    mounted(){
      this.getList();
      this.getVideoList();
    },
    methods:{
      // 因为返回字段不一致，这里就不用封装过的axios，以免正常响应被拦截
      // 同时应为接口不多，url硬编码
      getList(){
        this.loading=true;
        const params={
          content:this.content,
          videoId:this.videoId,
          type:this.type,
        };
        axios({
          method: 'post',
          url: 'http://122.224.129.35:9090/v4/forewarningManagement/list',
          headers: {
            'Access-Token': sessionStorage.getItem('Access-Token')
          },
          params:params
        }).then(res => {
          this.loading=false;
          if (res.status === 200) {
            if(res.data.code===200){
              this.handleData(res.data.results.messageList);
            } else {
              this.$message.error(res.data.msg);
            }
          }else {
            this.$message.error('服务器出错')
          }
        })
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=index+1;
          item.warningTypeName=this.warnTypeEnum[item.warningType];
        });
        this.list=list;
      },
      getVideoList(){
        axios({
          method: 'post',
          url: 'http://122.224.129.35:9090/v4/uav/getUavList',
          headers: {
            'Access-Token': sessionStorage.getItem('Access-Token')
          }
        }).then(res => {
          if (res.status === 200) {
            if(res.data.code===200){
              this.videoList=res.data.results.uavList;
            } else {
              this.$message.error(res.data.msg);
            }
          }else {
            this.$message.error('服务器出错')
          }
        }).catch(err => {
          this.$message.error('请求出错')
        })
      },
      resetSearchCondition(){
        this.content=undefined;
        this.videoId=undefined;
        this.type=undefined;
      },
      handleTableClick(e){

      },
    }
  }
</script>

<style scoped>

</style>
