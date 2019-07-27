<template>
  <div style="display: flex;flex-wrap: nowrap;width: 100%;height: 100%;">
    <div style="width: 25%;margin: 4px;">
      <Weather style="height: 120px;border-radius: 4px"></Weather>
      <Publish style="margin-top: 10px;height:730px;overflow-y: auto"></Publish>
    </div>
    <div style="width: 50%"></div>
    <div style="width: 25%;display: flex;flex-direction: column;justify-content: space-between">

    </div>
  </div>
</template>

<script>
  import Weather from "./Weather";
  import Publish from "./Publish";

  export default {
    components: {Weather,Publish},
    data() {
      return {}
    }
  }
</script>

<style scoped>

</style>
