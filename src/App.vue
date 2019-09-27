<template>
  <div id="app">
    <!--<Preview  :survey="data" :validation="true" @submit="doSubmit" :answerFinish="answerFinish" :show-loading="true" loading-text="正在提交..."></Preview>-->
    <!--@finish-edit="onFinishEditQuestion"-->
      <!--@move-to-first="onMoveToFist"-->
      <!--@move-to-last="onMoveToLast"-->
      <!--@move-up="onMoveUp"-->
      <!--@move-down="onMoveDown"-->
      <!--@duplicate="onDuplicateQuestion"-->
      <!--@remove="onRemoveQuestion"-->
          <!--@section-move-to-first="sectionMoveToFirst"-->
      <!--@section-move-to-last="sectionMoveToLast"-->
      <!--@add-question="onSaveQuestion"-->
      <!--@add-section="onSectionSave"-->
      <!--@remove-section="onSectionRemove"-->

    <SurveyEditor
      v-if="!!data"
      :survey-data="data"
      :debug="false"
      @preview="preview2"
      @remove="onRemoveQuestion"
      @remove-section="onSectionRemove"
    ></SurveyEditor>
    <!--<Report :data="reportData" @export="onExport"></Report>-->
  </div>
</template>

<script>
  import SurveyEditor from './components/SurveyEditor';
  import Preview from "./components/Preview";
  import Report from "./components/Report";

  export default {
  name: 'app',
  components: {
    Report,
    Preview,
    SurveyEditor
  },
  data () {
    return {
      sid: 34,
      isPreview: false,
      answerFinish: false,
      reportData: [{"qid":5753,"sequence":1,"title":"标题","type":12,"vertical":["行1","行2"],"answerCount":1,"answer":[[{"answer":"列1","total":0},{"answer":"列2","total":1},{"answer":"列3","total":0}],[{"answer":"列1","total":0},{"answer":"列2","total":1},{"answer":"列3","total":0}]]},{"qid":5754,"sequence":2,"title":"标题","type":13,"vertical":["行1","行2"],"answerCount":1,"answer":[[{"answer":"列1","total":0},{"answer":"列2","total":1},{"answer":"列3","total":1}],[{"answer":"列1","total":1},{"answer":"列2","total":1},{"answer":"列3","total":0}]]},{"qid":5755,"sequence":3,"title":"标题","type":20,"vertical":["行1","行2"],"answerCount":1,"answer":[[{"answer":"列1","total":5},{"answer":"列2","total":5},{"answer":"列3","total":5}],[{"answer":"列1","total":3},{"answer":"列2","total":3},{"answer":"列3","total":4}]]},{"qid":5756,"sequence":4,"title":"标题","type":2,"answerCount":10,"answer":[{"answer":"行1","total":4},{"answer":"行2","total":5}]}]
      ,
      // data: null,
      data: {"id":44,"title":"sdvsdvsdvsdvavsdvsdvsvsdvsdvsdvs","answer":2,"status":1,"description":"","sequence":1,"submitAction":1,"submitForward":"http://","submitText":"<p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\"><span class=\"ql-size-large\">问卷到此结束，谢谢您的参与！</span></p>","sections":[{"id":45,"sid":44,"orderNo":1,"createdTime":"2019-09-12 11:31:15","updated":false,"fragments":[{"id":509,"ssid":45,"answerCount":2,"title":"标题：","name":"单选题","answerTip":"","sequence":1,"type":1,"remark":"","requireAnswer":1,"columns":1,"dependent":"","dependentVisible":0,"forwardType":0,"userAnswer":"","ssOrderNo":1,"answer":[{"id":1297,"qid":509,"createdTime":"2019-09-12 11:35:33","answer":"选项1","orderNo":1,"checked":0,"score":0,"complete":0,"requireComplete":0,"completeValue":"","image":"","description":""},{"id":1298,"qid":509,"createdTime":"2019-09-12 11:35:33","answer":"选项2","orderNo":2,"checked":0,"score":0,"complete":0,"requireComplete":0,"completeValue":"","image":"","description":""},{"id":1299,"qid":509,"createdTime":"2019-09-12 11:35:33","answer":"选项3","orderNo":3,"checked":0,"score":0,"complete":0,"requireComplete":0,"completeValue":"","image":"","description":""}]}]}],"enableGetResult":1}
    }
  },
  mounted(){


  },
  methods: {
    onSectionRemove: function(section){
      if(!!!this.data['deletedSections']){
        this.data['deletedSections'] = [section.id];
      } else {
        this.data['deletedSections'].push(section.id);
      }
    },

    onRemoveQuestion: function(q){
      if(!!!this.data['deletedQuestions']){
        this.data['deletedQuestions'] = [q.id];
      } else {
        this.data['deletedQuestions'].push(q.id);
      }
    },

    preview2: function(){

    },

    onExport: function (data) {
      console.info('onExport', data)

    },

    doSubmit: function(data){
      setTimeout(() => {
        this.answerFinish = true;
      }, 2000);
    }
  }
}
</script>

<style lang="scss">
*{
  padding: 0;
  margin: 0;
}
</style>
