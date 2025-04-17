import page from "../lib/page.mjs.js";
import { store } from "../store/index.js";

// Function to initialize the router
export function initializeRouter() {
  // Define routes
  page("/", () => {
    console.log("Navigated to Home");
    store.route = "home"; // Update the store's route state
  });
  
  page("/music", () => {
    store.route = "music";
  });
  
  page("/poetry", () => {
    store.route = "poetry";
  });
  
  page("/books", () => {
    store.route = "books";
  });
  
  page("/login", () => {
    store.route = "login";
  });
  
  // Start the router
  page.start();
  
  // Add a navigate function to the store for programmatic routing
  store.path = (path) => {
    page(path);
  };
  
  // Expose the router globally for debugging (optional)
  window.page = page;
}