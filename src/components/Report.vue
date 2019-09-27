<template>
    <div class="standard-report">

    <div>

      <div>

        <div style="text-align: center; margin: 40px 0 20px; border-bottom: 3px solid #1ea0fa; padding-bottom: 20px; position: relative">
          <div>
            <h2>{{title}}</h2>
          </div>

          <el-button type="primary" @click="exportWord" style="position: absolute; right: 0; top: 0;" plain>导出Word</el-button>

        </div>

        <div style="margin-bottom: 20px;">

          <el-tag style="margin-bottom: 20px; font-size: 15px; cursor: pointer" @click="showSettings = !showSettings">
            <span v-if="!!showSettings">隐藏设置</span>
            <span v-if="!(!!showSettings)">显示设置</span>
          </el-tag>

          <div v-if="!!showSettings" style="background-color: #f5f5f5; border: 1px solid #ddd; padding: 15px; font-size: 14px;">

            <div>
              <span>数据表格：</span>

              <el-checkbox v-model="showDataTable" @change="toggleDataTable">显示表格</el-checkbox>
              <el-checkbox v-model="showDataScaleBar">显示表格条形图</el-checkbox>

            </div>

            <div style="margin: 10px 0;">
              <span>其他图表：</span>

              <el-radio-group v-model="chartType" @change="onChangeChartType">

                <el-radio :label="2">饼状图</el-radio>
                <el-radio :label="3">圆环图</el-radio>
                <el-radio :label="4">柱状图</el-radio>
                <el-radio :label="5">条形图</el-radio>

              </el-radio-group>

            </div>

            <div>
              <span>隐藏选项：</span>

              <el-checkbox v-model="showZeroOption" @change="toggleZeroOption">隐藏零数据</el-checkbox>

            </div>


          </div>

        </div>

      </div>

      <div v-for="row of data">

        <div class="q-info">

          <span>第{{row.sequence}}题：<span class="q-title" v-html="row.title"></span>
            <span class="q-type">[{{getQuestionTypeName(row)}}]</span></span>

        </div>

        <table class="datagrid-table statistic-table"
               v-if="!(!!row['hideTable'])">

          <thead v-if="isChoiceQuestion(row) || isScoreQuestion(row) || isMatrixQuestion(row)">
            <tr>
              <th v-if="isMatrixQuestion(row)">
                <!-- 矩阵单选&矩阵多选 -->
                <div>行标题</div>
              </th>
              <th class="option">
                <div>


                  <span>选项</span>

                  <span class="sort-icon">
                    <i class="el-icon-caret-top"
                       :class="[ row['sortOption'] === 1 ? 'active' : '' ]"
                       @click="sort(row, 1, 'answer', 'sortOption')"></i>
                    <i class="el-icon-caret-bottom"
                       :class="[ row['sortOption'] === -1 ? 'active' : '' ]"
                       @click="sort(row, -1, 'answer', 'sortOption')"></i>
                  </span>
                </div>
              </th>
              <th class="sub-total">
                <div>
                  <span v-if="row.type === matrixQuestion.score.type
                    || row.type === scoreQuestion.single.type
                    || row.type === scoreQuestion.multiple.type">平均</span>
                  <span v-else>小计</span>
                  <span class="sort-icon">
                    <i class="el-icon-caret-top"
                       :class="[ row['sortSubTotal'] === 1 ? 'active' : '' ]"
                       @click="sort(row, 1, 'total', 'sortSubTotal')"></i>
                    <i class="el-icon-caret-bottom"
                       :class="[ row['sortSubTotal'] === -1 ? 'active' : '' ]"
                       @click="sort(row, -1, 'total', 'sortSubTotal')"></i>
                  </span>
                </div>
              </th>
              <th class="scale"><div>比例</div></th>
            </tr>
          </thead>

          <tbody>

            <template v-if="isMatrixQuestion(row)">
              <!-- 矩阵单选&矩阵多选&矩阵评分 -->
              <template v-for="(v, vIndex) of row.vertical">

                <template v-for="(option, index) of row.answer[vIndex]">

                  <report-row
                    v-if="!(row['ignoreZero'] === true && option.total === 0)"
                    :rowspan="row.answer[vIndex].length"
                    :row-title="index === 0 ? v : ''"
                    :option="option.answer"
                    :isScoreQuestion="row.type === matrixQuestion.score.type"
                    :total="option.total"
                    :show-data-scale-bar="showDataScaleBar"
                    :percentage="calcTotal(row)[vIndex] > 0 ? option.total/calcTotal(row)[vIndex] : 0"></report-row>

                </template>

                <report-sub-total
                  v-if="row.type !== matrixQuestion.score.type"
                  :total="calcTotal(row)[vIndex]"
                  :row-title-col="true"></report-sub-total>

                <report-sub-total
                  v-else
                  :total="Math.round(calcTotal(row)[vIndex]/row.answer[vIndex].length * 100)/100"
                  :title="'平均值'"
                  :row-title-col="true"></report-sub-total>

              </template>

              <report-total :total="row.answerCount" :row-title-col="true"></report-total>

            </template>
            <template v-else>

              <template v-if="!!isChoiceQuestion(row) || !!isScoreQuestion(row)">
                <template v-for="option of row.answer">

                  <report-row
                    v-if="!(row['ignoreZero'] === true && option.total === 0)"
                    :option="option.answer"
                    :total="option.total"
                    :isScoreQuestion="isScoreQuestion(row)"
                    :show-data-scale-bar="showDataScaleBar"
                    :percentage="calcTotal(row) > 0 ? option.total/calcTotal(row) : 0"></report-row>

                </template>


                <report-sub-total
                  v-if="isScoreQuestion(row)"
                  :total="Math.round(calcTotal(row)/row.answer.length*100)/100"
                  :title="'平均值'"></report-sub-total>
                <report-sub-total v-else :total="calcTotal(row)"></report-sub-total>

                <report-total :total="row.answerCount"></report-total>
              </template>

              <report-total v-else :total="row.answerCount"></report-total>
            </template>





          </tbody>

        </table>


        <div class="tool-bar" v-if="isChoiceQuestion(row) || isScoreQuestion(row) || isMatrixQuestion(row)">

          <span class="btn" @click="clickBtn(row, 1)"
                :class="[ !(!!row['hideTable']) ? 'active' : '' ]">
            <i class="iconfont icon-biaoge"></i>
            <label>表格</label>
          </span>

          <span class="btn" @click="clickBtn(row, 2)"
                :class="[ row['showChart'] === 2 ? 'active' : '' ]">
            <i class="iconfont icon-mianjitu"></i>
            <label>饼状图</label>
          </span>

          <span class="btn" @click="clickBtn(row, 3)"
                :class="[ row['showChart'] === 3 ? 'active' : '' ]">
            <i class="iconfont icon-huanzhuangtu"></i>
            <label>圆环图</label>
          </span>

          <span class="btn" @click="clickBtn(row, 4)"
                :class="[ row['showChart'] === 4 ? 'active' : '' ]">
            <i class="iconfont icon-zhuzhuangtu"></i>
            <label>柱状图</label>
          </span>

          <span class="btn" @click="clickBtn(row, 5)"
                :class="[ row['showChart'] === 5 ? 'active' : '' ]">
            <i class="iconfont icon-tiaoxingtu"></i>
            <label>条形图</label>
          </span>

          <span class="btn" @click="toggleIgnoreZero(row)" v-if="!!!isMatrixQuestion(row)">
            <label v-if="!(!!row['ignoreZero'])">隐藏零数据</label>
            <label v-if="!!row['ignoreZero']">显示零数据</label>
          </span>

        </div>


        <div class="q-d" :class="[ !(!!row['showChart']) ? 'last' : '' ]"></div>

        <!-- 显示图表 -->
        <div v-if="isChoiceQuestion(row) || isScoreQuestion(row) || isMatrixQuestion(row)">
          <div :id="'chart-' + row.sequence" :style="{height: (chartHeight || chartDefaultHeight ) + 'px'}" v-if="!!row['showChart']"></div>
        </div>
        <div class="q-d" v-if="!!row['showChart'] && (isChoiceQuestion(row) || isScoreQuestion(row))"
             :class="[ !!row['showChart'] ? 'last' : '' ]"></div>

      </div>


    </div>


  </div>
