
<!--
  评分题
 单项评分题
 多项评分题
 -->

<template>

  <div class="answer-type-score">

    <template v-if="isSingle || isMultiple">

      <table>

        <!-- 每一个答案 -->
        <template v-for="(v,index) in question.vertical">
          <tr>

            <td class="table-vertical title" style="width: 30%">
              <span>{{v}}</span>
            </td>

            <!-- 评分 -->
            <td style="width: 130px;">

              <template v-if="isSingle">
                <el-rate
                  v-model="question.userAnswer"
                  :colors="colors" :disabled="!!readonly">
                </el-rate>
              </template>
              <template v-else-if="isMultiple">
                <el-rate
                  v-model="question.userAnswer[index]"
                  :colors="colors" :disabled="!!readonly">
                </el-rate>
              </template>
            </td>

            <td>
              <span style="color: #efa030; font-size: 14px;">(分值:
                <template v-if="isSingle">{{question.userAnswer}}</template>
                <template v-else-if="isMultiple">{{question.userAnswer[index]}}</template>)</span>
            </td>

          </tr>
        </template>

      </table>
    </template>

  </div>
    
</template>

<script>
    import questionTemplate from "../../js/question.template";

    export default {
        name: "ScoreAnswer",
      props: ['question', 'readonly'],
      data: function () {
          return {
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            scoreQuestion: questionTemplate.scoreQuestion,
          }
        },
      computed: {

        // 单项评分
        isSingle: function(){
          return this.question.type === this.scoreQuestion.single.type;
        },

        // 多项评分
        isMultiple: function(){
          return this.question.type === this.scoreQuestion.multiple.type;
        }
      },
      methods: {
      }
    }
</script>



<style scoped>

</style>
