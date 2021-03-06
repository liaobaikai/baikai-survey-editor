<!--
  是否为可见状态，如果没有存在依赖关系的话，是可见的。
  如果有依赖关系，在非编辑中是不能显示的，非常符合显示的条件。
-->
<template>

  <div class="survey-preview" v-if="!!ready">

    <div class="header-bg"></div>

    <div class="content">

      <div class="content-wrapper">
        <div v-if="currentPage !== 0">


          <div class="survey-header ql-snow">
            <div class="survey-title" style="word-break: break-word">
              <h3>{{survey.title}}</h3>
            </div>

            <div class="survey-description ql-editor"
                 v-if="!!survey.description && currentPage === 1"
                 v-html="survey.description"></div>

          </div>

          <template v-for="(section, index) of survey.sections">

            <div style="padding: 40px 10px; text-align: center;" v-if="!!readonly">
              <el-divider style="padding: 30px 0"><span style="color: #999999">第{{index + 1}}页</span></el-divider>
            </div>

            <div class="survey-section" :class="[ currentPage === (index + 1) ? 'show': '']" v-if="!!!readonly">

              <template v-for="item of section.fragments">

                <question
                  :id="'sq-'+item.id"
                  v-if="!!item['dependentShow'] || !(!!item.dependent && !!item.dependent.length)"
                  v-show="!!item.hide !== true"
                  :question="item"
                  :showSequence="survey.sequence"
                  :editable="false"
                  :readonly="readonly"
                  :sections="survey.sections"></question>

              </template>

              <div class="pager" style="padding: 40px 20px 100px 20px; text-align: center;">
                <template v-if="index === survey.sections.length - 1">
                  <el-button-group style="display: flex; justify-content: center">
                    <!--<el-button type="primary" style="width: 100px" @click="prevPage">上一步</el-button>-->
                    <el-button type="primary" style="width: 100px" @click="submit">提交</el-button>
                  </el-button-group>
                </template>
                <template v-else>
                  <el-button-group style="display: flex; justify-content: center">
                    <!--<el-button type="primary" style="width: 100px" @click="prevPage" v-if="currentPage !== 1">上一步</el-button>-->
                    <el-button type="primary" style="width: 100px" @click="nextPage">下一步</el-button>
                  </el-button-group>
                </template>
              </div>
            </div>

            <div class="survey-section-list" v-else>
              <!--只读-->

              <template v-for="item of section.fragments">

                <question
                  v-if="!!item['dependentShow'] || !(!!item.dependent && !!item.dependent.length)"
                  v-show="!!item.hide !== true"
                  :question="item"
                  :showSequence="survey.sequence"
                  :editable="false"
                  :readonly="readonly"
                  :sections="survey.sections"></question>

              </template>

            </div>
          </template>

          <div style="height: 100px" v-if="!!readonly"></div>

        </div>
        <div v-else style="min-height: 400px" class="ql-snow">
          <template v-if="answerFinish">
            <div class="ql-editor" v-html="survey.submitText"></div>
          </template>
        </div>
      </div>
    </div>

  </div>


</template>

