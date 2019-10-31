<template>

  <span>

    <el-tooltip
            v-if="!!question.dependent && question.dependent.length > 0"
            class="item"
            effect="light"
            content="清除关联"
            placement="bottom">
            <el-link
              icon="el-icon-delete"
              @click="cleanDependents"></el-link>
          </el-tooltip>

    <el-tooltip
            class="item"
            effect="light"
            content="此题依赖于某一题哪个选项才显示这题"
            placement="bottom">
            <el-link
              icon="el-icon-connection"
              @click="openDependentDialog">题目关联</el-link>
          </el-tooltip>



    <!-- 题目依赖，题目关联，意思是指 默认隐藏，如果依赖的题目选中了指定的选项，则显示 -->
    <el-dialog
      title="题目关联"
      :visible.sync="dependentDialogVisible"
      :lock-scroll="false"
      :close-on-click-modal="false">

      <div>

        <div class="dialog-body">

          <div class="rows">
            <label style="min-width: 90px; width: 90px;">当前题目：</label>
            <span>
              <template v-if="question.sequence">
                {{question.sequence}}.
              </template>
              {{question.title.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, '')}}
            </span>
          </div>

          <div class="rows" v-for="(dq, index) of dependentQuestions" :key="index">
            <div>
              <label style="min-width: 90px; width: 90px;">{{dq.title.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, '')}}{{index + 1}}：</label>
              <span>
                <el-select
                  v-model="dq.selectIndex"
                  placeholder="请选择关联的题目"
                  style="width: 450px"
                  @change="selectedDependableQuestion(index, dq.selectIndex)">
                  <el-option label="请选择关联的题目" value="-1"></el-option>

                  <template v-for="(q,index2) of dependableQuestions">
                    <el-option
                      :label="(!!q.sequence && q.sequence) + '.'
                        + q.title.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, '') + '['+getQuestionTypeName(q.type)+']'"
                      :value="index2"></el-option>
                  </template>

                </el-select>
                <!-- 添加依赖问题 -->
                <el-link @click="addDependentQuestion" v-if="index === 0"
                         icon="el-icon-circle-plus-outline"
                         style="margin-left: 10px">更多</el-link>
                <el-link @click="removeDependentQuestion(index)" v-else
                         icon="el-icon-remove-outline"
                         style="margin-left: 10px">取消</el-link>

              </span>
            </div>
            <!-- 选择依赖问题后，显示可以勾选的选项 -->
            <div style="margin-top: 1rem; margin-left: 5rem">
            <template v-if="dq.selectIndex !== -1 && !!dq.question.title"> <!-- 不等于-1代表已经选择了题目-->
              <div style="color: #333">当“{{dq.title}}{{index + 1}}”选择下面的选项：</div>

              <el-checkbox-group v-model="dq.selectOptions" @change="changeValue(dq)">
                <div v-for="(item,index) of dq.question.answer"
                     :key="index"
                     style="margin-top:6px">
                  <el-checkbox
                    :label="index + 1"
                    :name="item">{{item}}</el-checkbox>
                </div>
              </el-checkbox-group>


              <div  style="margin-top: 0.5rem;">
                中的
                <el-select v-model="dq.combo" placeholder="任意一个" style="width: 110px" v-if="dq.question.type === 2">
                  <el-option :value="0" label="其中一个"></el-option>
                  <el-option :value="1" label="全部选项"></el-option>
                </el-select>
                <template v-else>任意一个</template>
                时，“当前题目”才出现
              </div>


            </template>
            </div>


          </div>

          <!-- 关联多题的时候 -->
          <div class="rows" v-if="dependentQuestions.length > 1" style="display: flex">

            <label>关联多题时：</label>
            <div>
              <div style="margin-bottom: 5px">多题之间</div>
              <el-radio-group v-model="question.dependentVisible">
                <el-radio :label="1">为“且”的关系( ? ) </el-radio>
                <el-radio :label="0">为“或”的关系( ? ) </el-radio>
              </el-radio-group>
            </div>

          </div>


        </div>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cleanDependents">清除关联</el-button>
        <el-button type="primary" @click="closeDependentDialog">确定</el-button>
      </span>

    </el-dialog>
    <!-- 题目关联结束 -->
  </span>

