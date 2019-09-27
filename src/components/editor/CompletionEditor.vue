<template>

  <div class="completion-question-editor">

    <!-- 单项填空的属性验证 -->
    <!-- 属性验证 -->
    <div class="completion-oper" v-if="isSingleCompletion">

      <span class="title">属性验证</span>
      <el-select v-model="question.dataType" style="width: 120px">
        <el-option v-for="(dataType, index) of completionDataTypes"
                   :label="dataType"
                   :value="index"
                   :key="index"></el-option>
      </el-select>


      <template v-if="question.dataType === 0
          || question.dataType === 1
          || question.dataType === 2">

        <el-checkbox v-model="limitRange" style="margin-left: 1rem; font-weight: normal">限制范围</el-checkbox>

        <!-- 限制范围 -->
        <span class="range" v-if="limitRange">

          <span class="title" style="font-weight: normal">
            <template v-if="question.dataType === 0">最小字数</template>
            <template v-else>最小值</template>
          </span>

          <el-input v-model="question.dataMin" style="width: 80px"/>

          <span class="title" style="margin-left: 1rem; font-weight: normal">
            <template v-if="question.dataType === 0">最大字数</template>
            <template v-else>最大值</template>
          </span>
          <el-input v-model="question.dataMax" style="width: 80px"/>

        </span>

      </template>

    </div>

    <div v-else class="completion-oper completion-table">
      <!-- 表格填空题 -->
      <div class="row-title">
        <div class="title completion-table">行标题</div>
        <el-input type="textarea" rows="5" v-model="vertical" @blur="changeVertical"></el-input>
      </div>


      <div class="col-title" v-if="question.type === 9">
        <div class="title completion-table">列标题</div>
        <el-input type="textarea" rows="5" v-model="horizontal" @blur="changeHorizontal"></el-input>
      </div>

    </div>

    <div class="completion-oper completion-table"
         v-if="isMatrixCompletion || isTableCompletion">
      <el-link icon="el-icon-edit" @click="columnPropertiesVisible = true">设置列属性</el-link>
    </div>

    <div class="completion-oper">

      <template v-if="question.dataType === 0">
        <span class="title">高度</span>
        <el-select style="width: 100px;" v-model="question.dataRows" @change="changeRows(1)">
          <el-option label="默认" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
          <el-option label="5" :value="5"></el-option>
          <el-option label="10" :value="10"></el-option>
          <el-option label="自定义" :value="-1"></el-option>
        </el-select>

        <el-input v-if="question.dataRows === -1" v-model="rows" style="width: 100px" @change="changeRows(2)"/>
        <label style="font-size: 14px; color: #999;margin-left: 2rem">行</label>
      </template>

      <span class="title">宽度</span>
      <el-select style="width: 100px" v-model="question.columns">
        <el-option label="100%" :value="1"></el-option>
        <el-option label="50%" :value="2"></el-option>
        <el-option label="33%" :value="3"></el-option>
        <el-option label="25%" :value="4"></el-option>
      </el-select>

      <el-checkbox style="margin-left: 2rem" v-model="question.underlineStyle">下划线样式</el-checkbox>


    </div>


    <!-- 设置列属性 -->
    <el-dialog
      title="设置列属性"
      :visible.sync="columnPropertiesVisible">
      <div>
        <div style="">
          <table cellpadding="0" cellspacing="0" style="width: 100%">
            <tr>
              <th><div>列标题</div></th>
              <th style="width: 120px"><div style="text-align: center">验证属性</div></th>
              <th style="width: 300px"><div style="text-align: center">范围</div></th>
            </tr>
            <template v-if="isMatrixCompletion">
              <tr v-for="answer of question.answer">
                <th><div>{{answer.answer}}</div></th>
                <th><div style="text-align: center">
                  <el-select v-model="answer.dataType" style="width: 120px">
                    <el-option v-for="(dataType, index) of completionDataTypes"
                               :label="dataType"
                               :value="index"
                               :key="index"></el-option>
                  </el-select>
                </div></th>
                <th><div style="text-align: center">

                  <template v-if="answer.dataType === 0 || answer.dataType === 1 || answer.dataType === 2">

                    <span class="title" style="font-weight: normal">
                      <template v-if="answer.dataType === 0">最小字数</template>
                      <template v-else>最小值</template>
                    </span>

                    <el-input v-model="answer.dataMin" style="width: 60px"/>

                    <span class="title" style="margin-left: 0.5rem; font-weight: normal">
                      <template v-if="answer.dataType === 0">最大字数</template>
                      <template v-else>最大值</template>
                    </span>
                    <el-input v-model="answer.dataMax" style="width: 60px"/>

                  </template>
                </div></th>
              </tr>
            </template>
            <template v-else-if="isTableCompletion">
              <tr v-for="answer of question.answer">
                <th><div>{{answer.answer}}</div></th>
                <th><div style="text-align: center">
                  <el-select v-model="answer.dataType" style="width: 120px">
                    <el-option v-for="(dataType, index) of completionDataTypes"
                               :label="dataType"
                               :value="index"
                               :key="index"></el-option>
                  </el-select>
                </div></th>
                <th><div style="text-align: center">

                  <template v-if="answer.dataType === 0 || answer.dataType === 1 || answer.dataType === 2">

                    <span class="title" style="font-weight: normal">
                      <template v-if="answer.dataType === 0">最小字数</template>
                      <template v-else>最小值</template>
                    </span>

                    <el-input v-model="answer.dataMin" style="width: 60px"/>

                    <span class="title" style="margin-left: 0.5rem; font-weight: normal">
                      <template v-if="answer.dataType === 0">最大字数</template>
                      <template v-else>最大值</template>
                    </span>
                    <el-input v-model="answer.dataMax" style="width: 60px"/>

                  </template>
                </div></th>
              </tr>
            </template>
          </table>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="columnPropertiesVisible = false">确定</el-button>
      </span>

    </el-dialog>


  </div>
    
