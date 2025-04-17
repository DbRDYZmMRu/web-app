import { reactive } from "../lib/petite-vue.js";
import { state } from "./state.js";
import methods from "../scripts/index.js";
import albumMethods from '../components/layout/index.js';

export const store = reactive({
  ...state,
  ...methods,
 ...albumMethods, 
});