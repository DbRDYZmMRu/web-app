import { createApp } from "./lib/petite-vue.js";
import { initializeApp } from "./utils/init.js";

// Initialize the app
const appConfig = initializeApp();

// Mount the app globally
createApp(appConfig).mount();