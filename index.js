import SurveyEditor from './src/components/SurveyEditor';
import _Vue from 'vue';

SurveyEditor.install = Vue => {
  if(!Vue){
    window.Vue = Vue = _Vue
  }
  Vue.component(SurveyEditor.name, SurveyEditor);
}

export default SurveyEditor
