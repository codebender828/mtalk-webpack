import { toPascalCase } from "~/utils/string";
import BottomPanel from "./ui/bottom-panel.vue";
import EditButton from "./ui/edit-button.vue";
import MirrorCard from "./ui/mirror-card.vue";
import RctIcon from "./ui/rct-icon.vue";
import Logo from "./widgets/logo.vue";

// const requireComponent = require.context(
//   // The relative path of the components folder
//   "./",
//   // Whether or not to look in subfolders
//   true,
//   // The regular expression used to match component filenames who starts with "My"
//   "./**.vue"
// );

// const cache = {};

export default {
  install(app) {
    // const allComponents = require.context("./", true, /\.(vue)$/);
    // registerAll(allComponents, app);
    // requireComponent.keys().forEach(requireComponent);
    // console.log(requireComponent.keys());
    // for (const path in allComponents) {
    //   const component = allComponents[path];
    //   const fileName = path.split("/").pop().replace(".vue", "");
    //   const componentName = component.default.name || toPascalCase(fileName);
    //   app.component(componentName, component.default);
    // }
    app.component(toPascalCase("BottomPanel"), BottomPanel);
    app.component(toPascalCase("EditButton"), EditButton);
    app.component(toPascalCase("MirrorCard"), MirrorCard);
    app.component(toPascalCase("RctIcon"), RctIcon);
    app.component(toPascalCase("Logo"), Logo);
  },
};
