<template>

  <!--
  5：单项填空
  6：多项填空
  7：矩阵填空
  8：表格填空

  -->

  <div class="answer-type-completion">

    <template v-if="isSingleCompletion">

      <ul style="width: 100%">
        <li class="answer-item-wrapper" style="width: 100%">

          <template v-if="question.dataType === 0">

              <el-input
                class="answer-item"
                type="textarea"
                @input.native="changeText"
                v-if="question.dataRows > 1"
                :rows="question.dataRows"
                v-model="question.userAnswer"
                :maxlength="question.dataMax"
                :style="{ width: (100 / question.columns) + '%'}"
                :class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"
                :placeholder="completionDataTypesPlaceHolder[question.dataType]"  :disabled="!!readonly">
              </el-input>
            <el-input
              class="answer-item"
              v-else="!!!question.dataRows || question.dataRows === 1"
              @input.native="changeText"
              v-model="question.userAnswer"
              :maxlength="question.dataMax"
              :style="{ width: (100 / question.columns) + '%'}"
              :class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"
              :placeholder="completionDataTypesPlaceHolder[question.dataType]"  :disabled="!!readonly">
            </el-input>
          </template>

          <el-input
            class="answer-item"
            v-else-if="question.dataType !== 3"
            v-model="question.userAnswer"
            :maxlength="question.dataMax"
            @input.native="changeText"
            :style="{ width: (100 / question.columns) + '%'}"
            :class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"
            :placeholder="completionDataTypesPlaceHolder[question.dataType]" :disabled="!!readonly">

            <i v-if="question.dataType === 4"
               slot="prefix"
               class="el-input__icon el-icon-mobile-phone"
               style="line-height: 36px;"></i>
            <i v-else-if="question.dataType === 5"
               slot="prefix"
               class="el-input__icon el-icon-message"
               style="line-height: 36px;"></i>
            <i v-else-if="question.dataType === 6"
               slot="prefix"
               class="el-input__icon el-icon-link"
               style="line-height: 36px;"></i>
            <i v-else-if="question.dataType === 7"
               slot="prefix"
               class="el-input__icon el-icon-postcard"
               style="line-height: 36px;"></i>
            <i v-else-if="question.dataType === 11"
               slot="prefix"
               class="el-input__icon el-icon-location-outline"
               style="line-height: 36px;"></i>

          </el-input>

          <el-date-picker
            class="answer-item"
            :style="{ width: (100 / question.columns) + '%'}"
            :class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"
            v-else-if="question.dataType === 3"
            v-model="question.userAnswer"
            type="date"
            placeholder="选择日期" :disabled="!!readonly">

          </el-date-picker>

        </li>
      </ul>
    </template>

    <!-- 多项填空题 -->
    <!--<template v-else-if="question.type === 7">-->

      <!--<table>-->

        <!--<tr v-for="(item, index) in question.answer" :key="item.id">-->
          <!--<td>-->
            <!--<span class="answer-item">{{item.answer}}</span>-->
          <!--</td>-->
          <!--<td style="min-width: 150px">-->
            <!--<el-input-->
              <!--type="textarea"-->
              <!--:rows="question.rows"-->
              <!--:maxlength="question.size"-->
              <!--:class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"-->
              <!--:style="{ width: (100 / question.columns) + '%'}"-->
              <!--v-model="question.userAnswer[index]"></el-input>-->
          <!--</td>-->
        <!--</tr>-->
      <!--</table>-->

      <!--<user-answer v-if="showUserAnswer" :answer="question.userAnswer"></user-answer>-->

    <!--</template>-->

    <!-- 矩阵填空题 -->
    <template v-else-if="isMatrixCompletion">

      <table style="width: 100%">

        <tr v-for="(item, index) in question.answer" :key="item.id">
          <td style="width: 15%">
            <div class="answer-item title">{{item.answer}}</div>
          </td>
          <td>
            <el-input
              type="textarea"
              autosize
              :rows="question.dataRows"
              @input.native="changeText"
              :maxlength="question.dataMax"
              :class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"
              :style="{ width: (100 / question.columns) + '%'}"
              v-model="question.userAnswer[index]" :disabled="!!readonly"></el-input>
          </td>
        </tr>
      </table>

    </template>

    <!--表格填空-->
    <template v-else-if="isTableCompletion">

      <table style="width: 100%">

        <thead>
          <tr class="table-horizontal">
            <th></th>

            <th v-for="answer in question.answer">
              <div class="text-center title">{{answer.answer}}</div>
            </th>
          </tr>

        </thead>

        <tbody>

          <tr v-for="(v, y) in question.vertical">

            <td class="table-vertical">
              <div class="title">{{v}}</div>
            </td>

            <td v-for="(answer, x) in question.answer">
              <el-input
                type="textarea"
                style="margin: 0 auto; display: block"
                autosize
                :rows="question.dataRows"
                @input.native="changeText"
                :maxlength="question.dataMax"
                :class="[ !!question.underlineStyle ? 'completion-underline' : '' ]"
                :style="{ width: (100 / question.columns) + '%'}"
                v-model="question.userAnswer[y][x]" :disabled="!!readonly"></el-input>
            </td>

          </tr>

        </tbody>

      </table>

    </template>


  </div>


