import { store } from "../store/index.js";
import { initializeRouter } from "../router/index.js";

// Function to initialize the app's global state
export function initializeApp() {
  const router = initializeRouter(); // Initialize the router
  
  return {
    store, // Attach the store to the app
    router, // Attach the router to the app (optional, for advanced use)
    Counter(props) {
      return {
        $template: "#counter-template",
        count: props.initialCount,
        inc() {
          this.count++;
        },
      };
    },
  };
}