</template>

<script>
  import QuestionTemplate from '../js/question.template';
  import {
            pieChart,
            matrixPieChart,
            barChart,
            matrixBarChart} from '../js/echart-options';
  import ReportRow from "./ReportRow";
  import ReportTotal from "./ReportTotal";
  import ReportSubTotal from "./ReportSubTotal";

    export default {
        name: "Report",
      components: {ReportSubTotal, ReportTotal, ReportRow},
      props: ['data', 'chartHeight', "title"],
      data: function () {
        return {
          chartDefaultHeight: 300, // 图表默认高度

          showSettings: false,  // 显示设置
          showDataTable: true,  // 显示表格
          showDataScaleBar: true, // 显示比如进度条
          showZeroOption: false, // 显示零数据
          chartType: 2,  // 图表类型

          choiceQuestion: QuestionTemplate.choiceQuestion,  // 单选
          completionQuestion: QuestionTemplate.completionQuestion, // 填空
          plugin: QuestionTemplate.plugin,   // 辅助插件
          matrixQuestion: QuestionTemplate.matrixQuestion,  // 矩阵
          scoreQuestion: QuestionTemplate.scoreQuestion,  // 评分
          others:QuestionTemplate.others, // 其他类型

        }
      },
      mounted(){

        this.onChangeChartType();

      },

      methods: {

        /**
         * 导出word
         */
        exportWord: function(){

          // 重新获取报表图片

          for(let item of this.data){

            if(!!item.answer){
              if(item.answer.length === 0){
                delete item.answer;
              } else {
                // 判断答案是否是二维数组
                // 如果是二维数组的的话，则用answer2存储
                try{
                  if(typeof item.answer[0][0] === "object"){
                    item.answer2 = item.answer;
                    delete item.answer;

                    item.sum2 = item.sum;
                    delete item.sum;
                  }
                }catch (e) {
                }


              }
            }

            let element = document.getElementById('chart-' + item['sequence']);
            if(!!element){
              let canvas = element.firstChild.firstChild;
              let src = canvas.toDataURL('image/png');
              !!src && (item['chartImageData'] = src);
            }

          }

          this.$emit('export', {
            title: this.title,
            tableColor: '#666666',
            tableBgColor: '#ffffff',
            tableHeaderColor: '#000000',
            tableHeaderBgColor: '#f0f9eb',
            tableFooterColor: '#666666',
            tableFooterBgColor: '#fdf6ec',
            tableTotalColor: '#666666',
            tableTotalBgColor: '#f4f4f5',
            item: this.data
          });
        },

        /**
         * 计算答题总量
         */
        calcTotal: function(row){

          if(!!row['sum']){
            return row['sum'];
          }

          let total;

          // 单选题 & 单项&多项评分题
          if(row.type === this.choiceQuestion.single.type
            || row.type === this.choiceQuestion.multiple.type
            || row.type === this.choiceQuestion.list.type
            || row.type === this.choiceQuestion.scoreSingle.type
            || row.type === this.choiceQuestion.scoreMultiple.type
            || row.type === this.scoreQuestion.single.type
            || row.type === this.scoreQuestion.multiple.type){

            total = 0;

            for(let answer of row.answer){
              total += answer.total;
            }

          } else if(this.isMatrixQuestion(row)){

            // 矩阵题
            total = [];

            for(let i = 0; i < row.vertical.length; i++){

              if(!(!!total[i])){
                total[i] = 0;
              }

              for(let answer of row.answer[i]){
                total[i] += answer.total;
              }

            }

          } else if(row.type === this.completionQuestion.single.type){
            console.info('单项填空题：' + row.total);
            total = row.total;
          }

          row['sum'] = total;

          console.info(total);

          return total;

        },

        /**
         * 矩阵选择题
         */
        isMatrixQuestion: function(row){

          if(row.type === this.matrixQuestion.single.type
            || row.type === this.matrixQuestion.multiple.type
            || row.type === this.matrixQuestion.score.type){

            return true;
          }

          return false;
        },

        /**
         * 判断是否为选择题
         */
        isChoiceQuestion: function(row){

          if(row.type === this.choiceQuestion.single.type
            || row.type === this.choiceQuestion.multiple.type
            || row.type === this.choiceQuestion.list.type
            || row.type === this.choiceQuestion.scoreSingle.type
            || row.type === this.choiceQuestion.scoreMultiple.type
            || row.type === this.scoreQuestion.single.type
            || row.type === this.scoreQuestion.multiple.type){

            return true;
          }

          return false;
        },

        /**
         * 判断是否为评分题
         */
        isScoreQuestion: function(row){

          if(row.type === this.scoreQuestion.single.type
            || row.type === this.scoreQuestion.multiple.type){

            return true;
          }

          return false;
        },

        /**
         * 获取题目类型
         */
        getQuestionTypeName: function(row){

          let name;

          switch (row.type) {

            case this.choiceQuestion.single.type:
              name = this.choiceQuestion.single.name;
              break;
            case this.choiceQuestion.multiple.type:
              name = this.choiceQuestion.multiple.name;
              break;
            case this.choiceQuestion.list.type:
              name = this.choiceQuestion.list.name;
              break;
            case this.choiceQuestion.scoreSingle.type:
              name = this.choiceQuestion.scoreSingle.name;
              break;
            case this.choiceQuestion.scoreMultiple.type:
              name = this.choiceQuestion.scoreMultiple.name;
              break;
            case this.completionQuestion.single.type:
              name = this.completionQuestion.single.name;
              break;
            case this.completionQuestion.table.type:
              name = this.completionQuestion.table.name;
              break;
            case this.completionQuestion.matrix.type:
              name = this.completionQuestion.matrix.name;
              break;
            case this.matrixQuestion.single.type:
              name = this.matrixQuestion.single.name;
              break;
            case this.matrixQuestion.multiple.type:
              name = this.matrixQuestion.multiple.name;
              break;
            case this.matrixQuestion.score.type:
              name = this.matrixQuestion.score.name;
              break;
            case this.scoreQuestion.single.type:
              name = this.scoreQuestion.single.name;
              break;
            case this.scoreQuestion.multiple.type:
              name = this.scoreQuestion.multiple.name;
              break;
            case this.others.sort.type:
              name = this.others.sort.name;
              break;
          }

          row['sType'] = name;

          return name;

        },

        /**
         * 矩阵单选，多选排序
         */
        matrixSort: function(row, asc, property, key){

          if(!(!!row[key])){
            this.$set(row, key, asc);
          } else {
            if(asc !== row[key]){
              this.$set(row, key, asc);
            } else {
              this.$delete(row, key);
            }

          }

          // 排序
          for(let i = 0; i < row.vertical.length; i++){

            row.answer[i].sort(function(o1, o2){

              let t1 = o1[property], t2 = o2[property];

              if(asc === -1){
                if(t1 < t2){
                  return 1;
                } else if(t1 > t2){
                  return -1;
                }
              } else if(asc === 1){

                if(t1 < t2){
                  return -1;
                } else if(t1 > t2){
                  return 1;
                }

              }

              return 0;

            });
          }

          // 刷新图表
          this.genChart(row, row['chartType']);
        },


        /**
         * 排序
         */
        sort: function(row, asc, property, key){

          if(!!this.isMatrixQuestion(row)){

            this.matrixSort(row, asc, property, key);

            return;
          }


          if(!(!!row[key])){
            this.$set(row, key, asc);
          } else {
            if(asc !== row[key]){
              this.$set(row, key, asc);
            } else {
              this.$delete(row, key);
            }

          }

          row.answer.sort(function (o1, o2) {

            let t1 = o1[property], t2 = o2[property];

            if(asc === -1){
              if(t1 < t2){
                return 1;
              } else if(t1 > t2){
                return -1;
              }
            } else if(asc === 1){

              if(t1 < t2){
                return -1;
              } else if(t1 > t2){
                return 1;
              }

            }

            return 0;

          });

          // 刷新图表
          this.genChart(row, row['chartType']);

        },

        /**
         * 批量显示图表
         */
        onChangeChartType: function(){

          if(!!this.chartType){
            // 图表

            for(let row of this.data){
              this.$delete(row, 'showChart');
              this.clickBtn(row, this.chartType);
            }
          }

        },

        /**
         * 显示隐藏数据表格
         */
        toggleDataTable: function(){

          for(let row of this.data){
            if(!!row){
              this.$set(row, 'hideTable', !this.showDataTable);
            }
          }

        },

        /**
         * 显示隐藏零数据
         */
        toggleZeroOption: function(){

          for(let row of this.data){
            if(!!row){
              this.$set(row, 'ignoreZero', this.showZeroOption);
            }
          }

        },

        /**
         * 显示隐藏零数据
         */
        toggleIgnoreZero: function(row){

          if(!(!!row['ignoreZero'])){
            this.$set(row, 'ignoreZero', true);
          } else {
            this.$delete(row, 'ignoreZero');
          }

          // 重新渲染图表
          this.genChart(row, row['chartType']);

        },

        /**
         * 生成图表
         * type=2 饼状图
         * type=3 圆环图
         * type=4 柱状图
         * type=5 条形图
         * @param type
         */
        genChart: function(row, type){

          let option, chart, ele = document.getElementById('chart-' + row.sequence);

          if(!(!!ele)) return;

          chart = echarts.init(ele);

          row['chartType'] = type;

          switch (type) {
            case 2:
              if(!this.isMatrixQuestion(row)) {
                option = pieChart(row, '70%', this.isScoreQuestion(row));
              } else {
                option = matrixPieChart(row, '70%', row.type === this.matrixQuestion.score.type);
              }
              break;
            case 3:
              // 圆环图
              if(!this.isMatrixQuestion(row)) {
                option = pieChart(row, ['50%', '70%'], this.isScoreQuestion(row))
              } else {
                option = matrixPieChart(row, ['50%', '70%'], row.type === this.matrixQuestion.score.type);
              }
              break;
            case 4:
              // 柱状图，显示百分比
              // 非矩阵题
              if(!this.isMatrixQuestion(row)){
                option = barChart(row, false, this.isScoreQuestion(row));
              } else {
                option = matrixBarChart(row, false, row.type === this.matrixQuestion.score.type);
              }
              break;
            case 5:
              if(!this.isMatrixQuestion(row)) {
                option = barChart(row, true, this.isScoreQuestion(row));
              } else {
                option = matrixBarChart(row, true, row.type === this.matrixQuestion.score.type);
              }
              break;

          }

          console.info('option', option);

          chart.clear();
          chart.setOption(option);

          // let canvas = ele.firstChild.firstChild;
          // let src = canvas.toDataURL('image/png');
          // !!src && (row.chartImageData = src);


        },

        clickBtn: function (row, type) {

          if(type === 1){
            if(!(!!row['hideTable'])){
              this.$set(row, 'hideTable', true);
            } else {
              this.$delete(row, 'hideTable');
            }
            return;
          }

          switch (type) {
            case 2:

              if(!(!!row['showChart']) || row['showChart'] !== 2){
                this.$set(row, 'showChart', 2);
              } else {
                this.$delete(row, 'showChart');
              }

              break;
            case 3:
              if(!(!!row['showChart']) || row['showChart'] !== 3){
                this.$set(row, 'showChart', 3);
              } else {
                this.$delete(row, 'showChart');
              }

              break;
            case 4:
              if(!(!!row['showChart']) || row['showChart'] !== 4){
                this.$set(row, 'showChart', 4);
              } else {
                this.$delete(row, 'showChart');
              }

              break;
            case 5:
              if(!(!!row['showChart']) || row['showChart'] !== 5){
                this.$set(row, 'showChart', 5);
              } else {
                this.$delete(row, 'showChart');
              }

              break;
          }

          // 生成图表
          setTimeout(() => {
            if(!!row['showChart']){
              this.genChart(row, type);
            }
          }, 0);
        }
      }
    }