</template>

<script>
    import QuestionTemplate from "../../js/question.template";

    export default {
        name: "DependentDialog",
      props: ['question', "sections"],
      data: function () {
        return {
          // ---------- 题目依赖 -------------------
          // 意思是指 默认隐藏，如果依赖的题目选中了指定的选项，则显示
          choiceQuestion: QuestionTemplate.choiceQuestion,  // 单选
          completionQuestion: QuestionTemplate.completionQuestion, // 填空
          plugin: QuestionTemplate.plugin,   // 辅助插件
          matrixQuestion: QuestionTemplate.matrixQuestion,  // 矩阵
          scoreQuestion: QuestionTemplate.scoreQuestion,  // 评分
          others:QuestionTemplate.others, // 其他类型

          dependentDialogVisible: false,

          dependableQuestions: [], // 可依赖(关联)的题目
          // visibleCondition: 1, // 出现多个依赖/关联题目时，是以且还是或的关系显示？？？，默认是全部选择。
          selectedDependableQuestions: [],  // 被选择的依赖的问题

          // 依赖题目的模板
          template: {
            title: '关联题目',
            selectIndex: '', // 选择索引
            selectOptions: [], // 当question选择那些选项时，当前题目才会出现。
            question: {
              id: 0,
              title: '',
              sequence: '',
              type: '',
              answer: []
            },
            combo: 0, // 是否组合，默认是选择任意一个
            // selected: "1", // 是否选择
          },
          dependentQuestions: [], // 所依赖的题目
          // 本题的依赖显示
          dependent: [],
        }
      },
      methods: {

        /**
         * 判断是否为选择题
         */
        isChoiceQuestion: function(type){

          if(type === this.choiceQuestion.single.type
            || type === this.choiceQuestion.multiple.type
            || type === this.choiceQuestion.list.type
            || type === this.choiceQuestion.scoreSingle.type
            || type === this.choiceQuestion.scoreMultiple.type){

            return true;
          }

          return false;
        },

        /**
         * 获取题目类型
         */
        getQuestionTypeName: function(type){

          let name;

          switch (type) {

            case this.choiceQuestion.single.type:
              name = this.choiceQuestion.single.name;
              break;
            case this.choiceQuestion.multiple.type:
              name = this.choiceQuestion.multiple.name;
              break;
            case this.choiceQuestion.list.type:
              name = this.choiceQuestion.list.name;
              break;
            case this.choiceQuestion.scoreSingle.type:
              name = this.choiceQuestion.scoreSingle.name;
              break;
            case this.choiceQuestion.scoreMultiple.type:
              name = this.choiceQuestion.scoreMultiple.name;
              break;
            case this.completionQuestion.single.type:
              name = this.completionQuestion.single.name;
              break;
            case this.completionQuestion.table.type:
              name = this.completionQuestion.table.name;
              break;
            case this.completionQuestion.matrix.type:
              name = this.completionQuestion.matrix.name;
              break;
            case this.matrixQuestion.single.type:
              name = this.matrixQuestion.single.name;
              break;
            case this.matrixQuestion.multiple.type:
              name = this.matrixQuestion.multiple.name;
              break;
            case this.scoreQuestion.single.type:
              name = this.scoreQuestion.multiple.name;
              break;
            case this.others.sort.type:
              name = this.others.sort.name;
              break;
          }

          return name;

        },

        /**
         * dq.selectOptions被选中、反选后
         */
        changeValue: function(dq){
          dq.selectOptions = dq.selectOptions.sort();

        },

        /**
         * 取消依赖问题，除第一题外
         */
        removeDependentQuestion: function(index){

          // 移除
          this.dependentQuestions.splice(index, 1);

        },

        /**
         * 添加依赖问题
         */
        addDependentQuestion: function(){

          if(this.dependentQuestions.length >= this.dependableQuestions.length){
            this.$message.error('已超过可关联题目数量');
            return;
          }
          this.dependentQuestions.push(
              JSON.parse(JSON.stringify(this.template)));

        },

        /**
         * 选择关联的题目
         * 已选择关联的题目
         *
         * 如果其他问题已经选择，则不能选择。
         *
         */
        selectedDependableQuestion: function(index, value){

          if(value !== -1){

            for(let i = 0; i < this.dependentQuestions.length; i++){
              if(i !== index){
                //
                let q = this.dependentQuestions[i];
                if(q.selectIndex !== -1 && q.selectIndex === value){
                  this.$message.error('关联题目不能重复');
                  this.dependentQuestions[index].selectIndex = '-1';
                  value = -1;
                }
              }
            }

            if(value !== -1){
              // 设置问题
              let dq = this.dependableQuestions[value];
              this.dependentQuestions[index].question = {
                // id: dq.id,
                title: dq.title,
                sequence: dq.sequence,
                type: dq.type
              };

              let array = [];
              this.dependentQuestions[index].question.answer = array;

              for(let answer of dq.answer){
                array.push(answer.answer);
              }


            }
          }

        },

        cleanDependents: function(){

          this.$set(this.question, 'dependent', '');

          this.dependentQuestions.splice(0, this.dependentQuestions.length);
          this.dependentQuestions.splice(0, 0,
                JSON.parse(JSON.stringify(this.template)));

        },

        /**
         * 打开题目关联对话框
         */
        openDependentDialog: function(){

          this.dependableQuestions.splice(0, this.dependableQuestions.length);

          let index = 0;
          for(let section of this.sections){

            for(let fragment of section.fragments){

              if(fragment.type !== this.plugin.paragraph.type) {
                // 不是段落
                if(fragment.sequence >= this.question.sequence){
                  continue;
                }

                // 可依赖的题目
                if(this.isChoiceQuestion(fragment.type)){
                  // 选择题
                  this.dependableQuestions.splice(index++, 0, fragment);
                }
              }
            }

          }


          console.info('dependableQuestions', this.dependableQuestions);


          if(this.dependableQuestions.length > 0){
            // 初始化
            // 通过依赖模板创建第一条关联信息
            if(this.dependentQuestions.length > 0){
              this.dependentQuestions.splice(0, this.dependentQuestions.length);
            }

            /// 初始化显示
            if(!!this.question.dependent){

              if(!!this.question.dependent && this.question.dependent.length > 0){
                this.dependentQuestions =
                  JSON.parse(JSON.stringify(this.question.dependent));
              }

              console.info('dependentQuestions.length', this.dependentQuestions.length, this.dependentQuestions, this.question.dependent);

            } else {

              this.dependentQuestions.splice(0, 0,
                JSON.parse(JSON.stringify(this.template)));

            }

            // 显示文本框
            this.dependentDialogVisible = true;

          } else {

            if(this.question.sequence === 1){
              // 第一题
              this.$message.error('第1题不能设置关联逻辑');
            } else {
              this.$message.error('当前题目前面没有匹配到题目，题目关联仅支持选择题、评分单选和评分多选');
            }

          }

        },

          /**
         * 题目依赖处理
         */
        closeDependentDialog: function(){

          // 查看选择的dependentQuestions

          // 清空之前的缓存
          this.dependent.splice(0, this.dependent.length);
          let index = 0;

          for(let dq of this.dependentQuestions){
            if(dq.selectOptions.length > 0){
              this.dependent.splice(index, 0, dq);
              index++;
            }
          }

          if(this.dependent.length === 0){
            this.$set(this.question, 'dependent', '');
          } else {
            this.$set(this.question, 'dependent', JSON.parse(JSON.stringify(this.dependent)));
          }



          // this.question.dependent = this.dependent;

          console.info(this.question);

          // 关闭对话框
          this.dependentDialogVisible = false;
        },
      }
    }
</script>

<style scoped>

</style>
