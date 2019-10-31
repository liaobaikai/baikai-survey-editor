<!--

其他答案类型

排序

-->

<template>


  <div class="answer-type-sort">
    <!-- 排序题 -->
    <el-checkbox-group
      v-model="question.userAnswer"
      :max="!!question.maxAnswer ? question.maxAnswer : question.answer.length"
      @change="changeValue" :disabled="!!readonly">

      <ul v-for="page of (Math.ceil(question.answer.length / question.columns))" :key="page">

        <template v-for="(item, index) in question.answer">

        <li class="answer-item-wrapper"
          v-if="(page - 1) * question.columns <= index && index < page * question.columns"
          :style="{ width : (100 / question.columns) + '%'}">

          <div v-if="item.image">
            <img class="image" :src="item.image" style="width: 100%"/>
          </div>

          <span class="sort-numb"
                :class="[!!values[index] ? 'checked': '', !!readonly ? 'readonly' : '']">{{values[index]}}</span>

          <el-checkbox
            class="answer-item"
            :label="index + 1"
            :name="'answer' + question.id"
            :key="item.id"
            @change="changeItemValue(index, $event)" style="margin-left: -20px; padding-left: 20px">
            {{item.answer}}
          </el-checkbox>

          <template v-if="item.complete">

            <input class="complete" v-model="item.completeValue"/>
            <span class="require-complete" v-if="item.requireComplete">*</span>

          </template>

          <div class="description" v-if="!!item.description && !(!!item.image)" v-html="item.description"></div>

        </li>
        </template>
      </ul>

    </el-checkbox-group>

  </div>

</template>

<script>

    import questionTemplate from "../../js/question.template";

    export default {
        name: "OtherAnswer",
      props: ['question', 'readonly'],
      data: function () {
        return {
          others: questionTemplate.others,
          values: [],
          numb: 0,
        }
      },

      mounted: function () {
          // 初始化数据
        this.values = this.question.userAnswer;
      },
      computed: {

      },
      methods: {

        /**
         * 处理用户选择答案
         * @param type
         */
        changeValue: function(value){

          // 编辑时不处理这个关联问题
          // if(editable) return;

          // 查询哪个问题对我有依赖？？？？？
          // this.$message.info(JSON.stringify(this.question.userAnswer));

            if(this.question.userAnswer.length === this.question.answer.length) {
                this.$emit('handle-forward');
            } else {
                this.$emit('handle-forward-seq', this.question['forward'], true);
            }

        },

        /**
         * 选择每一个项目的时候
         */
        changeItemValue: function(index, value){

          if(this.values.length === 0){
            this.values.length = this.question.answer.length;

          }

          if(value){
            // 选择
            this.numb++;
            this.values.splice(index, 1, this.numb);

          } else {
            // 反选

            if(this.numb >= 1){
              this.numb--;
            }

            let result = this.values[index];
            console.info('result', result);

            this.values.splice(index, 1, null);

            for(let i = 0; i < this.values.length; i++){
              let v = this.values[i];
              if(v < result){
                continue;
              }
              // 已经反选result，将大于result的减1
              if(!!v){
                this.values.splice(i, 1, v-1);
              }

            }
          }
        }
      }
    }
</script>

<style>

  .answer-type-sort span.el-checkbox__input{
    display: none !important;
  }

</style>

<style scoped>

  .answer-item-wrapper {
    display: flex;
    align-items: center;
  }

  .sort-numb{
    font-size: 14px;
    display: inline-block;
    border: 1px solid #DCDFE6;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    position: relative;
    border-radius: 2px;
    text-align: center;
    line-height: 16px;
    color: #fff;
    overflow: hidden;
  }

  .sort-numb.checked{
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .sort-numb.readonly{
    background-color: #edf2fc;
    border-color: #DCDFE6;
    cursor: not-allowed;
    color: #ccc;
  }


</style>