</template>

<script>

    import questionTemplate from "../../js/question.template";
    import {completionDataTypesPlaceHolder} from "../../js/question.answer.template";

    export default {
        name: "CompletionAnswer",
      props: ['question', 'editable', 'readonly', 'sections'],
        data: function () {
          return {
            completionQuestion: questionTemplate.completionQuestion,
            completionDataTypesPlaceHolder: completionDataTypesPlaceHolder,
          }
        },
        computed: {

          // 单项填空题
          isSingleCompletion: function(){
            return this.question.type === this.completionQuestion.single.type;
          },

          // 矩阵填空题
          isMatrixCompletion: function(){
            return this.question.type === this.completionQuestion.matrix.type;
          },

          // 表格填空题
          isTableCompletion: function(){
            return this.question.type === this.completionQuestion.table.type;
          }

        },

        created(){
            // console.info(this.question.userAnswer);
        },

        watch: {
          'question.userAnswer': {
              handler: function(newVal, oldVal){
                  console.info(newVal)
              },
              immediate: true
          }
        },

        methods: {

            changeText(){
                console.info('completedTable');

                switch (this.question.type) {

                    case this.completionQuestion.single.type:
                        if(!!this.question.userAnswer){
                            this.$emit('handle-forward');
                        } else {
                            this.$emit('handle-forward-seq', this.question['forward'], true);
                        }
                        break;

                    case this.completionQuestion.matrix.type:
                        // 全部填写完毕

                        let flag = true;
                        for(let i = 0; i < this.question.answer.length; i++){
                            if(!!!this.question.userAnswer[i]){
                                flag = false;
                                break;
                            }
                        }

                        if(flag){
                            this.$emit('handle-forward');
                        } else {
                            this.$emit('handle-forward-seq', this.question['forward'], true);
                        }

                        break;

                    case this.completionQuestion.table.type:

                        let flag2 = true;
                        console.info(JSON.stringify(this.question.userAnswer))

                        for(let i = 0; i < this.question.vertical.length; i++){
                            const item = this.question.userAnswer[i];
                            if(!!!item) continue
                            for(let j = 0; j < this.question.answer.length; j++){
                                const value = item[j];
                                if(!!!value){
                                    flag2 = false;
                                    break;
                                }
                            }

                        }

                        if(flag2){
                            this.$emit('handle-forward');
                        } else {
                            this.$emit('handle-forward-seq', this.question['forward'], true);
                        }

                        break;

                }

            },




        }
    }
</script>

<style scoped>


</style>
