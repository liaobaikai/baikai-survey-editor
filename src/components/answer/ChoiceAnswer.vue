<template>

  <!--
  单选题
  多选题
  下拉题
  评分单选
  评分多选

  -->

  <div class="answer-type-choice">

    <!-- 单选题 和 评分单选 -->
    <template v-if="isSingleChoice || isScoreSingleChoice">

      <el-radio-group
        v-model="question.userAnswer"
        @change="changeValue" :disabled="!!readonly">

        <!-- 每一行一个ul -->
        <ul v-for="page of (Math.ceil(question.answer.length / question.columns))" :key="page">

          <template v-for="(item, index) in question.answer">
            <li class="answer-item-wrapper ql-snow"
                v-if="(page - 1) * question.columns <= index && index < page * question.columns"
                :style="{ width: (100 / question.columns) + '%', display: item.complete ? 'flex': 'block'}">

              <div v-if="item.description && item.image">

                <img src="item.image" style="width: 100%"/>
                <div v-html="item.description"></div>

              </div>

              <el-radio
                class="answer-item"
                :label="index + 1"
                :name="'answer' + question.id"
                :key="item.id"
              >
                {{item.answer}}
                <span style="color:#ff6600;" v-if="editable && !!item.forward">
                  <!--
                  '' : 请选择跳转到的题目
                  '0' : 不跳转，按顺序填写下一题
                  '1' : 跳到问卷末尾结束作答
                  '-1' : 直接提交为无效答卷
                  -->
                  <template v-if="item.forward === -1">(结束作答)</template>
                  <template v-else-if="item.forward === 1">(结束作答)</template>
                  <template v-else-if="item.forward > 1">(跳转到第{{item.forward}}题)</template>
                </span>

                <!-- 单选评分题 -->
                <span style="color:#efa030; font-weight: normal" v-if="editable && isScoreSingleChoice">
                  (分值: {{item.score}})
                </span>

              </el-radio>

              <template v-if="item.complete">

                <input class="complete" v-model="item.completeValue"/>
                <span class="require-complete" v-if="item.requireComplete">*</span>

              </template>

              <div class="description ql-editor" v-if="!!item.description && !(!!item.image)"
                   v-html="item.description"></div>

            </li>

          </template>
        </ul>


      </el-radio-group>

    </template>

    <template v-else-if="isMultipleChoice || isScoreMultipleChoice">

      <!-- 多选题 -->
      <el-checkbox-group
        v-model="question.userAnswer"
        :max="!!question.maxAnswer ? question.maxAnswer : question.answer.length"
        @change="changeValue" :disabled="!!readonly">

        <ul v-for="page of (Math.ceil(question.answer.length / question.columns))" :key="page">

          <template v-for="(item, index) in question.answer">

            <li class="answer-item-wrapper"
                v-if="(page - 1) * question.columns <= index && index < page * question.columns"
                :style="{ width : (100 / question.columns) + '%'}"
                :class="[ item.description && item.image ? 'img-desc' : '' ]">

              <div v-if="item.description && item.image">

                <img class="image" :src="item.image" style="width: 100%"/>
                <div class="description" v-html="item.description"></div>

              </div>

              <el-checkbox
                class="answer-item"
                :label="index + 1"
                :name="'answer' + question.id"
                :class="{ textAlign: (item.description && item.image ? 'center': 'left') }"
                :key="item.id">
                {{item.answer}}
                <!-- 多选评分题 -->
                <span style="color:#efa030; font-weight: normal" v-if="editable && isScoreMultipleChoice">
                  (分值: {{item.score}})
                </span>
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

    </template>

    <!--下拉选择题-->
    <template v-else-if="isList">

      <ul>
        <li class="answer-item-wrapper" style="width: 100%">

          <el-select
            v-model="question.userAnswer"
            :placeholder="question.checked"
            @change="changeValue" :disabled="!!readonly">

            <el-option
              v-for="(item,index) in question.answer"
              :key="item.id"
              :label="item.answer"
              :value="index+1"></el-option>

          </el-select>

        </li>
      </ul>

    </template>

  </div>


</template>

