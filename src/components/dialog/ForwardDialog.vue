<template>

  <span>
    <el-tooltip
      class="item"
      effect="light"
      content="通过配合其他题目的“按选项跳转”实现更复杂的跳转逻辑。"
      placement="bottom">
      <el-link
        icon="el-icon-bottom-right"
        @click="openForwardDialog">跳转逻辑</el-link>
    </el-tooltip>

    <el-tooltip
      v-if="question.forwardType !== 0"
      class="item"
      effect="light"
      content="清除跳转逻辑"
      placement="bottom">
            <el-link
              icon="el-icon-delete"
              @click="cleanForwards"></el-link>
          </el-tooltip>


    <!-- 跳转逻辑 如果选中了指定的选项，需要跳转到其他题目，则将无相关的题目隐藏。-->
    <el-dialog
      title="跳转逻辑"
      :visible.sync="forwardDialogVisible"
      :lock-scroll="false"
      :close-on-click-modal="false">

      <div class="dialog-body" style="background-color: transparent">

        <template v-if="isSingleChoiceQuestion">

          <div class="rows">
            <el-checkbox v-model="question.forwardType"
                         style="margin-right: 0"
                         @change="changeForwardType" :false-label="0" :true-label="2">{{forwardTypes[2]}}</el-checkbox>
            <div v-if="question.forwardType === 2" style="margin-top: 1rem">
              <table class="forward-table" cellpadding="0" cellspacing="0">
                <tr>
                  <th style="width: 8%"></th>
                  <th><div>选项</div></th>
                  <th><div>跳转到</div></th>
                </tr>
                <tr v-for="(item, index) of question.answer">
                  <td><div>选择</div></td>
                  <td><div>{{item.answer}}</div></td>
                  <td><div>
                    <el-select v-model="item.forward"
                               style="width: 100%;">
                      <el-option value="" label="请选择跳转到的题目"></el-option>
                      <el-option :value="0" label="不跳转，按顺序填写下一题"></el-option>
                      <el-option :value="-1" label="跳到问卷末尾结束作答"></el-option>
                      <!--                      <el-option :value="-2" label="直接提交为无效答卷"></el-option>-->
                      <el-option v-for="fq of forwardQuestions"
                                 :key="fq.sequence"
                                 :value="fq.sequence"
                                 :label="fq.sequence + '.' + fq.title.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, '')">
                      </el-option>
                    </el-select>
                  </div></td>
                </tr>
              </table>
            </div>
          </div>

        </template>

        <div class="rows no-condition-forward">
          <el-checkbox v-model="question.forwardType"
                       style="margin-right: 0"
                       @change="changeForwardType" :false-label="0" :true-label="1">{{forwardTypes[1]}}</el-checkbox>
          <span v-if="question.forwardType === 1">，填写此题后跳转到
            <el-select v-model="question.forward" style="width: 400px">
              <el-option value="" label="请选择跳转到的题目"></el-option>
              <el-option :value="-1" label="跳到问卷末尾结束作答"></el-option>
              <el-option v-for="fq of forwardQuestions"
                         :key="fq.sequence"
                         :value="fq.sequence"
                         :label="fq.sequence + '.' + fq.title.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, '')"></el-option>
            </el-select>
          </span>
        </div>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cleanForwards">清除跳转逻辑</el-button>
        <el-button type="primary" @click="closeForwardDialog">确定</el-button>
      </span>

    </el-dialog>
  </span>

</template>

<script>
    export default {
        name: "ForwardDialog",
        props: ['question', "sections", "isSingleChoiceQuestion"],
        data: function () {
            return {
                // =========== 题目跳转 ===============
                // 意思是默认显示，如果选中了指定的选项，需要跳转到其他题目，则将无相关的题目隐藏。
                forwardTypes: ['', '无条件跳转', '按选项跳转'],
                // forwardType: 0, // 跳转类型
                forwardDialogVisible: false,
                // noConditionForward: false, // 无条件跳转
                // optionForward: false, // 按选项跳题
                // forwardAction: '', // 无条件跳转
                // optionForwardAction: [], // 按选项跳转
                forwardQuestions: [], // 可跳转的所有题目
            }
        },

        methods: {
            // ========== 跳转 ======================

            // 是否有跳转逻辑
            hasForward(){

                if(!!this.question.forward) return true;

                if(!!this.question.answer){

                    for(let answer of this.question.answer){
                        if(!!answer.forward){
                            return true;
                        }
                    }

                }

            },

            changeForwardType: function () {

                switch (this.question.forwardType) {
                    case 1:
                        // 无条件跳题

                        if (!!this.question.answer) {

                            for (let answer of this.question.answer) {
                                this.$set(answer, 'forward', '');
                            }

                        }

                        break;
                    case 2:
                        // 按选项跳题

                        this.$set(this.question, 'forward', '');

                        break;
                }


            },

            cleanForwards: function () {

                this.$set(this.question, 'forward', '');
                this.$set(this.question, 'forwardType', 0);

                if (!!this.question.answer) {

                    for (let answer of this.question.answer) {
                        this.$set(answer, 'forward', '');
                    }

                }

            },

            /**
             * 打开跳转逻辑对话框
             */
            openForwardDialog: function () {

                // 获取所有符合的题型，及该题后的所有题目
                // 清空缓存
                this.forwardQuestions.splice(0, this.forwardQuestions.length);

                let start = false;
                let index = 0;

                for (let section of this.sections) {

                    for (let fragment of section.fragments) {

                        if (fragment.type !== 11) {
                            // 不是段落
                            if (fragment.id === this.question.id) {
                                start = true;
                                continue;
                            }

                            // 可跳转的题目
                            if (start === true) {
                                this.forwardQuestions.splice(index++, 0, fragment);
                            }
                        }
                    }

                }

                this.forwardDialogVisible = true;
            },

            /**
             * 关闭跳转逻辑对话框
             * 保存用户选择的数据
             */
            closeForwardDialog: function () {

                if(!!this.question.forwardType){

                    if(this.question.forwardType === 1 && this.question.forward === ''){
                        this.$set(this.question, 'forwardType', 0);
                    } else if(this.question.forwardType === 2){

                        if (!!this.question.answer) {

                            let flag = false;
                            for (let answer of this.question.answer) {
                                if(!!answer.forward) {
                                    flag = true;
                                    break;
                                }
                            }

                            if(!flag) {
                                this.$set(this.question, 'forwardType', 0);
                            }

                        }

                    }

                }


                this.forwardDialogVisible = false;
            },
        }
    }
</script>

<style scoped>

</style>
