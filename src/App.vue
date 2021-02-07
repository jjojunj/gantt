<template>
  <div id="app">
    <gantt :unit_width="unit_width" :columns="columns" :start="start" :end="end"
           :scales="scales" :template="template" :conflict="conflict" :start_field="start_field" :end_field="end_field"></gantt>
  </div>
</template>


<script>
import gantt from "./components/gantt";

export default {
  components: { gantt },
  name: "App",
  data() {
    return {
      unit_width: 30,
      columns : [
        {
          label: "司机",
          field: "vehicle_name",
          width: 120
        },
        {
          label: "手机号码",
          field: "mobile",
          width: 150
        }
      ],
      start: new Date("2020-12-10 08:00"),
      end: new Date("2020-12-11 00:00"),
      scales : [
        {unit: 'minute',step: 30,format: 'dd号HH点mm'},
        {unit: 'minute',step: 5},
      ],
      template : "name",
      conflict: "line-feed",
      start_field: "begin_time",
      end_field: "end_time"
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