</script>

<style>

  .statistic-table{
    width: 100%;
    border-spacing: 0;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  .statistic-table th,
  .statistic-table td {
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  .statistic-table th > div,
  .statistic-table td > div{
    padding: 10px 15px;

  }

  .statistic-table .sub-total{
    width: 90px;
  }

  .statistic-table .scale{
    width: 280px;
    text-align: center;
  }

  .statistic-table .scale > div{

  }

  .q-info{
    margin-bottom: 15px;
    font-weight: bold;
  }

  .q-info .q-title{
    font-weight: normal;
  }

  .q-info .q-type{
    color: #999;
  }

  .q-d{
    margin: 15px 0;
    border-top: 1px dashed #e6e6e6;
  }

  .q-d.last{
    margin: 15px 0 30px 0;
  }

  .tool-bar{
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }

  .tool-bar .btn:first-child{
    margin-left: 0;
  }

  .tool-bar .btn{
    font-size: 12px;
    margin-left: 10px;
    border:1px solid #aaa;
    border-radius: 4px;
    padding: 5px 10px;
  }

  .tool-bar .btn,
  .tool-bar .btn * {
    cursor: pointer;
  }

  .tool-bar .btn:hover{
    border-color: #d9ecff;
    background-color: #ecf5ff;
    color: #409eff;
  }

  .tool-bar .btn.active{
    border-color: #409eff;
    background-color: #409eff;
    color: #fff;
  }

  .hide-chartbox{
    position: absolute;
    left: -9999em;
    top: -9999em;
  }

  .datagrid-table th{
    background-color: #f0f9eb;
  }

  .sort-icon{
    display: flex;
    flex-direction: column;
    align-items: center;

  }

  th.option > div, th.sub-total div{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sort-icon {
    margin-left: 5px;
  }

  .sort-icon i{
    color: #ddd;
    font-size: 16px;
    cursor: pointer;
  }

  .sort-icon i.active{
    color: #409eff;
  }

</style>