<script>
    import Question from "./Question";
    import QuestionTemplate from '../js/question.template';

    export default {
        name: "Preview",
        components: {Question},
        props: ['survey', 'validation', 'readonly', 'answerFinish',
            'showLoading',
            'loadingBackground', 'loadingText', 'loadingIcon'],
        data: function () {
            return {
                currentPage: 1, // 当前页

                hideCausedBy: '', // 隐藏的原因

                questionTemplate: QuestionTemplate,
                editable: false,
                ready: false,
                loading: null,
            }
        },

        watch: {
            answerFinish: {
                handler: function (newVal, oldVal) {
                    console.info('answerFinish', newVal, oldVal);

                    if (newVal === true) {

                        this.currentPage = 0;

                        if (this.survey.submitAction === 2) {
                            location.href = this.survey.submitForward;
                        }

                        if (!!this.loading)
                            this.loading.close();

                    }

                },
                immediate: true
            },
            showLoading: {
                handler: function (newVal, oldVal) {
                    if (newVal === false) {
                        if (!!this.loading)
                            this.loading.close();
                    }
                },
                immediate: true
            }
        },

        created() {

            console.info('preview.create.survey', this.survey);

            for (let section of this.survey.sections) {
                for (let fragment of section['fragments']) {
                    if (!!fragment.userAnswer && typeof fragment.userAnswer === 'string' && fragment.userAnswer.substring(0, 1) === '[')
                    // 如果是填空题的话，会解析失败
                        try {
                            this.$set(fragment, 'userAnswer', JSON.parse(fragment.userAnswer));
                        } catch (e) {
                            console.info('估计是填空题');
                            console.info(e)
                        }

                    if (!!fragment.vertical && typeof fragment.vertical === 'string')
                        this.$set(fragment, 'vertical', JSON.parse(fragment.vertical));
                    if (!!fragment.horizontal && typeof fragment.horizontal === 'string')
                        this.$set(fragment, 'horizontal', JSON.parse(fragment.horizontal));
                    if (!!fragment.dependent && typeof fragment.dependent === 'string')
                        this.$set(fragment, 'dependent', JSON.parse(fragment.dependent));

                }

                this.ready = true;

            }

        },
        methods: {

            invalidFragment: function (fragment, msg) {
                this.$set(fragment, 'invalid', true);

                let _msg = '';
                if (fragment.type === this.questionTemplate.completionQuestion.single.type) {
                    // 单项填空
                    _msg = '请填空！';
                } else if (fragment.type === this.questionTemplate.completionQuestion.matrix.type
                    || fragment.type === this.questionTemplate.completionQuestion.table.type) {
                    // 多项填空，表格填空
                    _msg = '请按选项填空！';
                } else {
                    _msg = '请选择选项！';
                }

                this.$set(fragment, 'invalidMsg', !!msg ? msg : _msg);

            },

            validFragment: function (fragment) {
                this.$delete(fragment, 'invalid');
                this.$delete(fragment, 'invalidMsg');
                this.$set(fragment, 'completed', true);
            },

            /**
             * 验证填空题
             */
            checkCompletionQuestion(fragment, userAnswer, answerObj){

                let len = userAnswer.length;
                if(!!answerObj.dataMin && len < answerObj.dataMin){
                    this.invalidFragment(fragment, '至少填写' + answerObj.dataMin + '个字符！');
                    return false;
                } else if(!!answerObj.dataMax && len > answerObj.dataMax){
                    this.invalidFragment(fragment, '至多填写' + answerObj.dataMax + '个字符！');
                    return false;
                } else if(len < 1){
                    // 默认最少一个字符
                    this.invalidFragment(fragment);
                    return false;
                }

                // 符合。
                this.validFragment(fragment);
                return true;

            },

            /**
             * 检查用户答案
             */
            checkUserAnswer: function () {

                // 检查题目的答案
                let fragments = this.survey.sections[this.currentPage - 1]['fragments'];


                for (let index = 0; index < fragments.length; index++) {

                    let fragment = fragments[index];

                    // 跳转隐藏的，可以忽略
                    if (!!fragment['hide']) {
                        this.hideCausedBy = fragment['hideCausedBy'];
                        continue;
                    }
                    // 有依赖的问题，可以忽略
                    if (!!fragment.dependent && fragment.dependent.length > 0) {
                        // 有依赖的问题，显示后，需要验证
                        if (!(!!fragment['dependentShow'])) {
                            continue;
                        }
                    }

                    // 如果不是必答题，可以忽略
                    if (fragment.requireAnswer === 0) {
                        continue;
                    }

                    // 如果是段落的话，则不检查。
                    if (fragment.type === this.questionTemplate.plugin.paragraph.type) {
                        continue;
                    }

                    if (!!!this.validation) continue;


                    let selected, len = 0, flag = false;
                    switch (fragment.type) {
                        case this.questionTemplate.completionQuestion.single.type:
                            // 单项填空题
                            // ''
                            this.checkCompletionQuestion(fragment, fragment.userAnswer || '', fragment);
                            break;
                        case this.questionTemplate.completionQuestion.matrix.type:
                            // 矩阵填空
                            // ['', '', '']
                            //
                            len = fragment.answer.length;
                            for(let i = 0; i < len; i++){
                                let answerObj = fragment.answer[i];
                                let answer = fragment.userAnswer[i] || '';

                                if(!this.checkCompletionQuestion(fragment, answer, answerObj)){
                                    break;
                                }
                            }
                            break;
                        case this.questionTemplate.completionQuestion.table.type:
                            // 表格填空
                            len = fragment.vertical.length;
                            const len2 = fragment.answer.length;

                            for(let i = 0; i < len; i++){
                                if(flag){
                                    break;
                                }
                                let answerObj = fragment.answer[i];
                                let userAnswer = fragment.userAnswer[i];

                                for(let j = 0; j < len2; j++){
                                    if(userAnswer && typeof userAnswer === 'object'){
                                        if(!this.checkCompletionQuestion(fragment, userAnswer[j] || '', answerObj)){
                                            flag = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            break;

                        case this.questionTemplate.choiceQuestion.single.type:
                        case this.questionTemplate.choiceQuestion.list.type:
                        case this.questionTemplate.choiceQuestion.scoreSingle.type:
                            case this.questionTemplate.scoreQuestion.single.type:
                            // 单项选择题、下拉题、评分单选、单项评分
                            // ''
                            if(parseInt(fragment.userAnswer || 0) > 0){
                                this.validFragment(fragment);
                            } else {
                                this.invalidFragment(fragment);
                            }
                            break;
                        case this.questionTemplate.choiceQuestion.multiple.type:
                        case this.questionTemplate.choiceQuestion.scoreMultiple.type:
                        case this.questionTemplate.others.sort.type:
                            // 多项选择题
                            // 评分多选
                            // 排序题

                            // []
                            // !!最小，最大选择

                            selected = fragment.userAnswer.filter(item => typeof item === 'number' && item > 0);
                            if(!!fragment.minAnswer && selected.length < fragment.minAnswer){
                                // 小于最小值
                                this.invalidFragment(fragment, '至少选择' + fragment.minAnswer + '个选项！');
                            } else if(!!fragment.maxAnswer && selected.length > fragment.maxAnswer){
                                this.invalidFragment(fragment, '至多选择' + fragment.maxAnswer + '个选项！');
                            } else if(selected.length < 1){
                                // 默认至少选中一项、
                                this.invalidFragment(fragment);
                            } else {
                                // 有效的
                                this.validFragment(fragment);
                            }

                            break;
                        case this.questionTemplate.matrixQuestion.single.type:
                            // 矩阵单选
                            // []
                            selected = fragment.userAnswer.filter(item => typeof item === 'number' && item > 0);
                            if (selected.length !== fragment.vertical.length) {
                                this.invalidFragment(fragment);
                            } else {
                                this.validFragment(fragment);
                            }
                            break;

                        case this.questionTemplate.scoreQuestion.multiple.type:
                            // 多项评分题
                            // [0, 0]
                            selected = fragment.userAnswer.filter(item => item > 0);
                            if (selected.length !== fragment.vertical.length) {
                                this.invalidFragment(fragment);
                            } else {
                                this.validFragment(fragment);
                            }
                            break;
                        case this.questionTemplate.matrixQuestion.multiple.type:
                            // 矩阵多选
                            // [[1,2,3,4], [1,2,3,4]]
                        case this.questionTemplate.matrixQuestion.score.type:
                            // 矩阵评分
                            // [[1,4,5,5,5], [5,5,5,5,5]]
                            len = fragment.vertical.length;
                            for(let i = 0; i < len; i++){
                                let answer = fragment.userAnswer[i];
                                selected = answer.filter(item => item > 0);
                                if (selected.length !== fragment.horizontal.length) {
                                    this.invalidFragment(fragment);
                                    break;
                                } else {
                                    this.validFragment(fragment);
                                }
                            }

                            break;

                    }


                    // switch (typeof fragment.userAnswer) {
                    //     case 'string':
                    //         // 字符串
                    //         if (!!fragment.userAnswer) {
                    //             this.validFragment(fragment);
                    //         } else {
                    //             this.invalidFragment(fragment);
                    //         }
                    //         break;
                    //     case 'number':
                    //         // 数字
                    //         if (fragment.userAnswer > 0) {
                    //             this.validFragment(fragment);
                    //         } else {
                    //             this.invalidFragment(fragment);
                    //         }
                    //         break;
                    //     case 'object':
                    //         // 数组
                    //         if (!!fragment.userAnswer) {
                    //             let len = fragment.userAnswer.length;
                    //             // 没选择
                    //             if (len === 0) {
                    //                 this.invalidFragment(fragment);
                    //             } else {
                    //                 // 有选择，但不符合
                    //                 if (!!fragment.minAnswer) {
                    //                     // 最小选择
                    //                     if (len < fragment.minAnswer) {
                    //                         this.invalidFragment(fragment, '至少选择' + fragment.minAnswer + '个选项！');
                    //                         break;
                    //                     } else {
                    //                         this.validFragment(fragment);
                    //                     }
                    //                 }
                    //
                    //                 if (!!fragment.maxAnswer) {
                    //                     // 最多选择
                    //                     if (len > fragment.maxAnswer) {
                    //                         this.invalidFragment(fragment, '至多选择' + fragment.maxAnswer + '个选项！');
                    //                         break;
                    //                     } else {
                    //                         this.validFragment(fragment);
                    //                     }
                    //                 }
                    //
                    //
                    //                 // if (typeof fragment.userAnswer[0] === 'number') {
                    //                 //
                    //                 //     // 判断是否是矩阵单选
                    //                 //     if(fragment.type === this.questionTemplate.matrixQuestion.single.type){
                    //                 //
                    //                 //         let flag = false;
                    //                 //         for(let x = 0; x < fragment.vertical.length; x++){
                    //                 //              if(!!!fragment.userAnswer[x] || fragment.userAnswer[x] instanceof Array){
                    //                 //                  flag = true;
                    //                 //                  break;
                    //                 //              }
                    //                 //         }
                    //                 //
                    //                 //         if(!!flag){
                    //                 //             this.invalidFragment(fragment);
                    //                 //         } else {
                    //                 //             this.validFragment(fragment);
                    //                 //         }
                    //                 //
                    //                 //         break;
                    //                 //     }
                    //                 //
                    //                 //
                    //                 //     this.validFragment(fragment);
                    //                 //
                    //                 //     break;
                    //                 // }
                    //
                    //
                    //                 let columns = 0, rows = 0;
                    //                 if (!!fragment.answer) {
                    //                     columns = fragment.answer.length;
                    //                 } else if (!!fragment.horizontal) {
                    //                     columns = fragment.horizontal.length;
                    //                 }
                    //
                    //                 if (!!fragment.vertical) {
                    //                     rows = fragment.vertical.length;
                    //                 }
                    //
                    //
                    //                 // 评分题
                    //                 if (fragment.type === this.questionTemplate.scoreQuestion.single.type) {
                    //                     // 单项评分题
                    //                     if (fragment.userAnswer === 0) {
                    //                         this.invalidFragment(fragment);
                    //                     } else {
                    //                         this.validFragment(fragment);
                    //                     }
                    //
                    //                 } else if (fragment.type === this.questionTemplate.scoreQuestion.multiple.type) {
                    //                     // 多项评分题
                    //
                    //                     let unselect = fragment.userAnswer.filter(item => item === 0);
                    //                     if (unselect.length !== fragment.userAnswer.length) {
                    //                         this.invalidFragment(fragment);
                    //                     } else {
                    //                         this.validFragment(fragment);
                    //                     }
                    //
                    //                 } else if (fragment.type === this.questionTemplate.matrixQuestion.multiple.type
                    //                     || fragment.type === this.questionTemplate.matrixQuestion.score.type) {
                    //
                    //                     // 矩阵单选 & 矩阵多选
                    //
                    //                     for (let i = 0; i < rows; i++) {
                    //
                    //                         try {
                    //
                    //                             let result = fragment.userAnswer[i];
                    //
                    //                             if (!!!result || !!!result.length) {
                    //                                 this.invalidFragment(fragment);
                    //                             } else {
                    //
                    //                                 if (fragment.type === this.questionTemplate.matrixQuestion.score.type
                    //                                     && result.length !== columns) {
                    //                                     this.invalidFragment(fragment);
                    //                                 } else {
                    //                                     this.validFragment(fragment);
                    //                                 }
                    //
                    //                             }
                    //
                    //                         } catch (e) {
                    //                             this.invalidFragment(fragment);
                    //                         }
                    //                     }
                    //
                    //
                    //                 } else {
                    //
                    //                     for (let i = 0; i < columns; i++) {
                    //
                    //                         for (let j = 0; j < rows; j++) {
                    //
                    //                             try {
                    //
                    //
                    //                                 let result = fragment.userAnswer[j][i];
                    //
                    //
                    //                                 if (!!!result || !!!result.length) {
                    //                                     this.invalidFragment(fragment);
                    //
                    //                                 } else {
                    //                                     this.validFragment(fragment);
                    //
                    //                                 }
                    //                             } catch (e) {
                    //                                 this.invalidFragment(fragment);
                    //
                    //                             }
                    //
                    //                         }
                    //
                    //                         if (rows > 0) continue;
                    //
                    //
                    //                         try {
                    //
                    //
                    //                             if (!!!fragment.userAnswer[i]
                    //                                 || !!!fragment.userAnswer[i].length) {
                    //                                 this.invalidFragment(fragment);
                    //
                    //                             } else {
                    //                                 this.validFragment(fragment);
                    //
                    //                             }
                    //                         } catch (e) {
                    //                             this.invalidFragment(fragment);
                    //
                    //                         }
                    //
                    //                     }
                    //
                    //                 }
                    //
                    //             }
                    //
                    //         } else {
                    //             this.invalidFragment(fragment);
                    //
                    //         }
                    //
                    //         break;
                    //
                    // }

                }

                for (let f of fragments) {

                    if (!!f.invalid) {

                        let ele = document.getElementById('sq-' + f.id);

                        if (ele.style.display === 'none') {
                            continue;
                        }

                        document.documentElement.scrollTop = ele.offsetTop;

                        return false;
                    } else {

                        if (!!f['userAnswer'])
                            f['userAnswer2'] = JSON.stringify(f['userAnswer']);
                    }
                }


                return true;

            },

            nextPage: function () {

                if (!this.checkUserAnswer()) return;

                if (this.hideCausedBy === 'finish' || this.hideCausedBy === 'discard') {

                    this.currentPage = this.survey.sections.length;
                    this.$emit('next-page', this.currentPage);

                } else {

                    this.$emit('next-page', this.currentPage);
                    this.currentPage++;

                }

                document.documentElement.scrollTop = 0;

            },


            // prevPage: function(){
            //   this.currentPage--;
            //
            //   document.documentElement.scrollTop = 0;
            // },

            /**
             * 提交
             */
            submit: function () {

                if (!this.checkUserAnswer()) return;

                console.info(this.survey);

                this.$emit('submit', JSON.stringify(this.survey));

                if (!!this.showLoading) {

                    this.loading = this.$loading({
                        lock: true,
                        text: this.loadingText || 'Loading',
                        spinner: this.loadingIcon || 'el-icon-loading',
                        background: this.loadingBackground || 'rgba(0, 0, 0, 0.7)'
                    });

                }

            }
        }
    }
</script>

<style>


  .survey-preview {
    width: 100%;
    overflow: hidden;
  }

  .survey-preview .question-preview {
    padding: 2rem 10px 1rem 10px;
  }

  /*.survey-preview .question .answer-type-sort ul,*/
  /*.survey-preview .question .answer-type-choice ul{*/
  /*min-height: auto;*/
  /*}*/


  .survey-preview .question-preview:hover {
    background-color: initial;
  }

  .survey-preview .question-answer {
    margin-left: 10px;
    margin-right: 10px;
  }


  .survey-preview.phone .progress {
    position: absolute;
    left: 18px;
    right: 38px;
    top: 40px;
    z-index: 999;
  }

  .survey-preview .question {
    margin: 10px;
  }


  @media screen and (min-width: 320px) and (max-width: 768px) {

    .survey-preview .header-bg {
      background-color: rgb(191, 231, 201);
    }

    .survey-preview .question-answer .el-textarea,
    .survey-preview .question-answer .el-select {
      width: 100% !important;
    }

    .survey-preview .content .survey-header {

    }

    .survey-preview .content .survey-header .survey-title {
      padding: 26px 10px 12px;
    }

    .survey-preview .content .survey-header .survey-description {
      padding: 10px 0 26px;
      border-bottom: 1px dashed #ccc;
      margin: 0 10px 16px;
    }

    .survey-preview .question {
      border: 1px #eee solid;
      margin: 10px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, .1);
    }

    .survey-preview .question-preview {
      padding: 0.5rem 10px 0.5rem 10px !important;
    }

    .survey-preview .question ul li .answer-item.el-input {
      width: 100% !important;
    }

    .pager {
      padding: 40px 20px !important;
    }
  }


</style>

<style scoped>

  @media screen and (min-width: 320px) and (max-width: 480px) {
    .survey-preview {
      margin: 0 auto;
    }

    .survey-preview .question-answer .el-textarea,
    .survey-preview .question-answer .el-select {
      width: 100% !important;
    }

  }

  @media only screen and (min-width: 321px) and (max-width: 900px) {
    .survey-preview {
      margin: 0 auto;
    }
  }

  @media only screen and (min-width: 900px) {
    #app {
      background-color: #f5f5f5;
    }

    .survey-preview {

    }

    .survey-preview .content {
      background-color: #fff;
      overflow: hidden;
      width: 900px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0px 1px 6px 0px rgba(205, 220, 245, 1);
    }

    .survey-preview .content .content-wrapper {
      padding: 0 100px;
    }

    .survey-preview .content .survey-header {
      padding: 40px 16px 0px;
    }

    .survey-preview .content .survey-header .survey-title {
      padding: 15px 0;
      font-size: 24px;
    }

    .survey-preview .content .survey-header .survey-description {
      padding: 0 0 15px 0;
      border-bottom: 1px dashed #ccc;
      margin-top: 20px;
      line-height: 24px;
    }

    .survey-preview {
      background: rgb(191, 231, 201);
    }

    .survey-preview .header-bg {
      height: 100px;
    }

    .survey-preview .question {
      border-top: 1px solid transparent;
    }

  }

  .survey-preview {
    margin: 0 auto;
    overflow: hidden;
  }

  .survey-header .survey-title {
    text-align: center;
  }


  /*.survey-preview .content::-webkit-scrollbar {*/
  /*width: 0;*/
  /*}*/

  .survey-section {
    display: none;
  }

  .survey-section.show {
    display: block;
  }

</style>
