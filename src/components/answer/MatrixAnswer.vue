
<!--

  矩阵题

  矩阵单选
  矩阵多选

-->

<template>

  <div class="answer-type-matrix">

    <!-- 矩阵单选 -->
    <template v-if="isMatrixSingle">

      <table>

        <thead>

          <tr class="table-horizontal">
            <th></th>

            <!-- 输出答案选项头部 -->
            <th v-for="h in question.horizontal">
              <div class="text-center title">{{h}}</div>
            </th>

          </tr>

        </thead>

        <!-- 每一个答案 -->
        <tbody>

          <tr v-for="(v,index) in question.vertical">

            <td class="table-vertical">
              <div class="title">{{v}}</div>
            </td>

            <!-- 答案选项 -->
            <td class="text-center" v-for="(h,index2) in question.horizontal">

              <el-radio
                class="answer-item only-radio"
                v-model="question.userAnswer[index]"
                @change="changeValue"
                :label="index2 + 1"
                :name="'answer-' + question.id + '-' + index"
                :key="h" :disabled="!!readonly"></el-radio>

            </td>

          </tr>

        </tbody>


      </table>

    </template>

    <!-- 矩阵多选 -->
    <template v-else-if="isMatrixMultiple">

      <table>

        <thead>

          <tr class="table-horizontal">
            <th></th>

            <!-- 输出答案选项头部 -->
            <th v-for="h in question.horizontal">
              <div class="text-center title">{{h}}</div>
            </th>

          </tr>

        </thead>

        <!-- 每一个答案 -->
        <tbody>

          <tr v-for="(v,index) in question.vertical">

            <td class="table-vertical">
              <span class="title">{{v}}</span>
            </td>

            <!-- 答案选项 -->
            <td class="text-center" v-for="(h,index2) in question.horizontal">

              <el-checkbox
                class="answer-item only-checkbox"
                v-model="question.userAnswer[index]"
                @change="changeValue"
                :label="index2 + 1"
                :name="'answer-' + question.id + '-' + index"
                :key="h" :disabled="!!readonly"></el-checkbox>

            </td>

          </tr>

        </tbody>

      </table>

    </template>

    <!-- 矩阵评分题 -->
    <template v-else-if="isMatrixScore">

      <table>

        <thead>

          <tr class="table-horizontal">
            <th></th>

            <!-- 输出答案选项头部 -->
            <th v-for="h in question.horizontal">
              <div class="text-center title">{{h}}</div>
            </th>

          </tr>

        </thead>

        <!-- 每一个答案 -->
        <tbody>

          <tr v-for="(v,index) in question.vertical">

            <td class="table-vertical">
              <span class="title">{{v}}</span>
            </td>

            <!-- 答案选项 -->
            <td class="text-center" v-for="(h,index2) in question.horizontal">


              <el-select
                v-model="question.userAnswer[index][index2]"
                @change="changeValue"
                :disabled="!!readonly" style="width: 100px;">

                <el-option
                  v-for="item in 5"
                  :key="index + '-' + index2 + '-' + item"
                  :label="item + '分'"
                  :value="item"></el-option>

              </el-select>

            </td>

          </tr>

        </tbody>

      </table>

    </template>


    <!-- 评分题
     单项评分题
     多项评分题
     -->
<!--    <template v-else-if="isMatrixScoreSingle || isMatrixScoreMultiple">-->

<!--      <table>-->

<!--        &lt;!&ndash; 每一个答案 &ndash;&gt;-->
<!--        <tr v-for="(v,index) in question.vertical">-->

<!--          <td class="table-vertical title" style="width: 30%">-->
<!--            <span>{{v}}</span>-->
<!--          </td>-->

<!--          &lt;!&ndash; 评分 &ndash;&gt;-->
<!--          <td style="width: 130px;">-->

<!--            <el-rate-->
<!--              v-model="question.userAnswer[index]"-->
<!--              @change="changeValue"-->
<!--              :colors="question.colors"  :disabled="!!readonly">-->
<!--            </el-rate>-->

<!--          </td>-->

<!--          <td>-->
<!--            <span style="color: #efa030; font-size: 14px;">(分值: {{question.userAnswer[index]}})</span>-->
<!--          </td>-->


<!--        </tr>-->

<!--      </table>-->

<!--    </template>-->


  </div>

</template>

<script>
    import questionTemplate from "../../js/question.template";

    export default {
        name: "MatrixAnswer",
      props: ['question', 'readonly'],
      data: function () {
          return {
              matrixQuestion: questionTemplate.matrixQuestion,
              // choiceQuestion: questionTemplate.choiceQuestion,
          }
        },
      computed: {

        // 矩阵单选
        isMatrixSingle: function(){
          return this.question.type === this.matrixQuestion.single.type;
        },

        // 矩阵多选
        isMatrixMultiple: function(){
          return this.question.type === this.matrixQuestion.multiple.type;
        },

        // // 单项评分
        // isMatrixScoreSingle: function(){
        //   return this.question.type === this.choiceQuestion.scoreSingle.type;
        // },
        //
        // // 多项评分
        // isMatrixScoreMultiple: function(){
        //   return this.question.type === this.choiceQuestion.scoreMultiple.type;
        // },

        // 矩阵评分题
        isMatrixScore: function(){
          return this.question.type === this.matrixQuestion.score.type;
        }
      },
      methods: {

          changeValue(){

              // switch (this.question.type) {
              //
              //     case this.matrixQuestion.single.type:
              //         // 评分单选
              //
              //         this.$emit('handle-forward');
              //         break;
              //     case this.matrixQuestion.multiple.type:
              //
              //         if(this.question.userAnswer.length > 0){
              //             console.info('选中答案了。。。')
              //             this.$emit('handle-forward');
              //         } else {
              //             console.info('没选中答案。。。')
              //             this.$emit('handle-forward-seq', this.question['forward'], true);
              //         }
              //
              //         break;
              //
              //     case this.matrixQuestion.score.type:
              //         break;
              //
              // }

              let flag = true;
              for(let i = 0; i < this.question.vertical.length; i++){

                  // array
                  const item = this.question.userAnswer[i];

                  if(item.length === 0){
                      flag = false;
                      break;
                  }

              }

              if(flag){
                  this.$emit('handle-forward');
              } else {
                  this.$emit('handle-forward-seq', this.question['forward'], true);
              }


          }

      }
    }
</script>

<style>

  .el-radio.only-radio > span:last-child,
  .el-checkbox.only-checkbox > span:last-child{
    display: none;
  }

</style>

<style scoped>

  .answer-item {
    margin-right: 0rem;
  }

</style>
