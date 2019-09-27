
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
    <template v-else-if="isMatrixScoreSingle || isMatrixScoreMultiple">

      <table>

        <!-- 每一个答案 -->
        <tr v-for="(v,index) in question.vertical">

          <td class="table-vertical title" style="width: 30%">
            <span>{{v}}</span>
          </td>

          <!-- 评分 -->
          <td style="width: 130px;">

            <el-rate
              v-model="question.userAnswer[index]"
              :colors="question.colors"  :disabled="!!readonly">
            </el-rate>

          </td>

          <td>
            <span style="color: #efa030; font-size: 14px;">(分值: {{question.userAnswer[index]}})</span>
          </td>


        </tr>

      </table>

    </template>


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

        // 单项评分
        isMatrixScoreSingle: function(){
          return this.question.type === this.matrixQuestion.scoreSingle.type;
        },

        // 多项评分
        isMatrixScoreMultiple: function(){
          return this.question.type === this.matrixQuestion.scoreMultiple.type;
        },

        // 矩阵评分题
        isMatrixScore: function(){
          return this.question.type === this.matrixQuestion.score.type;
        }
      },
      methods: {
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
