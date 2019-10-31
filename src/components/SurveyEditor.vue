<template>

  <div class="editor">

    <div class="editor-header">

      <div>
        <div class="header-left">
          <el-checkbox v-model="survey.sequence" :false-label="0" :true-label="1">显示系统题号</el-checkbox>
        </div>

        <div class="header-right">
          <el-button-group>
            <el-button icon="el-icon-view" @click="preview" style="color: #409EFF">预览</el-button>
            <el-button type="primary" @click="finish">完成编辑</el-button>
          </el-button-group>
        </div>
      </div>

    </div>

    <div class="survey">

      <div class="survey-nav" v-if="editable">

        <ul>
          <li v-for="item of nav">

            <el-link :underline="false"
               :icon="item.collapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
               @click="toggleNavCollapse(item)">{{item.title}}</el-link>

            <ul class="qtlist" v-if="!item.collapse">

              <li v-for="(template, index) of item.templates">

                <el-link :underline="false"
                     @click="addQuestion(template)" :icon="item.icons[index]">
                  {{template.name}}
                </el-link>

              </li>

            </ul>

          </li>

        </ul>

        <!--常见题型 -->

        <el-link :underline="false"
                 style="color: #222; margin-bottom: 10px"
               :icon="familiarQuestionCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
                 @click="familiarQuestionCollapse = !familiarQuestionCollapse">常见题型</el-link>

        <ul class="qtlist familiar-question" v-if="!!familiarQuestionCollapse">


          <li v-for="(template, key) of familiarQuestion">

            <el-link :underline="false"
                 @click="addQuestion(template)" :icon="familiarQuestionIcons[key]">
             {{template.name}}
            </el-link>

          </li>

        </ul>

      </div>

      <div class="survey-editor">

        <div class="survey-header ql-snow" @click="doEditSurveyHeader(true)">
          <div class="survey-title" >
            <h2>{{survey.title}}</h2>
          </div>

          <div class="survey-description ql-editor"
               v-html="survey.description"></div>

        </div>


        <div class="survey-header-editor" v-if="editSurveyHeader">

          <div style="position:relative; text-align: center">
            <span class="triangle-up-outline"></span>
            <span class="triangle-up"></span>
          </div>

          <table>

            <tr>
              <td>标题：</td>
              <td><el-input v-model="survey.title"/></td>
            </tr>

            <tr>
              <td>说明：</td>
              <td>
                <my-quill-editor
                  class="description-quill-editor"
                  v-model="survey.description"
                  style="margin-top: 10px"
                  @change="onChangeDescription"
                  @upload-file="onUploadFile"></my-quill-editor>
              </td>
            </tr>


          </table>

          <div style="text-align: center">
            <el-button
              type="primary"
              @click="doEditSurveyHeader(false)">完成编辑</el-button>
          </div>

        </div>

        <survey-section
          v-for="(item, index) in survey.sections"
          :key="item.id"
          :id="'ssid_' + item.id"
          :fragments="item.fragments"
          :showSequence="survey.sequence"
          :currentPage="index+1"
          :pageCount="survey.sections.length"
          :editable="editable"
          :sections="survey.sections"
          :insertPoint="insertPoint"
          :readonly="readonly"
          @section-move-to-first="sectionMoveToFirst"
          @section-move-to-last="sectionMoveToLast"
          @section-remove="removeSection"
          @finish-edit="finishEdit"
          @change-value="onChangeValue"
          @cancel-insert-section="cancelInsertToSection"
          @insert-section="insertToSection"
          @insert="insertItem"
          @cancel-insert="cancelInsertItem"
          @edit="editItem"
          @remove="removeItem"
          @duplicate="duplicateItem"
          @move-up="moveUp"
          @move-down="moveDown"
          @move-to-first="moveToFirst"
          @move-to-last="moveToLast"
          @upload-file="onUploadFile"></survey-section>


        <!-- 提交答卷后的处理方式 -->
        <div class="survey-footer">
          <div class="survey-footer-bar"
            @click="toggleSurveyFooter">
            <span>提交问卷后的处理方式</span>
            <i v-if="!userAnswerFinish" class="icon el-icon-arrow-right"></i>
            <i v-else class="icon el-icon-arrow-down"></i>
          </div>

          <div class="survey-footer-content" v-if="userAnswerFinish">

            <el-radio-group v-model="survey.submitAction">
              <el-radio-button :label="1" checked>显示自定义文案</el-radio-button>
              <el-radio-button :label="2">跳转到指定的页面</el-radio-button>
              <!--<el-radio-button tag="3">按条件处理</el-radio-button>-->
            </el-radio-group>

            <div v-if="survey.submitAction === 1"
                 style="margin: 20px 0; flex-direction: column; padding: 0 20px; overflow: hidden;">

              <el-alert :closable="false">提交问卷后，显示一段您的自定义的文案。</el-alert>

              <!--<quill-editor-->
                  <!--v-model="survey.submitText"-->
                  <!--:options="{placeholder: ''}"-->
                  <!--style="margin-top: 10px">-->
              <!--</quill-editor>-->
              <my-quill-editor
                v-model="survey.submitText"
                style="margin-top: 10px"
                @change="onChangeSubmitText"
                @upload-file="onUploadFile"></my-quill-editor>

            </div>

            <div v-else-if="survey.submitAction === 2"
                 style="margin: 20px 0; flex-direction: column; padding: 0 20px; overflow: hidden;">
              <el-alert :closable="false">提交问卷后，跳转到一个您指定的页面地址。</el-alert>
              <div style="margin-top: 10px; padding-bottom: 100px;  border: 1px solid #ddd; width: 100%; display: flex; padding-top: 30px; justify-content: center">
                <el-input  v-model="survey.submitForward" style="width: 500px; ">
                  <template slot="prepend">跳转地址</template>
                </el-input>
              </div>
            </div>

          </div>
        </div>


      </div>

    </div>

  </div>