<script>
    import questionTemplate from "../../js/question.template";

    export default {
        name: "ChoiceAnswer",
        props: ['question', 'editable', 'sections', 'readonly'],
        data: function () {
            return {
                choiceQuestion: questionTemplate.choiceQuestion,
                // plugin: questionTemplate.plugin,
                // fileList: [],
                // factor: 0
                lastValue: '',
            }
        },


        mounted: function () {
        },

        computed: {

            // 单选题
            isSingleChoice: function () {
                return this.question.type === this.choiceQuestion.single.type;
            },
            // 评分单选题
            isScoreSingleChoice: function () {
                return this.question.type === this.choiceQuestion.scoreSingle.type;
            },
            // 多选题
            isMultipleChoice: function () {
                return this.question.type === this.choiceQuestion.multiple.type;
            },

            // 多选题
            isScoreMultipleChoice: function () {
                return this.question.type === this.choiceQuestion.scoreMultiple.type;
            },

            // 下拉题
            isList: function () {
                return this.question.type === this.choiceQuestion.list.type;
            }

        },

        methods: {


            // getUserAnswer: function(){
            //
            //   let userAnswer = this.question.userAnswer;
            //
            //   if(typeof userAnswer === 'number' || typeof userAnswer === 'string'){
            //
            //   } else if(typeof userAnswer === 'object'){
            //
            //   }
            //
            // },

            /**
             * 跳转到指定的序号
             */
            // forwardSequence: function (sequence, reset) {
            //
            //     for (let sections of this.sections) {
            //         //
            //         for (let fragment of sections['fragments']) {
            //
            //             // 重置
            //             if (!!reset) {
            //
            //                 if (fragment.sequence > this.question.sequence && (fragment.sequence < sequence || sequence === -1) /*跳到问卷末尾结束作答*/) {
            //
            //                     this.$delete(fragment, 'hide');
            //                     this.$delete(fragment, 'hideCausedBy');
            //
            //                 }
            //
            //             } else {
            //
            //                 // 设置
            //                 // question=1    hide=2   sequence=3
            //                 // question=1    hide=2,3   sequence=4
            //                 // question=1    hide=2,3,4   sequence=5
            //                 if (fragment.sequence > this.question.sequence && (fragment.sequence < sequence || sequence === -1)/*跳到问卷末尾结束作答*/) {
            //
            //                     this.$set(fragment, 'hide', true);
            //
            //                     if (sequence === -2) {
            //                         // 直接提交为无效答卷
            //                         this.$set(fragment, 'hideCausedBy', 'discard');
            //                     } else if (sequence === -1) {
            //                         // 跳到问卷末尾结束作答
            //                         this.$set(fragment, 'hideCausedBy', 'finish');
            //                     } else {
            //                         // 范围
            //                         this.$set(fragment, 'hideCausedBy', 'range');
            //                     }
            //
            //                     // 重置答案
            //                     this.$emit('reset-answer', fragment);
            //
            //
            //                     console.info('hide', fragment);
            //
            //                 }
            //
            //             }
            //         }
            //     }
            //
            // },
            //
            // /**
            //  * 处理跳转
            //  */
            // handleForward: function () {
            //
            //     console.info('handleForward', this.sections);
            //
            //     // 判断是否有跳题
            //     // 如果有跳题的话，需要将两题之间的题目隐藏
            //     if (!!this.question.forwardType) {
            //
            //         // 如果不是默认的跳题类型，则需要跳题，
            //         if (this.question.forwardType === 1) {
            //             // 无条件跳转，
            //             // this.question.forward <===> question.sequence
            //
            //             // 跳转到指定的题号
            //             this.forwardSequence(this.question.forward);
            //
            //
            //         } else if (this.question.forwardType === 2) {
            //             // 选项跳转
            //             // this.question.answer.forward <===> question.sequence
            //
            //
            //             // 清空选中的情况
            //             if (!!this.lastValue) {
            //                 // lastValue = index + 1;
            //                 let answer = this.question.answer[this.lastValue - 1];
            //                 if (!!answer['forward']) {
            //                     // 清空当前的值到上一次的
            //                     this.forwardSequence(answer['forward'], true);
            //                 }
            //             }
            //
            //
            //             // 跳转到指定的题号
            //             for (let i = 0; i < this.question.answer.length; i++) {
            //
            //                 let answer = this.question.answer[i];
            //
            //                 if ((i + 1) === this.question.userAnswer && !!answer.forward) {
            //                     //
            //                     this.forwardSequence(answer.forward);
            //                     break;
            //
            //                 } else {
            //
            //                     this.forwardSequence(answer.forward, true);
            //                 }
            //
            //             }
            //         }
            //
            //     } else {
            //
            //         this.forwardSequence(undefined, true);
            //
            //     }
            //
            // },

            /**
             * 处理依赖
             */
            handleDependent: function () {

                // 对依赖的问题进行显示。。。
                for (let sections of this.sections) {
                    //
                    for (let fragment of sections['fragments']) {

                        // 段落
                        // if(fragment.type === this.plugin.paragraph.type){
                        //   continue;
                        // }

                        // this.$delete(fragment, 'dependentShow');

                        // 当前问题跳过
                        if (fragment.id === this.question.id) {
                            continue;
                        }

                        // 判断是否有依赖
                        if (!!fragment.dependent && !!fragment.dependent.length) {

                            // fragment依赖于这些问题
                            // 获取依赖的所有问题

                            // dq => {combo, question, selectIndex, selectOptions, title}
                            for (let dq of fragment.dependent) {

                                // fragment.dependent.question == null | undefined | []

                                if (!!!dq.question) {
                                    continue;
                                }

                                if (dq.question.sequence === this.question.sequence) {
                                    // 依赖的问题是this.question

                                    // 判断this.question.userAnswer和dq.selectOptions是否含有交叉点
                                    // 如果有，则说明可以显示fragment，

                                    if (typeof this.question.userAnswer === 'object') {

                                        let result = this.question.userAnswer.filter(function (v) {
                                            return dq.selectOptions.indexOf(v) !== -1;
                                        });

                                        console.info('result', result);

                                        if (result.length > 0) {
                                            // 有交集，说明至少有一个是正确的（有依赖的）
                                            if (dq.combo === 0) {

                                                this.$set(dq, 'checked', 1);

                                            } else if (dq.combo === '1') {
                                                // 全选中
                                                if (result.length === dq.selectOptions.length) {
                                                    this.$set(dq, 'checked', 1);
                                                } else {
                                                    this.$delete(dq, 'checked');
                                                }
                                            }
                                        } else {
                                            // 没有交集，说明没有匹配的答案
                                            this.$delete(dq, 'checked');

                                        }

                                    } else {

                                        let flag = false;
                                        for (let option of dq.selectOptions) {

                                            if (option === this.question.userAnswer) {

                                                // dq.checked = true;
                                                this.$set(dq, 'checked', 1);
                                                flag = true;
                                                break;
                                            }
                                        }

                                        if (!flag) {

                                            this.$delete(dq, 'checked');
                                        }

                                    }


                                    let arr = [];
                                    for (let dq2 of fragment.dependent) {

                                        if (!!dq2.checked) {
                                            arr.push(arr);
                                        }

                                    }

                                    if (!!fragment.dependentVisible) {
                                        // 且

                                        if (arr.length === fragment.dependent.length) {
                                            if (!!!fragment['dependentShow']) {
                                                console.info("且====》", fragment.sequence, fragment.title, '设置dependentShow');
                                                this.$set(fragment, 'dependentShow', true);
                                            }
                                        } else {
                                            if (!!fragment['dependentShow']) {
                                                console.info("且====》", fragment.sequence, fragment.title, '删除dependentShow');
                                                this.$delete(fragment, 'dependentShow');
                                            }
                                        }


                                    } else {
                                        // 或
                                        if (arr.length >= 1) {
                                            if (!!!fragment['dependentShow']) {
                                                console.info("或====》", fragment.sequence, fragment.title, '设置dependentShow');
                                                this.$set(fragment, 'dependentShow', true);
                                            }
                                        } else {
                                            if (!!fragment['dependentShow']) {
                                                console.info("或====》", fragment.sequence, fragment.title, '删除dependentShow');
                                                this.$delete(fragment, 'dependentShow');
                                            }
                                        }

                                    }


                                }


                            }


                        }

                    }

                }

            },


            /**
             * 处理用户选择答案
             * @param type
             */
            changeValue: function (value) {

                console.info('value:', value);
                console.info('lastValue:', this.lastValue);


                // 编辑时不处理这个关联问题
                // if(editable) return;

                // 查询哪个问题对我有依赖？？？？？

                // let userAnswer = this.getUserAnswer();
                // console.info(userAnswer);

                this.$emit('change-value', this.question);


                // this.handleForward();
                this.$emit('handle-forward');
                this.handleDependent();


                // 上一次选中的值
                this.lastValue = value;

            },


            // beforeRemove: function(file, fileList){
            //   return this.$confirm(`确定移除 ${ file.name }？`);
            // },
            // handleRemove: function(file, fileList){
            //   console.log(file, fileList);
            // },
            // handlePreview: function(){
            //   console.log(file);
            // },
            // handleExceed(files, fileList) {
            //   this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            // },
        }
    }
</script>

<style scoped>


</style>
