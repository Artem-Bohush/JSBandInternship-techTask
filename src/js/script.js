import 'nodelist-foreach-polyfill';
import 'formdata-polyfill';
import initAppLogic from './modules/initAppLogic';

window.addEventListener('DOMContentLoaded', () => {
  initAppLogic();
});