</template>

<script>



    import SurveySection from "./SurveySection";
    import questionTemplate from "../js/question.template";
    import {navMenu} from "../js/common";
    // import { quillEditor } from 'vue-quill-editor';
    import {questions} from "../js/familiar-question.template";
    import MyQuillEditor from "./MyQuillEditor";

    export default {
      name: "SurveyEditor",
      components: {MyQuillEditor, SurveySection},
      props: ['surveyData', 'interval', 'enableAutoSave', 'showSubmitAction', 'readonly'],
      data: function () {

        return {
          navCollapse: [], // 左栏导航折叠情况
          nav: navMenu,
          familiarQuestion: questions,
          familiarQuestionCollapse: true,
          familiarQuestionIcons: {
            sex: 'el-icon-male',
            marry: 'el-icon-coordinate',
            name: 'el-icon-s-custom',
            mobile: 'el-icon-mobile-phone',
            email: 'el-icon-message',
            address: 'el-icon-location-outline',
            income: 'el-icon-money',
            age: 'el-icon-s-data',
            date: 'el-icon-date',
            education: 'el-icon-school'
          },

          survey: null, //
          questionTemplate: questionTemplate,
          userAnswerFinish: false, // 显示隐藏 提交答卷后的处理方式
          editSurveyHeader: false, // 编辑问卷头
          editable: true,  // 问卷是否可以编辑
          timer: null, // 定时器
          sequence: -1,
          currentSequence: 1,
          currentSectionSequence: 0,
          // readonly: false, // 只读
          insertPoint: {  // 插入点
            sectionIndex: -1,
            sectionId: null,
            index: -1,
            id: null
          },
          backupSurvey: null, // 备份的问卷信息
        }
      },


      created: function(){
        // 初始化问卷页
        // 默认创建一个section

        if(!!this.showSubmitAction){
          this.userAnswerFinish = this.showSubmitAction;
        }


        this.survey = this.surveyData;

        let questions = {};

        // 对问题的userAnswer进行JSON转换
        for(let section of this.survey.sections){
          for(let fragment of section['fragments']){
            if(!!fragment.userAnswer && typeof fragment.userAnswer === 'string')
                this.$set(fragment, 'userAnswer', JSON.parse(fragment.userAnswer));
            if(!!fragment.vertical && typeof fragment.vertical === 'string')
                this.$set(fragment, 'vertical', JSON.parse(fragment.vertical));
            if(!!fragment.horizontal && typeof fragment.horizontal === 'string')
              this.$set(fragment, 'horizontal', JSON.parse(fragment.horizontal));
            if(!!fragment.dependent && typeof fragment.dependent === 'string')
              this.$set(fragment, 'dependent', JSON.parse(fragment.dependent));

            questions[fragment.id] = fragment;
          }
        }

        // 获取当前的题目序号
        let fragments = this.getCurrentSection();
        let fragment = fragments[fragments.length - 1];
        if(!!fragment){
          this.currentSequence = fragment['sequence'];
        }

        sessionStorage.setItem('surveyQuestions', JSON.stringify(questions));

        // 备份问卷信息
        this.backupSurvey = JSON.parse(JSON.stringify(this.survey));

        if(!!this.enableAutoSave){

          this.timer = setInterval(() => {
            // 30秒执行一次
            this.autoSaveSurvey();
          }, this.interval || 30*1000);

        }


      },

      methods: {
        onChangeDescription: function(content){
          this.$set(this.survey, 'description', content);
        },

        onChangeSubmitText: function(content){
          this.$set(this.survey, 'submitText', content);
        },

        onUploadFile: function(file, editor, index){
          this.$emit('upload-file', file, editor, index);
          console.info(file.name)
          // editor.insertEmbed(index, 'image', "https://img-bss.csdn.net/1568878819411.jpg");
        },

        onChangeValue: function(q){
          this.$emit('change-value', q);
        },

        /**
         * 展开和折叠菜单按钮
         */
        toggleNavCollapse: function(item){

          if(!!item.collapse){
            item.collapse = false;
          } else {
            item.collapse = true;
          }

        },

        /**
         * 获取当前编辑中的section/分页
         */
        getCurrentSection: function(sectionIndex){
          return this.survey.sections[sectionIndex || this.survey.sections.length - 1]['fragments'];
        },

        /**
         * 获取问题所在的section.fragments
         */
        getSectionFragment: function(q){

          for(let i = 0, size = this.survey.sections.length; i < size; i++){

            let fs = this.survey.sections[i]['fragments'];

            for(let j = 0, len = fs.length; j < len; j++){

              if(fs[j].id === q.id){

                return {
                  fragments: fs,
                  index: j,
                  sectionIndex: i
                };

              }
            }

          }

        },

        /**
         * 获取ID
         */
        getQID: function(){
          return this.sequence--;
        },

        /**
         * 隐藏显示提交答卷后的处理方式
         */
        toggleSurveyFooter: function(){
          this.userAnswerFinish = !this.userAnswerFinish;
        },

        /**
         * 在这个section中插入题目
         */
        insertToSection: function(section){

          let i = 0;
          for(let s of this.survey.sections){

            if(section.id === s.id){
              this.insertPoint = {
                  sectionIndex: i,
                  sectionId: section.id,
                  index: 0,
                  id: null
                };

              break;
            }

            i++;
          }

        },

        /**
         * 在这个section中插入题目
         */
        cancelInsertToSection: function(){

          this.cancelInsertItem();

        },

        /**
         * 在此题后插入新题
         */
        insertItem: function (q) {

          for(let i = 0; i < this.survey.sections.length; i++){
            let section = this.survey.sections[i];
            let fragments = section['fragments'];
            for(let j = 0; j < fragments.length; j++){
              let fragment = fragments[j];
              if(fragment.id === q.id){
                this.insertPoint = {
                  sectionIndex: i,
                  sectionId: section.id,
                  index: j,
                  id: fragment.id
                };
              }
            }
          }

        },

        /**
         * 取消插入点
         */
        cancelInsertItem: function () {

          this.insertPoint = {
            sectionIndex: -1,
            sectionId: null,
            index: -1,
            id: null
          };
        },

        /**
         * 编辑
         * @param id
         * @param e
         */
        editItem: function(q){

          // 编辑其他问题
          // 关闭标题编辑
          this.editSurveyHeader = false;

          // 查询关闭编辑中的问题
          for(let section of this.survey.sections){
            for(let fragment of section['fragments']){
               this.$delete(fragment, 'editing');
            }
          }

          this.$set(q, 'editing', true);

        },

        /**
         * 复制
         * @param id
         * @param e
         */
        duplicateItem: function(q){

          let result = this.getSectionFragment(q);

          // 复制对象并插入下一个
          let newItem = JSON.parse(JSON.stringify(q));
          newItem['id'] = this.getQID();

          result.fragments.splice(result.index + 1, 0, newItem);

          this.updateSequence();

          this.$emit('duplicate', q, result);

        },

        /**
         * 删除
         * @param id
         * @param e
         */
        removeItem: function(q){

          let result = this.getSectionFragment(q);

          result.fragments.splice(result.index, 1);

          this.updateSequence();

          this.$emit('remove', q, result);

        },

        /**
         * 上移
         * @param id
         * @param e
         */
        moveUp: function(q){

          let result = this.getSectionFragment(q);

          let fragments = this.survey.sections[0]['fragments'];

          // 移到最前
          if(fragments === result.fragments && result.index === 0){
            this.$message.error('第1题不能再上移了。');

            return;
          }

          // 判断当前问题是否存在依赖关系，如果存在，判断依赖的问题是否是前一个问题，如果是的话，则不能移动
          if(!!q.dependent && q.dependent.length > 0){

            let index = 0;
            let flag = false;
            for(let qd of q.dependent){

              console.info(qd);
              if(qd){

                if(qd.question.sequence === q.sequence - 1){
                  // 存在依赖上一题

                  this.$confirm('当前问题依赖上一题，如果继续移动，将删除依赖关系?', '依赖提示', {
                    confirmButtonText: '继续移动',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {

                    // 删除依赖
                    q.dependent.splice(index, 1);

                    if(q.dependent.length === 0){
                      this.$set(q, 'dependent', '');
                    }

                    this.doMoveUp(q, result);

                  }).catch(() => {

                  });

                  break;
                } else {

                  flag = true;

                }

              }

              index++;

            }
            //

            if(!!flag){

              this.doMoveUp(q, result);

            }


          } else {

            // 继续移动
            this.doMoveUp(q, result);

          }

        },

        doMoveUp: function(q, result){

          // 删除当前的问题
          let deleted = result.fragments.splice(result.index, 1);

          let fs = result.fragments, index = result.index - 1;
          let prev;

          // 这个分页中的第一题
          if(result.index === 0){
            fs = this.survey.sections[result.sectionIndex - 1]['fragments'];

            index = fs.length;
            prev = fs[fs.length - 1];

            if(!!!prev){
              prev = {
                ssid: this.survey.sections[result.sectionIndex - 1]['id']
              }
            }

            console.info('prev', prev);

          } else {
            prev = fs[result.index - 1];
          }

          fs.splice(index, 0, deleted[0]);

          this.updateSequence();

          this.$emit('move-up', q, prev);

        },

        /**
         * 下移
         * @param id
         * @param e
         */
        moveDown: function(q){

          let result = this.getSectionFragment(q);

          // 将其插入到最后一个
          let fragments = this.survey.sections[this.survey.sections.length - 1]['fragments'];

          if(fragments === result.fragments
              && result.index === fragments.length - 1){
            this.$message.error('最后1题不能再下移了。');
            return;
          }


          // 判断下一个问题是否有依赖，而且这个依赖是不是当前的问题

          // 获取下一题
          let nextQuestion, flag = false;
          for(let section of this.survey.sections){

            for(let fragment of section['fragments']){

              nextQuestion = fragment;

              if(flag){
                break;
              }

              if(fragment.sequence === q.sequence){
                flag = true;
              }

            }

          }

          console.info('下一个问题是：', nextQuestion);


          if(!!nextQuestion.dependent && nextQuestion.dependent.length > 0){

            let index = 0;
            let flag = false;
            for(let qd of nextQuestion.dependent){

              console.info(qd);
              if(qd){

                if(qd.question.sequence === q.sequence){
                  // 存在依赖当前移动的题目

                  this.$confirm('下一题依赖当前题目，如果继续移动，将删除依赖关系?', '依赖提示', {
                    confirmButtonText: '继续移动',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {

                    // 删除依赖
                    nextQuestion.dependent.splice(index, 1);

                    if(nextQuestion.dependent.length === 0){
                      this.$set(nextQuestion, 'dependent', '');
                    }

                    this.doMoveDown(q, result);

                  }).catch(() => {

                  });

                  break;
                } else {

                  flag = true;

                }

              }

              index++;

            }
            //

            if(!!flag){

              this.doMoveDown(q, result);

            }

          } else {

            this.doMoveDown(q, result);
          }

        },

        doMoveDown: function(q, result){

          let fs = result.fragments, index = result.index + 1;

          // 这个分页中的最后一题
          let next;
          if(result.index === result.fragments.length - 1){
            // 下一个分页
            fs = this.survey.sections[result.sectionIndex + 1]['fragments'];
            index = 0;
            next = fs[0];
            if(!!!next){
              next = {
                ssid: this.survey.sections[result.sectionIndex + 1]['id']
              };
            }
          } else {
            next = fs[result.index + 1];
          }

          console.info('next', next);

          // 删除当前的问题
          let deleted = result.fragments.splice(result.index, 1);

          fs.splice(index, 0, deleted[0]);

          this.updateSequence();

          this.$emit('move-down', q, next);

        },

        /**
         * 移到开头
         * 如果是第一个，则提示，第一题不能再上移啦
         * @param id
         * @param e
         */
        moveToFirst: function(q){

          let result = this.getSectionFragment(q);

          let fragments = this.survey.sections[0]['fragments'];

          // 移到最前
          if(fragments === result.fragments && result.index === 0){
            this.$message.error('第1题不能再上移了。');
            return;
          }

          // 判断当前的题目是否有依赖
          // 如果有依赖的话，不能移动到最前
          this.$confirm('移动该题会导致所有问题的依赖被删除，是否继续?', '依赖提示', {
            confirmButtonText: '继续移动',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {


            for(let section of this.survey.sections){

              for(let fragment of section['fragments']){

                if(!!fragment.dependent){
                  this.$set(fragment, 'dependent', '');
                }

              }

            }


            // 删除当前的问题
            let deleted = result.fragments.splice(result.index, 1);

            fragments.splice(0, 0, deleted[0]);

            this.updateSequence();

            this.$emit('move-to-first', q);


          }).catch(() => {

          });


        },

        /**
         * 移到结尾
         * 如果最后第一个，则提示，最后一题不能再下移啦
         * @param id
         * @param e
         */
        moveToLast: function(q){

          let result = this.getSectionFragment(q);

          // 将其插入到最后一个
          let fragments = this.survey.sections[this.survey.sections.length - 1]['fragments'];

          if(fragments === result.fragments
              && result.index === fragments.length - 1){
            this.$message.error('最后1题不能再下移了。');
            return;
          }

          // 判断这题后面的所有问题是否对这个问题有依赖，如果有的话，需要对该题的依赖删除才能继续。

          this.$confirm('移动该题会导致所有问题的依赖被删除，是否继续?', '依赖提示', {
            confirmButtonText: '继续移动',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {


            for(let section of this.survey.sections){

              for(let fragment of section['fragments']){

                if(!!fragment.dependent){
                  this.$set(fragment, 'dependent', '');
                }

              }

            }


            // 删除当前的问题
            let deleted = result.fragments.splice(result.index, 1);

            fragments.splice(fragments.length + 1, 0, deleted[0]);

            this.updateSequence();

            this.$emit('move-to-last', q);


          }).catch(() => {

          });

        },
        /**
         * 更新题号
         * 每当需要删除，插入，移动的时候，需要更新题号
         */
        updateSequence: function(){

          let num = 0;

          for(let section of this.survey.sections){

            let ssOrderNo = 1;

            for(let fragment of section['fragments']){

              fragment['ssOrderNo'] = ssOrderNo++;

              if(fragment.type === questionTemplate.plugin.paragraph.type){
                // 段落忽略
                continue;
              }

              this.$set(fragment, 'sequence', ++num);

              console.info(fragment.id, '更新sequence')

            }

          }

          // 修改当前的题号
          this.currentSequence = num;

          // this.$emit('update-sequence', updates);

        },
        /**
         * 创建一个section/分页
         */
        addSection: function () {

          this.survey.sections.push(
            {
              id: --this.currentSectionSequence,
              fragments: []   // 碎片：题目、段落
            });

          setTimeout(() => {
            let s = document.getElementById('ssid_' + this.currentSectionSequence);
            document.documentElement.scrollTop = s.offsetTop;
          });

          // 新建分页
          this.$emit('add-section', this.survey.sections[this.survey.sections.length - 1]);

        },
        /**
         * 添加Question到指定的section/分页
         * @param type 问题类型
         * @param remark 问题备注
         */
        addQuestion: function(template) {

          if(template.type === questionTemplate.plugin.section.type) {
            // 分页
            this.addSection();
            return;
          }

          let obj = JSON.parse(JSON.stringify(template));

          // 段落忽略
          if(template.type !== questionTemplate.plugin.paragraph.type){
            obj.sequence = this.currentSequence++;
          }

          obj.id = this.getQID();  // 问题ID


          console.info('addQuestion.insertPoint', this.insertPoint);
          if(this.insertPoint['sectionIndex'] === -1){
            // 普通插入
            this.getCurrentSection().push(obj);
          } else {

            let fragments = this.survey.sections[this.insertPoint['sectionIndex']]['fragments'];

            if(!!this.insertPoint['id']){
              fragments.splice(this.insertPoint['index'] + 1, 0, obj);
            } else {
              fragments.splice(this.insertPoint['index'], 0, obj);
            }


          }

          this.$emit('add-question', obj, this.insertPoint);

          this.updateSequence();

          this.editItem(obj);

          // 重置插入点
          this.cancelInsertItem();

          // 滚动到指定的题目中
          setTimeout(() => {
            let q = document.getElementById('ssqid_' + obj.id);
            document.documentElement.scrollTop = q.offsetTop - 50;
          });




        },


        /**
         * 编辑问卷头
         */
        doEditSurveyHeader: function(isEditing){

          this.editSurveyHeader = isEditing;


          for(let section of this.survey.sections){
            for(let fragment of section['fragments']){
              if(fragment.editing){
                this.$set(fragment, 'editing', false);
              }
            }
          }


          if(!!isEditing){
            this.$emit('finish-header', this.survey);
          }

        },

        /**
         * 完成编辑
         */
        finish: function () {
          this.$emit('finish', this.getFinishSurvey());
        },

        /**
         * 自动保存
         */
        autoSaveSurvey: function(){
          this.$emit('auto-save', this.getFinishSurvey());
        },

        /**
         * 完成编辑
         */
        finishEdit: function (q) {
          this.$emit('finish-edit', q);
        },

        /**
         * 生成待提交的数据
         */
        getFinishSurvey: function(){

          console.info('getFinishSurvey......');

          let survey = JSON.parse(JSON.stringify(this.survey));

          // 对问题的userAnswer进行JSON转换
          for(let section of survey.sections){
            for(let fragment of section['fragments']){

              if(!!fragment.userAnswer){
                // if(typeof fragment.userAnswer === 'string' || typeof fragment.userAnswer === 'number'){
                //   fragment.userAnswer = '';
                // } else if(typeof fragment.userAnswer === 'object'){
                //   for(let ua of fragment.userAnswer){
                //     if(typeof ua === 'string' || typeof ua === 'number'){
                //       ua = '';
                //     } else if(!!ua && typeof ua === 'object' && ua.length > 0){
                //       // ua.length = 0;
                //       ua.splice(0, ua.length);
                //     }
                //   }
                // }

                if(typeof fragment.userAnswer === 'object'){
                    fragment.userAnswer = JSON.stringify(fragment.userAnswer);
                } else {
                    fragment.userAnswer = "" + fragment.userAnswer;
                }
              }

              if(!!fragment.vertical && typeof fragment.vertical === 'object'){
                fragment.vertical = JSON.stringify(fragment.vertical);
              }

              if(!!fragment.horizontal && typeof fragment.horizontal === 'object'){
                fragment.horizontal = JSON.stringify(fragment.horizontal);
              }

              if(!!fragment.dependent && typeof fragment.dependent === 'object'){

                fragment.dependent = JSON.stringify(fragment.dependent);

              }
            }
          }

          console.info('survey', survey, JSON.stringify(survey));

          return survey;
        },

        /**
         * 预览
         */
        preview: function () {

          this.$emit('preview', this.getFinishSurvey());
        },

        /**
         * 分页移动到最前
         */
        sectionMoveToFirst: function(args){
          this.$emit('section-move-to-first', args);
        },

        /**
         * 分页移动到最后
         */
        sectionMoveToLast: function(args){
          this.$emit('section-move-to-last', args);
        },

        /**
         * 删除分页
         * @param args
         */
        removeSection: function(args){
          this.$emit('remove-section', args);
        }


      },

      destroyed() {
        if(!!this.timer)
          clearInterval(this.timer);
      }

    }


</script>

<style>

  /*图标颜色*/
  .survey .survey-nav ul.qtlist li > a > i,
  .survey .survey-nav .familiar-question{
    color: #409EFF;
  }

  .survey .survey-nav ul.qtlist li > a:hover i,
  .survey .survey-nav .familiar-question li > a:hover i {
    color: #fff;
  }


  .description-quill-editor .ql-editor{
    height: 200px !important;
  }



  .triangle-up, .triangle-up-outline{
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 10px solid #fafafa;
    position: absolute;
    top: -2.5rem;
  }

  .triangle-up-outline{
    top: -2.6rem;
    border-bottom: 10px solid #DCDFE6;
  }

  .el-input__inner{
    height: 36px;
    line-height: 36px;
  }

</style>

<style scoped>

  body {
    min-width: 1130px;
  }

  .editor{
    overflow: hidden;
  }

  .editor .editor-header{
    overflow: hidden;
    display: flex;
    align-items: center;
    background-color: #313131;
    width: 100%;
    position: fixed;
    z-index: 1000;
  }

  .editor .editor-header > div {
    width: 1124px;
    max-width: 1124px;
    margin: 0 auto;
  }

  .editor .editor-header .header-left{
    float: left;
    padding-top: 9px;
  }

  .editor .editor-header .header-right{
    float: right;
  }

  .editor .editor-header .header-right button{
    border-radius: 0;
  }

  .survey{
    max-width: 1124px;
    min-width: 892px;
    margin: 40px auto 0;
    padding: 0;
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    transition: 0.3s;
    overflow: hidden;
    background-color: #f5f5f5;
  }

  .survey .survey-nav{
    width: 200px;
    float: left;
    border-right: 1px solid #ddd;
    overflow: auto;
    background-color: #fff;
    padding: 20px 10px;
    position: fixed;
    height: calc(100% - 80px);
  }

  .survey .survey-nav ul {
    list-style: none;
  }

  .survey .survey-nav ul li{
    overflow: hidden;
  }


  .survey .survey-nav > ul li > a {
    margin-bottom: 10px;
    color: #222;
  }

  .survey .survey-nav ul.qtlist {
    padding: 5px 0 10px 0;
    overflow: hidden;
  }


  .survey .survey-nav ul.qtlist li{
    width: 50%;
    float: left;
  }

  .survey .survey-nav ul.qtlist li > a{
    color: #666;
    display: block;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    text-align: left;
    padding-left: 12px;
  }

  .survey .survey-nav ul.qtlist li > a:hover{
    background-color: #409EFF;
    color: #fff;
  }

  .survey .survey-editor{
    width: 897px;
    margin-left: 5px;
    float: right;
    overflow: auto;
    min-width: 892px;
    border-left: 1px solid #ddd;
    background-color: #fff;
  }

  .survey-header:hover{
    background-color: #fafafa;
  }

  .survey-title{
    text-align: center;
    cursor: pointer;
    padding-top: 3rem;
    padding-left: 20px;
    padding-right: 20px;
    word-break: break-word;
  }

  .survey-description{
    padding: 1rem 2rem 1rem 2rem;
    cursor: pointer;
    border-bottom: 1px solid #DCDFE6;
  }

  .survey-description p {
    cursor: pointer;
  }

  .survey-description img{
    width: 100%;
  }

  .survey-footer {
    margin: 2rem;
  }

  .survey-footer .survey-footer-bar{
    display: flex;
    background-color: #E8E8E8;
    padding: 0.8rem 1rem;
    font-size: 14px;
    cursor: pointer;
  }

  .survey-footer .icon{
    margin: 0 8px 0 auto;
    font-size: 1rem;
  }

  .survey-footer .survey-footer-content > div{
    display: flex;
    align-items: center;
    padding-top: 2rem;
    justify-content: center;
    overflow: hidden;
  }

  .survey-footer .survey-footer-content{

  }

  .survey-footer .survey-footer-content .desc {
    font-size: 14px;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    color: #666;
  }


  /* 标题 ---- 说明 --- 编辑*/
  .survey-header-editor {
    padding: 2rem;
    margin: 0px;
    background-color: #fafafa;
  }

  .survey-header-editor table tr td:first-child{
    width: 50px;
  }

  .survey-header-editor table tr td {
    padding: 7px 0;
  }





</style>