</template>

<script>

    import {completionDataTypes} from '../../js/question.answer.template';
    import questionTemplate from "../../js/question.template";


    export default {
        name: "CompletionEditor",
      props: ['question'],
      data: function(){
          return {
            columnPropertiesVisible: false, // 设置列属性
            completionDataTypes: completionDataTypes,
            questionTemplate: questionTemplate,

            completionQuestion: questionTemplate.completionQuestion,


            rows: 0,
            limitRange: '',
            heights: [1, 2, 3, 4, 5, 10],
            horizontal: '', // 表格填空题水平
            vertical: '',  // 表格填空题的垂直

          }
      },

      computed: {

        isSingleCompletion: function(){
          return this.question.type === this.completionQuestion.single.type;
        },

        isMatrixCompletion: function(){
          return this.question.type === this.completionQuestion.matrix.type;
        },

        isTableCompletion: function(){
          return this.question.type === this.completionQuestion.table.type;
        },
      },

      mounted: function(){

        this.initVertical();
        this.initHorizontal();

      },
      methods: {

        // 初始化行数据
        initVertical: function(){

          this.vertical = '';
          switch (this.question.type) {
            case this.completionQuestion.matrix.type:
              // 矩阵填空
              for(let answer of this.question.answer){
                this.vertical += answer.answer + '\n';
              }
              break;
            case this.completionQuestion.table.type:
              // 表格填空
              for(let v of this.question.vertical){
                this.vertical += v + '\n';
              }


              break;
          }

        },

        // 初始化列数据
        initHorizontal: function(){

          this.horizontal = '';
          if(this.question.type === this.completionQuestion.table.type){

            for(let answer of this.question.answer){
              this.horizontal += answer.answer + '\n';
            }

          }

        },

        /**
         * 修改行标题
         */
        changeVertical: function(){

          let verticals = this.vertical.split(/[(\r\n)\r\n]+/);

          // 实际长度
          let len = 0;

          this.$set(this.question, 'userAnswer', []);

          for(let i = 0; i < verticals.length; i++){
            if(!!verticals[i]){
              len++; // 实际长度

              switch (this.question.type) {
                case this.completionQuestion.matrix.type:

                  let answer = this.question.answer[i];

                  if(!!answer){

                    if(answer.answer !== verticals[i]){
                      answer.answer = verticals[i];
                    }

                  } else {

                    // 复制模板
                    let template = JSON.parse(JSON.stringify(questionTemplate.completionQuestion.matrix.answer[0]));
                    template.answer = verticals[i];

                    this.question.answer.push(template);
                  }

                  break;

                case this.completionQuestion.table.type:
                  //
                  let vertical = this.question.vertical[i];
                  if(!!vertical){
                    if(vertical !== verticals[i]){
                      this.$set(this.question.vertical, i, verticals[i]);
                    }
                  } else {
                    this.question.vertical.splice(i + 1, 0, verticals[i]);
                  }

                  this.question.userAnswer.push([]);

                  break;
              }

            }

          }

          if (this.question.type === this.completionQuestion.matrix.type) {

            if(len < this.question.answer.length){
              // 删除后面的
              this.question.answer.splice(len, (this.question.answer.length - len));
            }

            if(len === 0){
              this.question.answer = JSON.parse(JSON.stringify(questionTemplate.completionQuestion.matrix.answer));
              this.initVertical();
            }

          } else if(this.question.type === this.completionQuestion.table.type){

            if(len < this.question.vertical.length){
              // 删除后面的
              this.question.vertical.splice(len, (this.question.vertical.length - len));
            }

            if(len === 0){
              this.question.vertical = JSON.parse(JSON.stringify(questionTemplate.completionQuestion.table.vertical));
              this.initVertical();
            }

          }

        },

        /**
         * 修改列标题
         */
        changeHorizontal: function(){

          let horizontals = this.horizontal.split(/[(\r\n)\r\n]+/);

          // 实际长度
          let len = 0;

          for(let i = 0; i < horizontals.length; i++) {
            if (!!horizontals[i]) {
              len++; // 实际长度

              let answer = this.question.answer[i];
              if(!!answer){

                if(answer.answer !== horizontals[i]){
                  answer.answer = horizontals[i];
                }

              } else {

                let template = JSON.parse(JSON.stringify(questionTemplate.completionQuestion.table.answer[0]));
                template.answer = horizontals[i];

                this.question.answer.push(template);
              }

            }

          }

          if(len < this.question.answer.length){
            // 删除后面的
            this.question.answer.splice(len, (this.question.answer.length - len));
          }

          if(len === 0){
            this.question.answer = JSON.parse(JSON.stringify(questionTemplate.completionQuestion.table.answer));
            this.initHorizontal();
          }

        },

        changeRows: function(type){
          switch (type) {
            case 1:
              if(this.question.rows === -1 && !!this.rows){
                this.question.dataRows = this.rows;
              }
              break;
            case 2:
              this.question.dataRows = this.rows;

              break;
          }

        },
      }
    }
</script>

<style scoped>

</style>
