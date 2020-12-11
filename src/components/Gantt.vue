<template>
  <div class="gantt_container" ref="gantt_container" :style = "{background: background, color: color}">
    <div class="gantt_left gantt_layout_content gantt_inline_block" ref="gantt_left" >
      <div class="gantt_left_container">
        <div class="gantt_layout_header gantt_inline_block" :style="{height:unit_height*config.gantt.scales.length + 'px'}">
          <div :style="{height:unit_height + 'px', lineHeight: unit_height + 'px'}">
            <div :style="{height:unit_height*config.gantt.scales.length + 'px', lineHeight: unit_height*config.gantt.scales.length + 'px', width:col.width+ 'px'}" class="gantt_layout_th gantt_inline_block" v-for="(col,index) in config.cols">
              {{col.label}}
            </div>
          </div>
        </div>
        <div class="gantt_table_content" :style="{marginTop:unit_height*config.gantt.scales.length + 'px'}">
          <template v-for="(data, index) in datas">
            <div class="gantt_table_row gantt_data_row" :style="{height:unit_height + 'px', lineHeight: unit_height + 'px', color:content_color}" :row_index="JSON.stringify(index)" v-bind:class="{ gantt_table_row_hover: hover_index == index }">
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
            <div  :style="{height:unit_height + 'px', lineHeight: unit_height + 'px'}">
              <div class="gantt_content_th gantt_inline_block gantt_content_th_cell"  v-for="col in cols" :style="{width: config.gantt.scales[index].width + 'px'}">{{col.label}}</div>
            </div>
          </template>
        </div>
        <div class="gantt_right_table_container" :style="{marginTop:unit_height*config.gantt.scales.length + 'px'}">
          <div class="gantt_table_content"  :style="{marginTop:unit_height*config.gantt.scales.length + 'px'}">
            <template v-for="(data, index) in datas">
              <div class="gantt_table_row"  :style="{height:unit_height + 'px', lineHeight: unit_height + 'px'}" v-bind:class="{ gantt_table_row_hover: hover_index == index }"></div>
            </template>
          </div>
          <svg version="1.1" class="ganttSVGBoxX" >
            <template v-for="(disabled, index) in config.gantt.disabled">
              <svg :x="JSON.stringify(disabled.left)" y="0" :width="JSON.stringify(disabled.width)" height="100%" status="STATUS_ACTIVE" taskid="-1" >
                <linearGradient id="b">
                    <stop offset="0" stop-color="#ccc" stop-opacity="0.5" />
                </linearGradient>
                <rect x="0" y="0" width="100%" height="100%" class="taskLayout" fill="url(#b)" rx="0" ry="0"></rect>
              </svg>
            </template>
          </svg>
          <svg version="1.1" class="ganttSVGBox" >
            <template v-for="(data, index) in datas">
              <template v-for="time in timeDatas[data[config.mapping.mapping_field]]">
                <svg :x="JSON.stringify(time.left)" :mapping_value="data[config.mapping.mapping_field]"  
                  :y="JSON.stringify(index*30+1)" :width="JSON.stringify(time.width)" :height="unit_height-2" :key_value="time[config.mapping.key_field]"
                  class="taskBox deSVGdrag taskBoxSVG" status="STATUS_ACTIVE" taskid="-1" :style="{fill: box_background}">
                  <rect x="0" y="0" width="100%" height="100%" class="taskLayout" rx="2" ry="2"></rect>
                  <rect x="0" y="0" width="100%" height="3" :style="{fill:box_background}"></rect>
                  <text x="30%" y="24" class="taskLabelSVG" :style="{fill:box_color}" transform="translate(20,-5)">Gantt editor</text>
                </svg>
              </template>
            </template>
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
      background: "#fff",
      color: "#a6a6a6",
      box_background: "#2898b0",
      content_color:"#454545",
      box_color: "#fff",
      hover_index: 0,
      page_width: 0,
      isboxDown: 0,
      direction: 0,
      unit_height:30,
      boxElement: null,
      boxX: 0,
      boxY: 0,
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
          start: new Date("2020-12-10 08:00"),
          end: new Date("2020-12-11 00:00"),
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
              
          ],
          disabled : [
            {start:"00:00", end:"08:00"},
            {start:"22:00", end:"00:00"}
          ]
        }, 
        mapping: {
          key_field: "id",
          mapping_field : "vehicle_name",
          start_field: "begin_time",
          end_field: "end_time"
        },

      }, datas: [
        {vehicle_name: "张三", mobile: "13566477736"},
        {vehicle_name: "李四", mobile: "13566477736"},
        {vehicle_name: "王五", mobile: "13566477736"},
        {vehicle_name: "赵六", mobile: "13566477736"}
      ], timeDatas : {
        "张三" : [{id : 1, begin_time : new Date("2020-12-10 20:00"), end_time: new Date("2020-12-10 21:40")}
              , {id : 2, begin_time : new Date("2020-12-10 08:00"), end_time: new Date("2020-12-10 09:40")}],
        "李四" : [{id : 3, begin_time : new Date("2020-12-10 9:00"), end_time: new Date("2020-12-10 9:30")},
                {id: 4, begin_time : new Date("2020-12-10 9:30"), end_time: new Date("2020-12-10 10:30")}],
        "王五" : [{id: 5, begin_time : new Date("2020-12-10 8:10"), end_time: new Date("2020-12-10 8:40")}],
        "赵六" : [{id: 6, begin_time : new Date("2020-12-10 10:00"), end_time: new Date("2020-12-10 10:40")}],
      }
    }
  }, 
  mounted() {
    this.loadWidth();//分配宽度
    this.loadBackground();//背景色背景图片切换
    
    this.bindRowHover();//绑定鼠标悬浮事件
   
    this.loadTimeCell();//加载时间表头

    this.loadTime();//加载时间条

    this.loadDisabled();//加载禁用区域

    this.bindBoxMove();//加载时间条鼠标按下事件

    this.bindDocumentUp();//加载document鼠标放开事件
  },
  methods : {
    bindDocumentUp : function() {
      var self = this;
      document.body.onmouseup = function() {
        if(self.isboxDown) {
          var width = self.boxElement.width.baseVal.value;
          var x = self.boxElement.x.baseVal.value;
          var xx = x%self.config.gantt.unit_width;
          var xxx = parseInt(x/self.config.gantt.unit_width);
          var left = 0;
          if(xx > parseInt(self.config.gantt.unit_width/2)) {
            xxx++;
          } 
          //begin 同步时间
          var start = self.config.gantt.cols[self.config.gantt.cols.length - 1][xxx].start;
          var mapping_value = self.boxElement.getAttribute("mapping_value");
          var key_value = self.boxElement.getAttribute("key_value");
          self.timeDatas[mapping_value].forEach(time => {
            var timestart = time[self.config.mapping.start_field];
            time[self.config.mapping.end_field] = new Date(time[self.config.mapping.end_field].getTime() + (start.getTime()  - time[self.config.mapping.start_field].getTime()));
            time[self.config.mapping.start_field] = start;
          });
          //end
          left = xxx*self.config.gantt.unit_width;
          self.boxElement.x.baseVal.value = left;
        }
        self.isboxDown = 0;
      }
    },
    bindBoxMove : function() {
      var self = this;
      document.getElementsByClassName("ganttSVGBox").forEach(element => {
        element.onmousemove = function(e) {
          if (self.isboxDown) {
            self.ganttTimeMove(e);
          }
        }
      });
      document.getElementsByClassName("taskBox").forEach(element => {
        element.onmousedown = function(e) {
          self.isboxDown = 1;
          self.boxElement = element;
          self.boxX = e.layerX - element.x.baseVal.value;
          self.boxY = e.layerY - element.y.baseVal.value;
          self.direction = 0;
          var posx = e.pageX + self.$refs.gantt_right.scrollLeft - self.$refs.gantt_left.clientWidth - self.boxElement.x.baseVal.value;
          if (posx > 10) {
            self.direction = 1;
          }
        }

        element.onmousemove = function(e) {
          if (self.isboxDown) {
            self.ganttTimeMove(e);
            if(!self.boxElement.classList.contains("deSVGhand")) {
              var gantt_right = document.getElementsByClassName("gantt_right")[0];
              var scrollLeft = gantt_right.scrollLeft;
              var scrollTop = gantt_right.scrollTop;
              self.boxElement.x.baseVal.value = e.clientX - gantt_right.offsetLeft + scrollLeft - self.boxX;
              //self.boxElement.y.baseVal.value = e.clientY - gantt_right.offsetTop + scrollTop + self.boxY;
            }
          }

          var x1 = element.x.baseVal.value;
          var x2 = x1 + parseFloat(element.width.baseVal.value);
          var posx = e.pageX + self.$refs.gantt_right.scrollLeft - self.$refs.gantt_left.clientWidth;

          if (Math.abs(posx-x1)<=5 || Math.abs(posx-x2)<=5) {
            element.classList.add("deSVGhand");
          } else {
            element.classList.remove("deSVGhand");
          }
        } 
      });
      
    },
    ganttTimeMove: function(e) {
      var self = this;
      if(self.boxElement.classList.contains("deSVGhand")) {
        var posx1 = e.pageX - self.$refs.gantt_left.clientWidth + self.$refs.gantt_right.scrollLeft - self.boxElement.x.baseVal.value - self.boxElement.width.baseVal.value;
        var posx2 = e.pageX - self.$refs.gantt_left.clientWidth + self.$refs.gantt_right.scrollLeft - self.boxElement.x.baseVal.value;
        if(self.direction) {
          
          self.boxElement.width.baseVal.value = self.boxElement.width.baseVal.value + posx1;
        } else {
          
          self.boxElement.x.baseVal.value = self.boxElement.x.baseVal.value + posx2;
          self.boxElement.width.baseVal.value = self.boxElement.width.baseVal.value - posx2;
          
        }
      } 
    },
    loadDisabled: function() {
      var self = this;
      var disableds = self.config.gantt.disabled;
      var cols = self.config.cols;
      if (disableds) {
        disableds.forEach(disabled => {
          if(disabled.date) {

          } else if (disabled.week_day) {

          } else {
            var size = 0;
            var is = 0;
            var u = 0;
            var cols = self.config.gantt.cols[self.config.gantt.cols.length -1];
            for(var u = 0; u < cols.length; u++) {
              var col = cols[u];

              if(col == disabled.start) {
                is = 1;
                disabled.left = u*self.config.gantt.unit_width;
              } else if (col == disabled.end && is){
                break;
              } 

              if (is) {
                size++;
              }
            }
            size = size*self.config.gantt.unit_width;
            disabled.width = size;
          }
        });
      }
    },
    loadTime: function() {
      var startMinute = parseInt(this.config.gantt.start.getTime()/1000/60);
      var self = this;
      self.datas.forEach(data => {
        self.timeDatas[data[self.config.mapping.mapping_field]].forEach(time => {
          var start = parseInt(time[self.config.mapping.start_field].getTime()/1000/60);
          var end = parseInt(time[self.config.mapping.end_field].getTime()/1000/60);
          time.left = (start - startMinute)/5*self.config.gantt.unit_width;
          time.width = (end - start)/5*self.config.gantt.unit_width;
        });
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
              var date1 = new Date(startTime);
              var f = self.dateFormat(date1, format);
              startTime = startTime+step*1000*60;

              cols.push({label: f, start: date1, end: new Date(startTime)});
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
              var date1 = new Date(startTime);
              var f = self.dateFormat(date1, format);
              startTime = startTime+step*1000*60*60;
              cols.push({label: f, start: date1, end: new Date(startTime)});
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
    
    loadBackground: function() {
      if(this.background.indexOf(".") != -1) {
        debugger;
        this.background = 'url('+ require('../assets/'+this.background) + ') no-repeat';
      }
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
  border: 1px solid #e0e6ed;
  position: relative;
  white-space: nowrap;

  font-family: Arial;
  box-sizing: border-box;
}

.gantt_left{
  height:100%;
  //width:20%;
  overflow-x: auto;
  //border-bottom: 1px solid #e0e6ed;
  position: relative;
  
}

.gantt_left_container{
  width:100%;
  display: block;
  float:left;
}

.gantt_layout_th{
  border-right: 1px solid #e0e6ed;
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
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  float:left;
  width:100%;
  height:50px;
  line-height: 50px;
  border-right: 1px solid #e0e6ed;
  border-bottom: 1px solid #e0e6ed;
}

.gantt_content_th_contrainer{
    width:100%;
    float: left;
    border-bottom: 1px solid #e0e6ed;
}

.gantt_content_th_cell{
    float:left;
    border-right: 1px solid #e0e6ed;
    border-bottom: 1px solid #e0e6ed;
    box-sizing: border-box;
}
.gantt_table_content{
  width:100%;
}
.gantt_table_row{
  width:100%;
  display: block;
  border-bottom: 1px solid #e0e6ed;
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

.ganttSVGBoxX {
  position: absolute;
  width:100%;
  height:100%;
  top:0px;
  left:0px;
}

.taskBoxSVG {
  overflow: visible;
}
.deSVGdrag{
  cursor: move;
}

.taskBox{
  position: relative;
}

.deSVGhand {
    cursor: ew-resize;
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
      rgba(90, 88, 88, 0.8) 100%,
      transparent
  );
}

.gantt_right::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.3);
  //background   : #ededed;
  border-radius: 10px;
}
</style>
