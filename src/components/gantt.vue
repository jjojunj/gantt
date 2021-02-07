<template>
<div style="width:100%;height: 100%;position: relative;">
  <div style="width:100%;height:30px;position: relative;" @click="testClick()">
  </div>
  <div class="gantt_container" ref="gantt_container" :style = "{background:background, color:color}">

    <div class="gantt_left gantt_layout_content gantt_inline_block" ref="gantt_left" >
      <div class="gantt_left_container">
        <div class="gantt_layout_header gantt_inline_block" :style="{height: unit_height*config.gantt.header_cols.length + 'px'}">
          <div :style="{height: unit_height + 'px', lineHeight:unit_height + 'px'}">
            <div :style="{height: unit_height*config.gantt.header_cols.length + 'px', lineHeight:unit_height*config.gantt.header_cols.length + 'px', width:col.width+ 'px'}" class="gantt_layout_th gantt_inline_block" v-for="(col,index) in columns" :key="index">
              {{col.label}}
            </div>
          </div>
        </div>
        <div class="gantt_table_content" :style="{marginTop: unit_height*config.gantt.header_cols.length + 'px'}">
          <template v-for="(data, index) in datas">
            <div class="gantt_table_row gantt_data_row" @click="bindRowHover(index)" :key="index" :style="{height:data.y + 'px', lineHeight: data.y + 'px', color:content_color}" :row_index="JSON.stringify(index)" v-bind:class="{ gantt_table_row_hover: hover_index == index }">
              <div class="gantt_table_cell"  v-for="(col,cindex) in columns" :key="cindex" :style="{width:col.width + 'px'}" >{{data[col.field]}}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="gantt_right gantt_layout_content gantt_inline_block" ref="gantt_right">
      <div class="gantt_inline_block">
        <div class="gantt_content_th_contrainer gantt_inline_block" :style="{width : config.gantt.max_count.unit_width+'px', height: config.gantt.header_cols.length.unit_height+'px'}">
          <template v-for="(cols, index) in config.gantt.header_cols">
            <div :key="index" :style="{height: unit_height + 'px', lineHeight:unit_height + 'px'}">
              <div class="gantt_content_th gantt_inline_block gantt_content_th_cell"  v-for="(col, cindex) in cols" :key="cindex" :style="{width: scales[index].width + 'px'}">{{col.label}}</div>
            </div>
          </template>
        </div>
        <div class="gantt_right_table_container" :style="{marginTop: unit_height*config.gantt.header_cols.length + 'px'}">
          <div class="gantt_table_content"  :style="{marginTop: unit_height*config.gantt.header_cols.length + 'px'}">
            <template v-for="(data, index) in datas">
              <div class="gantt_table_row" :key="index"  :style="{height:data.y + 'px', lineHeight: data.y + 'px'}" v-bind:class="{ gantt_table_row_hover: hover_index == index }">
                <div class="gantt_content_th gantt_inline_block gantt_content_row_cell" v-for="(col, cindex) in config.gantt.cols[config.gantt.cols.length - 1]" :key="cindex" :style="{width: scales[scales.length - 1].width + 'px'}"></div>
              </div>
            </template>
          </div>
          <svg version="1.1" class="ganttSVGBoxX" >
            <template v-for="(disabled, index) in config.gantt.disabled">
              {{typeof(index)}}
              <svg :x="JSON.stringify(disabled.left)" y="0" :key="index" :width="JSON.stringify(disabled.width)" height="100%" status="STATUS_ACTIVE" taskid="-1" >
                <linearGradient id="b">
                    <stop offset="0" stop-color="#ccc" stop-opacity="0.5" />
                </linearGradient>
                <rect x="0" y="0" width="100%" height="100%" class="taskLayout" fill="url(#b)" rx="0" ry="0"></rect>
              </svg>
            </template>
          </svg>

          <svg version="1.1" class="ganttSVGBox" @mousemove="ganttSVGBoxMove($event)">
            <template v-for="(data, dindex) in datas">
                <svg v-for="(time, index) in data[mapping_field]" :index="JSON.stringify(index)" :dindex="JSON.stringify(dindex)" :key="time[key_field]" :key_value="data[primary]" :mapping_value="time[key_field]"
                  :x="JSON.stringify(time.x)" @mousedown="taskBoxDown($event)" @mousemove="taskBoxMove($event)"
                  :y="JSON.stringify(time.y)" :width="JSON.stringify(time.width)" :height="unit_height-2"
                  class="taskBox deSVGdrag taskBoxSVG" status="STATUS_ACTIVE" taskid="-1" :style="{fill:box_background}"
                  :name="'svg' + time[key_field]">
                  <rect x="0" y="0" width="100%" height="100%" class="taskLayout svg" rx="2" ry="2"></rect>
                  <rect x="0" y="0" width="100%" height="3" :style="{fill:box_background}"></rect>
                  <text x="45%" :y="unit_height/2" class="taskLabelSVG" text-anchor="middle" :style="{fill:box_color}" transform="translate(20,-5)">{{time[template]}} + {{time.x}} + {{time.y}}</text>
                  <text x="45%" :y="unit_height/2+17" class="taskLabelSVG" text-anchor="middle" :style="{fill:box_color}" transform="translate(20,-5)">{{dateFormat(time[start_field], 'HH:mm') + '-' + dateFormat(time[end_field], 'HH:mm')}}</text>
                </svg>
            </template>
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {findDock} from '../api/api'
export default {
  name: 'gantt',
  data() {
    return {
      hover_index: 0,
      page_width: 0,
      is_box_down: 0,
      direction: 0,
      boxElement: null,
      boxX: 0,
      boxY: 0,
      select: {},
      datas: [],
      config: {
        gantt: {
          min_time: 99999,
          max_count: 0,
          cols : [],
          header_cols:[],
          disabled : [
            {start:"00:00", end:"08:00"},
            {start:"22:00", end:"00:00"}
          ]
        }
      }
    }
  },
  props: {
    conflict : {
      default: () => {
        return "none";
      }
    },
    background : {
      default: () => {
        return "#fff";
      }
    },
    color : {
      default: () => {
        return "#a6a6a6";
      }
    },
    box_background : {
      default: () => {
        return "#2898b0";
      }
    },
    content_color : {
      default: () => {
        return "#454545";
      }
    },
    box_color : {
      default: () => {
        return "#fff";
      }
    },
    height : {
      default: () => {
        return 500;
      }
    },
    unit_height : {
      default: () => {
        return 35;
      }
    },
    unit_width : {
      default: () => {
        return 50;
      }
    },
    columns : {
      default: () => {
        return [];
      }
    },
    tip_format : {
      default: () => {
        return "YYYY-MM-dd HH:mm:SS";
      }
    },
    start : {
      default: () => {
        return new Date();
      }
    },
    end : {
      default: () => {
        return new Date();
      }
    },
    scales : {
      default: () => {
        return [];
      }
    },
    template : {
      default: () => {
        return "";
      }
    },
    mapping_field : {
      default: () => {
        return "times";
      }
    },
    key_field : {
      default: () => {
        return "id";
      }
    },
    primary: {
      default:()=>{
        return "id";
      }
    },
    start_field:{},
    end_field:{},
    edit:{
      default: () => {
        return true;
      }
    }
  },
  mounted() {
    var self = this;
    // self.loadWidth();//分配宽度
    // self.loadBackground();//背景色背景图片切换
    //
    //
    // self.loadTimeCell();//加载时间表头
    //
    // self.loadTime();//加载时间条
    //
    // self.loadDisabled();//加载禁用区域
    // self.bindDocumentUp();//鼠标放开事件绑定
    findDock(res => {
      if (res.data.success) {
        res.data.data.forEach(function(row) {
          row[self.mapping_field].forEach(function(time){
            time[self.start_field] = new Date(time[self.start_field]);
            time[self.end_field] = new Date(time[self.end_field]);
          });

        });

        self.datas = res.data.data;
        /*self.datas = [];
        self.datas = res.body.data;*/
        self.loadWidth();//分配宽度
        self.loadBackground();//背景色背景图片切换


        self.loadTimeCell();//加载时间表头

        self.loadTime();//加载时间条

        self.loadDisabled();//加载禁用区域
        self.bindDocumentUp();//鼠标放开事件绑定

      } else {

      }
    });

  },
  updated() {
  },
  methods : {
    testClick : function(){
      console.log(this.datas);
    },
    bindDocumentUp : function() {
      var self = this;
      document.body.onmouseup = function() {
        if(self.is_box_down) {
          //begin 同步时间
          self.syncTime();
          //end
        }
        self.is_box_down = 0;
      }
    },
    syncTime : function() {
      var self = this;
      var width = self.boxElement.width.baseVal.value;
      var x = self.boxElement.x.baseVal.value;
      var xxx = parseInt(x/self.unit_width);

      var s_width = Math.round(width/self.unit_width);
      var w_width = width/self.unit_width;
      var endnum = w_width + xxx - 1;
      if(s_width != w_width) {
        self.boxElement.width.baseVal.value = s_width*self.unit_width - 1;
        endnum = s_width + xxx - 1;
      }
      var end = self.config.gantt.cols[self.config.gantt.cols.length - 1][endnum].end;

      var start = self.config.gantt.cols[self.config.gantt.cols.length - 1][xxx].start;
      var key_value = self.boxElement.getAttribute("key_value");
      var mapping_value = self.boxElement.getAttribute("mapping_value");
      var dindex = self.boxElement.getAttribute("dindex");
      var self_times = self.datas[dindex][self.mapping_field];
      if (self.conflict === 'line-feed') {
        for(var i = 0; i < self_times.length; i++) {
          var time = self_times[i];
          if(mapping_value == time[self.key_field]) {
            time[self.end_field] = end;
            time[self.start_field] = start;
            break;
          }
        }
      } else {
        self_times.sort(function(a,b){
          return a[self.start_field] < b[self.start_field] ? -1 : 1;
        });

        for(var i = 0; i < self_times.length; i++) {
          var time = self_times[i];
          if(key_value == time[self.key_field]) {
            time[self.end_field] = end;
            time[self.start_field] = start;
            break;
          }
        }
      }

      var box_y = self.boxElement.y.baseVal.value;

      var sum_y = 0;
      var is_move = 1;
      for (var index in self.datas) {
        var data = self.datas[index];
        sum_y += data.y;
        var cy = box_y + self.unit_height - sum_y;
        if (cy >= self.unit_height/2 && cy < self.unit_height) {//下移一格
          var key = self.datas[parseInt(index)+1][self.primary];
          if (key == key_value) {
            break;
          }
          is_move = 0;
          self.conflict_mode(self,parseInt(index) + 1, key_value, mapping_value);
          break;
        } else if ((cy <= self.unit_height/2 && cy >= 0) || (box_y + self.unit_height <= sum_y)) {//上移一格
          var key = self.datas[parseInt(index)][self.primary];
          if (key == key_value) {
            break;
          }
          is_move = 0;
          self.conflict_mode(self, parseInt(index), key_value, mapping_value);
          break;
        }
      }

      if (is_move) {
        var dindex = self.boxElement.getAttribute("dindex");
        self.conflict_mode(self, dindex, key_value, mapping_value);
      }
    },
    getDatas: function(key_value) {
      var results = null;
      for (var i = 0; i < this.datas.length; i++) {
        var key = this.datas[i][this.primary];
        if (key == key_value) {
          results = this.datas[i][this.mapping_field];
          break;
        }
      }
      return results;
    },
    getData: function(key_value, mapping_value){
      var results = this.getDatas(key_value);
      var result = null;
      for (var i = 0; i < results.length; i++) {
        if (mapping_value == results[i][this.key_field]) {
          result = results[i];
          break;
        }
      }
      return result;
    },
    conflict_mode: function(self, dindex, key, mapping_value) {
      if (self.conflict == 'line-feed' || self.conflict == 'auto') {
        var index = self.boxElement.getAttribute("index");
        var times = self.datas[dindex][self.mapping_field];
        var self_times = self.getDatas(key);
        var select_time = self.getData(key, mapping_value);
        var start = select_time[self.start_field].getTime();
        var end = select_time[self.end_field].getTime();
        var isc = 0;
        var timea;
        var select_key = select_time[self.key_field];
        for(var i = 0; i < times.length; i++) {
          var time = times[i];
          var key2 = time[self.key_field];
          if (select_key == key2) {
            continue;
          }
          var time_start = time[self.start_field].getTime();
          var time_end = time[self.end_field].getTime();
          var is_1 = start >= time_start && start < time_end;//选中开始时间大于time_start  小于time_end
          var is_2 = end > time_start && end <= time_end;
          var is_3 = start < time_start && end > time_end && end > time_start;
          var is_4 = start > time_start && end < time_end;

          if (is_1 || is_2 || is_3 || is_4) {
            isc = 1;
            timea = time;
            break;
          }
        }
        if (isc) {
          if(self.conflict == 'line-feed') {
            self.$confirm(self.dateFormat(timea[self.start_field], self.tip_format) + '至' + self.dateFormat(timea[self.end_field], self.tip_format) + '已被预约', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false
            }).then(() => {
              var times = self.datas[dindex][self.mapping_field];
              var self_times = self.getDatas(key);
              var select_time = self.getData(key, mapping_value);
              times.push(select_time);
              self_times.splice(index, 1);
              self.loadTime();
            }).catch(() => {
              var self_times = self.getDatas(key);
              self_times[index] = self.select;
              self.loadTime();
            });
          } else if (self.conflict != 'back') {

          }
        } else {
          if(key != self.datas[dindex][self.primary]) {
            times.push(select_time);
            self_times.splice(index, 1);
          }
          self.loadTime();

        }
      } else {
        var times = self.datas[dindex][self.mapping_field];
        var self_times = self.getDatas(key);
        var select_time = self.getData(key, mapping_value);
        times.push(select_time);
        self_times.splice(index, 1);
        self.loadTime();
      }
    },
    loadTime: function() {
      var startMinute = parseInt(new Date(this.start).getTime()/1000/60);
      var self = this;
      var i = 1;
      var y = 0;
      Array.from(self.datas).forEach(data => {
        var times = data[self.mapping_field];
        if (times.length == 0) {
          y += data.y;
          return;
        }
        times.sort(function(a,b){
          return a[self.start_field] < b[self.start_field] ? -1 : 1;
        });
        var timea = 0;

        var step = self.scales[self.scales.length - 1].step;
        Array.from(times).forEach(time => {
          time.left = 0;
          time.width = 0;
          time.y = 0;

          var start = parseInt(time[self.start_field].getTime()/1000/60);
          var end = parseInt(time[self.end_field].getTime()/1000/60);
          time.x = (start - startMinute)/step*self.unit_width+1;
          time.width = (end - start)/step*self.unit_width -1;
          if (timea) {
            if (timea > start) {
              data.y += self.unit_height;
              self.$set(data,'y',data.y);

              time.y = y;
              y += self.unit_height;
            } else {
              time.y = y - self.unit_height;
            }
          } else {
            self.$set(data,'y',self.unit_height);

            time.y = y;
            y += data.y;
          }
          timea = end;
        });
        i++;
      });

    },
    ganttSVGBoxMove : function(e){
      var self = this;
      if(self.edit) {
        self.ganttmove(e);
      }
    },
    taskBoxDown : function(e) {
      console.info(123);
      var self = this;
      if(self.edit) {
        var element = e.currentTarget;
        self.is_box_down = 1;
        self.boxElement = element;
        var key = element.getAttribute("key_value");
        var mapping_value = element.getAttribute("mapping_value");
        self.select = self.clone(self.getData(key, mapping_value));

        self.boxX = e.layerX - element.x.baseVal.value;
        self.boxY = e.offsetY - element.y.baseVal.value;
        self.direction = 0;
        var posx = e.offsetX - self.boxElement.x.baseVal.value;
        if (posx > self.unit_width - 15) {
          self.direction = 1;
        }
      }

    },
    taskBoxMove : function(e){
      if(this.edit) {
        this.ganttmove(e);
        this.boxMoveStyle(e);
      }
    },
    boxMoveStyle: function(e) {
      var element = e.currentTarget;
      if (element) {
        var x1 = element.x.baseVal.value;
        var x2 = x1 + parseFloat(element.width.baseVal.value);
        var posx = e.offsetX;

        if (Math.abs(posx - x1) <= 15 || Math.abs(posx - x2) <= 15) {
          element.classList.add("deSVGhand");
        } else {
          element.classList.remove("deSVGhand");
        }
      }
    },
    ganttmove : function(e) {

      var element = this.boxElement;
      var self = this;
      var menu = document.getElementsByClassName("moder_menu")[0];
      var menuWidth = 0;
      if (menu) {
        menuWidth = menu.clientWidth;
      }
      if (self.is_box_down) {
        self.ganttTimeMove(e);
        if(!self.boxElement.classList.contains("deSVGhand")) {
          var gantt_right = document.getElementsByClassName("gantt_right")[0];
          var scrollLeft = gantt_right.scrollLeft;
          var scrollTop = gantt_right.scrollTop;

          if (e.offsetX - self.boxX <= 0 && self.boxElement.x.baseVal.value <= 0) {
            return;
          }
          self.boxElement.x.baseVal.value = e.clientX - gantt_right.offsetLeft + scrollLeft - self.boxX - menuWidth;
          var svg_index = self.boxElement.getAttribute("index");

          var dx = e.clientX - gantt_right.offsetLeft + scrollLeft - self.boxX;
          var dindex = self.boxElement.getAttribute("dindex");
          var timeDatas = self.datas[dindex][self.mapping_field];
          self.datas[dindex][self.mapping_field] = [];
          var data = timeDatas[svg_index];
          var dy = e.offsetY - gantt_right.offsetTop + scrollTop - self.boxY;
          self.boxElement.y.baseVal.value = dy;
          data.y = dy;
          data.x = dx;
          self.datas[dindex][self.mapping_field] = timeDatas;

        }
      }

    },
    ganttTimeMove: function(e) {
      var self = this;
      if(self.boxElement.classList.contains("deSVGhand")) {
        var posx1 = e.offsetX - self.boxElement.x.baseVal.value - self.boxElement.width.baseVal.value;
        var posx2 = e.offsetX - self.boxElement.x.baseVal.value;
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
      if (disableds) {
        Array.from(disableds).forEach(disabled => {
          if(disabled.date) {

          } else if (disabled.week_day) {

          } else {
            var size = 0;
            var is = 0;
            var cols = self.config.gantt.cols[self.config.gantt.cols.length -1];
            for(var u = 0; u < cols.length; u++) {
              var col = cols[u];

              if(col.label == disabled.start) {
                is = 1;
                disabled.left = u*self.unit_width;
              } else if (col.label == disabled.end && is){
                break;
              }

              if (is) {
                size++;
              }
            }
            size = size*self.unit_width;
            disabled.width = size;
          }
        });
      }
    },

    bindRowHover: function(index) {
      var self = this;
      self.hover_index = index;
    },

    loadWidth : function() {
      var self = this;
      self.page_width = self.$refs.gantt_container.clientWidth;
      var left_width = 0;
      var cols = self.columns;
      for(var i = 0; i < cols.length; i++) {
        var col = cols[i];
        left_width += col.width;
      }

      self.$refs.gantt_left.style.width = left_width + "px";
      self.$refs.gantt_right.style.width = self.page_width - left_width - 4 + "px";
      self.$refs.gantt_right.style.marginLeft = "-4px";
      self.$refs.gantt_container.style.background = self.background;
    },
    loadTimeCell : function() {
      var self = this;
      var times = new Date(self.end).getTime() - new Date(self.start).getTime();
      var minute = times/1000/60;

      for (var j = 0; j < self.scales.length; j++) {
        var scale = self.scales[j];

        var cols = [];
        var header_cols = [];
        var unit = scale.unit;
        var step = scale.step;
        var format = scale.format;
        var startTime = new Date(self.start).getTime();
        if (unit == "minute") {
          debugger;
            var count = parseInt(minute/step);
            if(count > self.config.gantt.max_count) {
              self.config.gantt.max_count = count;
            }
            for(var i = 0; i < count; i++) {
              var date1 = new Date(startTime);
              startTime = startTime+step*1000*60;
              var f = "";
              if(format) {
                f = self.dateFormat(date1, format);
                header_cols.push({label: f, start: date1, end: new Date(startTime)});
              }
              cols.push({label: f, start: date1, end: new Date(startTime)});
            }

            scale.width = self.unit_width;
            if (j < self.scales.length - 1) {
              scale.width = self.unit_width * scale.step/self.scales[self.scales.length - 1].step;
            }
            scale.minute = step;

        } else if (unit == "hour") {
            var count = parseInt(minute/(step*60));
            if(count > self.config.gantt.max_count) {
              self.config.gantt.max_count = count;
            }
            for(var i = 0; i < count; i++) {
              var date1 = new Date(startTime);
              var f = self.dateFormat(date1, format);
              startTime = startTime+step*1000*60*60;
              cols.push({label: f, start: date1, end: new Date(startTime)});
              header_cols.push({label: f, start: date1, end: new Date(startTime)});
            }

            scale.width = step*60/5*self.unit_width;
            scale.minute = step*60/5;
        }
        if(self.config.gantt.min_time > scale.minute) {
            self.config.gantt.min_time = scale.minute;
        }
        self.config.gantt.cols.push(cols);
        if (header_cols.length > 0) {
          self.config.gantt.header_cols.push(header_cols);
        }
      }
    },

    loadBackground: function() {
      if(this.background.indexOf(".") != -1) {
        this.background = 'url('+ require('../assets/'+this.background) + ') no-repeat';
      }
    },
    dateFormat : function (date, fmt) {
      let ret;
      const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "M+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "m+": date.getMinutes().toString(),         // 分
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
    },
    clone : function(obj, parent = null) {
      var self = this;
      //parent用于递归循环引用爆栈处理
      // 创建一个新对象
      let result = new obj.constructor() //保持继承链
      let keys = Object.keys(obj),
        key = null,
        temp = null,
        _parent = parent
      // 该字段若有父级则需要追溯该字段的父级
      while (_parent) {
        // 如果该字段引用了它的父级则为循环引用
        if (_parent.originalParent === obj) {
          return _parent.currentParent // 循环引用直接返回同级的新对象
        }
        _parent = _parent.parent
      }
      for (let i = 0; i < keys.length; i++) {
        key = keys[i]
        temp = obj[key]
        if (temp && self.isType(temp) === 'date') {
          result[key] = new Date(temp)
          continue
        }
        if (temp && self.isType(temp) === 'regExp') {
          result[key] = new RegExp(temp)
          continue
        }
        // 若字段的值是一个对象/数组
        if (temp && (self.isType(temp) === 'object' || self.isType(temp) === 'array')) {
          // 递归执行深拷贝 将同级的待拷贝对象与新对象传递给 parent 方便追溯循环引用
          result[key] = self.clone(temp, {
            originalParent: obj,
            currentParent: result,
            parent: parent
          })
        } else {
          result[key] = temp
        }
      }
      return result
    },
    isType : function(obj, type) {
      // tostring会返回对应不同的标签的构造函数
      const toString = Object.prototype.toString
      const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      }
      if (obj instanceof HTMLElement) {
        return type ? type === 'element' : 'element'
      }
      return type ? type === map[toString.call(obj)] : map[toString.call(obj)]
    },
    getUrl : function(url) {
      if (process.env.NODE_ENV === 'development') {
        return url;
      } else {
        return url;
      }
    }
  }

}
</script>

