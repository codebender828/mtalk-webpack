import viewportUnitsBuggyfill from "viewport-units-buggyfill";
import viewportUnitsBuggyfillHacks from "viewport-units-buggyfill/viewport-units-buggyfill.hacks";

// Initialize Viewport Unit
viewportUnitsBuggyfill.init({
  hacks: viewportUnitsBuggyfillHacks,
});

if (window) {
  window.global = window.globalThis || window || {};
}
