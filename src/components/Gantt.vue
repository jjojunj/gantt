<template>
  <div class="gantt_container" ref="gantt_container" :style = "{background: background + ' no-repeat', color: color}">
    <div class="gantt_left gantt_layout_content gantt_inline_block" ref="gantt_left" >
      <div class="gantt_left_container">
        <div class="gantt_layout_header gantt_inline_block" style="height:50px;">
          <div>
            <div class="gantt_layout_th gantt_inline_block" v-for="(col,index) in config.cols" :style="{width:col.width+ 'px'}">
              {{col.label}}
            </div>
          </div>
        </div>
        <div class="gantt_table_content" style="margin-top:50px;">
          <template v-for="(data, index) in datas">
            <div class="gantt_table_row gantt_data_row" :row_index="JSON.stringify(index)" v-bind:class="{ gantt_table_row_hover: hover_index == index }">
              <div class="gantt_table_cell"  v-for="(col,index) in config.cols" :style="{width:col.width + 'px'}" >{{data[col.field]}}</div>
              
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="gantt_right gantt_layout_content gantt_inline_block" ref="gantt_right">
      <div class="gantt_inline_block">
        <div class="gantt_content_th_contrainer gantt_inline_block" :style="{width : config.gantt.max_count*config.gantt.unit_width+'px'}">
          
          <template v-for="(cols, index) in config.gantt.cols">
            <div style="height:25px;">
              <div class="gantt_content_th gantt_inline_block gantt_content_th_cell"  v-for="col in cols" :style="{width: config.gantt.scales[index].width + 'px'}">{{col}}</div>
            </div>
          </template>
          <!-- <div style="height:25px;">
            <div class="gantt_content_th gantt_inline_block gantt_content_th_cell" style="width:500px;">上午</div>
            <div class="gantt_content_th gantt_inline_block gantt_content_th_cell" style="width:500px;">下午</div>
            <div class="gantt_content_th gantt_inline_block gantt_content_th_cell" style="width:500px;">晚上</div>
            <div class="gantt_content_th gantt_inline_block gantt_content_th_cell" style="width:500px;">晚上</div>
          </div>
          <div style="height:25px;">
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">8:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">9:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">10:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">11:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">12:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">13:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">14:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">15:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">16:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">17:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">18:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">19:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">20:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">21:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">22:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">18:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">19:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">20:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">21:00</div>
            <div class="gantt_inline_block gantt_content_th_cell" style="width:100px;">22:00</div>
          </div> -->
        </div>
        <div class="gantt_right_table_container" style="margin-top:50px;">
          <div class="gantt_table_content" style="margin-top:50px;">
            <template v-for="(data, index) in datas">
              <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == index }"></div>
            </template>
            <!-- <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 0 }"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 1 }" style="height:60px;line-height:60px;"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 2 }"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 3 }"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 4 }"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 5 }"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 6 }"></div>
            <div class="gantt_table_row" v-bind:class="{ gantt_table_row_hover: hover_index == 7 }"></div> -->
          </div>
          <svg version="1.1" class="ganttSVGBox" >
            <template v-for="(data, index) in timeDatas">
              <svg :x="JSON.stringify(data.left)" :y="JSON.stringify(index*30+5)" :width="JSON.stringify(data.width)" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}">
                <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
                <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
                <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
              </svg>
            </template>
            <!-- <svg x="200" y="5" width="199" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}">
              <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
              <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
              <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
            </svg> -->
            <!-- <svg x="500" y="5" width="199" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}">
              <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
              <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
              <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
            </svg>

            <svg x="300" y="35" width="199" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}"">
              <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
              <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
              <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
            </svg>

            <svg x="400" y="65" width="199" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}"">
              <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
              <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
              <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
            </svg>
            
            <svg x="700" y="95" width="199" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}"">
              <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
              <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
              <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
            </svg>
            <svg x="00" y="125" width="199" height="20" class="taskBox" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}"">
              <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
              <rect x="0" y="0" width="100%" height="3" :style="{fill:color}"></rect>
              <text x="100%" y="18" class="taskLabelSVG" :style="{fill:color}" transform="translate(20,-5)">Gantt editor</text>
            </svg> -->
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gantt',
  data() {
    return {
      background: "url("+ require("../assets/bj3.png") + ")",
      color: "#ccc",
      box_background: "rgb(251 124 54)",
      box_color: "#fff",
      hover_index: 0,
      page_width: 0,
      isboxDown: 0,
      config: {
        cols: [
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
        gantt: {
          min_time: 99999,
          max_count: 0,
          cols : [],
          start: new Date("2020-12-10 8:00"),
          end: new Date("2020-12-10 22:00"),
          unit_width: 50,
          cell_height: 50,
          temple : "",
          scales : [
              { 
                  unit: "hour",
                  step: 1,
                  width:0
              },
              { 
                  unit: "minute",
                  step: 5,
                  width:0
              },
              
          ]
        }, 
        mapping: {
          key_field: "vehicle_name",
          start_field: "begin_time",
          end_field: "end_time"
        },

      }, datas: [
        {vehicle_name: "张三", mobile: "13566477736"},
        {vehicle_name: "李四", mobile: "13566477736"},
        {vehicle_name: "王五", mobile: "13566477736"},
        {vehicle_name: "赵六", mobile: "13566477736"}
      ],
      timeDatas : [
        {vehicle_name: "张三", begin_time : new Date("2020-12-10 8:00"), end_time: new Date("2020-12-10 8:40")},
        {vehicle_name: "李四", begin_time : new Date("2020-12-10 9:00"), end_time: new Date("2020-12-10 9:30")},
        {vehicle_name: "王五", begin_time : new Date("2020-12-10 8:10"), end_time: new Date("2020-12-10 8:40")},
        {vehicle_name: "赵六", begin_time : new Date("2020-12-10 10:00"), end_time: new Date("2020-12-10 10:40")}
      ]
    }
  }, 
  mounted() {
    this.loadWidth();//分配宽度
    
    this.bindRowHover();//绑定鼠标悬浮事件
   
    this.loadTimeCell();//加载时间表头

    this.loadTime();
  },
  methods : {
    loadTime: function() {
      var startMinute = parseInt(this.config.gantt.start.getTime()/1000/60);
      debugger;
      var self = this;
      self.timeDatas.forEach(time => {
        var start = parseInt(time[self.config.mapping.start_field].getTime()/1000/60);
        var end = parseInt(time[self.config.mapping.end_field].getTime()/1000/60);
        time.left = (start - startMinute)/5*self.config.gantt.unit_width;
        time.width = (end - start)/5*self.config.gantt.unit_width;
        debugger;
      });
    },
    bindRowHover: function() {
      var self = this;
      document.getElementsByClassName("gantt_table_row").forEach(element => {
        element.onmousemove = function() {
          self.hover_index = element.getAttribute("row_index");
        }
      });
    },
    loadWidth : function() {
      var self = this;
      self.page_width = document.body.clientWidth;
      var left_width = 0;
      self.config.cols.forEach(col => {
        left_width += col.width;
      });
      self.$refs.gantt_left.style.width = left_width + "px";
      self.$refs.gantt_right.style.width = self.page_width - left_width - 2 + "px";
      self.$refs.gantt_container.style.background = self.background;
    },
    loadTimeCell : function() {
      var self = this;
      var times = self.config.gantt.end.getTime() - self.config.gantt.start.getTime();
      var minute = times/1000/60;

      self.config.gantt.scales.forEach(scale => {
        var cols = [];
        var unit = scale.unit;
        var step = scale.step;
        var format = scale.format;
        var startTime = self.config.gantt.start.getTime();
        if (unit == "minute") {
            format = format?format:"HH:MM";
            var count = parseInt(minute/step);
            if(count > self.config.gantt.max_count) {
              self.config.gantt.max_count = count;
            }
            for(var i = 0; i < count; i++) {
              var f = self.dateFormat(new Date(startTime), format);
              cols.push(f);
              startTime = startTime+step*1000*60;
            }
            scale.width = self.config.gantt.unit_width;
            scale.minute = step;
            
        } else if (unit == "hour") {
          format = format?format:"dd号HH点";
            var count = parseInt(minute/(step*60));
            if(count > self.config.gantt.max_count) {
              self.config.gantt.max_count = count;
            }
            for(var i = 0; i < count; i++) {
              var f = self.dateFormat(new Date(startTime), format);
              cols.push(f);
              startTime = startTime+step*1000*60*60;
            }

            scale.width = step*60/5*self.config.gantt.unit_width;
            scale.minute = step*60/5;
        }
        if(self.config.gantt.min_time > scale.minute) {
            self.config.gantt.min_time = scale.minute;
        }
        self.config.gantt.cols.push(cols);

      });
    },
    dateFormat : function (date, fmt) {
      let ret;
      const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
      };
      return fmt;
    }
  }
  
}
</script>

