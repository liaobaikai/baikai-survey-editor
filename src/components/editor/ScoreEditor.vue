
<!--
评分题 编辑器
单项评分，多项评分
-->
<template>

  <div>

    <!-- 答案选项 -->
    <div class="options">

      <table>

        <thead>
          <tr>
            <td class="option-input"><div>选项文字</div></td>
            <td class="option-oper" v-if="isMultiple"><div>操作</div></td>
            <td class="option-move" v-if="isMultiple"><div>上移/下移</div></td>
          </tr>
        </thead>

        <tbody>

          <tr v-for="(item, optionIndex) in question.vertical">
            <td class="option-input">
              <div>
                <el-input
                  v-model="question.vertical[optionIndex]"
                  maxlength="50"
                  show-word-limit
                  @change="changeOptionText(question.vertical[optionIndex], optionIndex)"/>
              </div>
            </td>


            <td class="option-oper" v-if="isMultiple">
              <div>
                <span title="在此选项后添加选项" class="design-icon el-icon-plus" @click="addOption(optionIndex)"></span>
                <span title="删除选项" class="design-icon el-icon-minus" @click="removeOption(optionIndex)"></span>
              </div>
            </td>

            <td class="option-move" v-if="isMultiple">
              <div>
                <span class="design-icon el-icon-top" @click="optionMoveUp(optionIndex)"></span>
                <span class="design-icon el-icon-bottom" @click="optionMoveDown(optionIndex)"></span>
              </div>
            </td>

          </tr>

        </tbody>

      </table>

    </div>


  </div>
    
</template>

<script>

    import questionTemplate from "../../js/question.template";

    export default {
        name: "ScoreEditor",
      props: ['question'],
      data: function () {
        return {
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
        /**
         * 修改选项文本
         *
         */
        changeOptionText: function(option, index){

          if(this.question.type === this.scoreQuestion.single.type) return;

          for(let i = 0, len = this.question.vertical.length; i < len; i++){
            let v = this.question.vertical[i];

            if(i !== index && v === option){
              this.$message.error('选项不能有重复，请修改！');
              break;
            }
          }

        },

        /**
         * 添加
         */
        addOption: function(index){
          this.question.vertical.splice(index + 1, 0, '选项');
        },

        /**
         * 删除
         */
        removeOption: function(index){
          if(this.question.vertical.length === 1) {
            this.$message.error('请至少保留1个选项。');
            return;
          }

          this.question.vertical.splice(index, 1);
        },

        /**
         * 上移
         */
        optionMoveUp: function(index){

          if(index === 0){
            this.$message.error('第一个选项不能上移');
            return;
          }

          let tmp = this.question.vertical[index - 1]; // 获取上一个选项
          this.$set(this.question.vertical, index - 1, this.question.vertical[index]);  // 将上一个选项设置为当前的选项
          this.$set(this.question.vertical, index, tmp); // 设置当前的选项为上一个选项

        },

        /**
         * 下移
         * @param index
         */
        optionMoveDown: function(index){

          if(index === this.question.vertical.length - 1){
            this.$message.error('最后一个选项不能下移');
            return;
          }


          let tmp = this.question.vertical[index + 1]; // 获取下一个选项
          this.$set(this.question.vertical, index + 1, this.question.vertical[index]);  // 将下一个选项设置为当前的选项
          this.$set(this.question.vertical, index, tmp); // 设置当前的选项为下一个选项

        }

      },

    }
</script>

<style scoped>

</style>
