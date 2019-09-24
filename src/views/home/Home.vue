<template>
  <div style="display: flex;flex-wrap: nowrap;width: 100%;height: 100%;">
    <div style="width: 25%;margin: 4px 2px;">
      <Weather style="height: 120px;border-radius: 4px"></Weather>
      <Publish style="margin-top: 10px;height:730px;overflow-y: auto"></Publish>
    </div>
    <div style="width: 50%;margin: 4px ">
      <RiverPatrolMap></RiverPatrolMap>
    </div>
    <div style="width: 25%;display: flex;flex-direction: column;margin: 4px 2px;">
      <MonthlyRanking style="height: 280px;border-radius: 4px;overflow-y: auto;overflow-x: hidden"></MonthlyRanking>
      <WaterQuality style="height: 280px;border-radius: 4px;margin: 4px 0"></WaterQuality>
      <SummaryOfProblems style="height:400px;border-radius: 4px;overflow-y: auto;overflow-x: hidden"></SummaryOfProblems>
    </div>
  </div>
</template>

<script>
  import Weather from "./Weather";
  import Publish from "./Publish";
  import MonthlyRanking from "./MonthlyRanking";
  import WaterQuality from "./WaterQuality";
  import SummaryOfProblems from "./SummaryOfProblems";
  import RiverPatrolMap from "./RiverPatrolMap";

  export default {
    components: {Weather, Publish, MonthlyRanking, WaterQuality, SummaryOfProblems,RiverPatrolMap}
  }
</script>