<style>
  html,body{height:100%;width:100%;padding:0px;margin:0px;}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
*{padding:0px;margin:0px;box-sizing: border-box;}
.gantt_container{
  top:30px;
  bottom: 0px;
  width:100%;
  font-size: 13px;
  border: 1px solid #e0e6ed;
  position: absolute;
  white-space: nowrap;
  text-align: center;
  font-family: Arial;
  box-sizing: border-box;
}

.gantt_left{
  height:100%;
  overflow-x: auto;
  position: relative;

}

.gantt_left_container{
  width:100%;
  display: block;
  float:left;
}

.gantt_layout_th{
  border-right: 1px solid #e0e6ed;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
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
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

.gantt_content_th_contrainer{
    width:100%;
    float: left;
    overflow-y: hidden;
    border-bottom: 1px solid #e0e6ed;
}

.gantt_content_th_cell{
    //float:left;
    border-bottom: 1px solid #e0e6ed;
    border-right: 1px solid #e0e6ed;
    box-sizing: border-box;
    position: relative;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}

.gantt_content_row_cell{
    float:left;
    border-left: 1px solid #e0e6ed;
    box-sizing: border-box;
    position: relative;
    height: 100%;
}

.gantt_content_th_cell_m:before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 49%;
    width: 10px;
    height: 10px;
    border: 3px solid #ccc;
    border-radius: 8px;
    background: #ccc;
}

.gantt_content_th_cell_m2:before {
    content: '';
    position: absolute;
    top: -5px;
    left:-5.3%;
    width: 3px;
    height: 3px;
    border: 3px solid #ccc;
    border-radius: 8px;
    background: #fff;
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
      #ccc,
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
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.taskLabelSVG{
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
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
  background-color: rgb(18, 116, 155);
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(90, 88, 88, 0.8) 100%,
      transparent
  );
}

.gantt_right::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
</style>