<style>
  html,body{height:100%;width:100%;padding:0px;margin:0px;}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
*{padding:0px;margin:0px;box-sizing: border-box;}
.gantt_container{
  height:100%;
  width:100%;
  font-size: 13px;
  border: 1px solid #cecece;
  position: relative;
  white-space: nowrap;

  font-family: Arial;
  box-sizing: border-box;
}

.gantt_left{
  height:100%;
  //width:20%;
  overflow-x: auto;
  //border-bottom: 1px solid #cecece;
  position: relative;
  
}

.gantt_left_container{
  width:100%;
  display: block;
  float:left;
}

.gantt_layout_th{
  border-right: 1px solid #cecece;
  //float:left;
}

.gantt_right{
  height:100%;
  width:80%;
  position: relative;
  overflow-x: auto;
}

.gantt_inline_block{
  display: inline-block;
}

.gantt_layout_x {
    white-space: nowrap;
}

.gantt_layout_content {
     text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.gantt_layout_header{
  float:left;
  width:100%;
  height:50px;
  line-height: 50px;
  border-right: 1px solid #cecece;
  border-bottom: 1px solid #cecece;
}

.gantt_content_th_contrainer{
    height: 50px;
    width:100%;
    float: left;
    border-bottom: 1px solid #cecece;
}

.gantt_content_th_cell{
    float:left;
    border-right: 1px solid #cecece;
    border-bottom: 1px solid #cecece;
    height:25px;
    line-height: 25px;
}
.gantt_table_content{
  width:100%;
}
.gantt_table_row{
  height:30px;
  line-height: 30px;
  width:100%;
  display: block;
  border-bottom: 1px solid #cecece;
}

.gantt_table_row_hover{
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 100%,
      transparent
  );
}

.gantt_table_cell{
  float: left;
  height:100%;
}

.gantt_right_table_container{
  position: relative;
  
}
.ganttSVGBox{
  //background: #a6a6a6;
  position: absolute;
  width:100%;
  height:100%;
  top:0px;
  left:0px;
}
.taskBox{
  overflow: visible;
  cursor: move;
  
}
.taskLabelSVG{
  stroke: none;
  font-size: 12px;
}
.gantt_right::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.gantt_right::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  //background-color: rgb(18, 116, 155);
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 100%,
      transparent
  );
}

.gantt_right::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  //background   : #ededed;
  border-radius: 10px;
}
</style>
