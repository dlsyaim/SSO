<template>
  <div class="card-container">
    <a-card title="约谈会议" :bordered="false" style="min-height: 100%">
      <!--<div style="display: flex;align-items: center">-->
        <!--<span>开始时间：</span>-->
        <!--<a-date-picker v-model="startTime" class="default-select-width" style="margin-right: 40px"-->
                       <!--:disabledDate="disableStartDate"/>-->
        <!--<span>结束时间：</span>-->
        <!--<a-date-picker v-model="endTime" class="default-select-width" style="margin-right: 40px"-->
                       <!--:disabledDate="disableEndDate"/>-->
        <!--<span>统计方式：</span>-->
        <!--<a-select v-model="kind" class="default-select-width" style="margin-right: 40px;" placeholder="请选择统计方式">-->
          <!--<a-select-option value="1">工作简报</a-select-option>-->
          <!--<a-select-option value="2">信息报送</a-select-option>-->
          <!--<a-select-option value="3">周动态</a-select-option>-->
        <!--</a-select>-->
        <!--<a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>-->
        <!--<a-button @click="resetSearchCondition">重置</a-button>-->
      <!--</div>-->
      <!--<a-table :columns="columns"-->
               <!--style="margin-top: 18px;"-->
               <!--rowKey="id"-->
               <!--:dataSource="list"-->
               <!--:pagination="false"-->
               <!--:loading="loading"-->
      <!--&gt;-->
      <!--</a-table>-->
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style scoped>

</style>
