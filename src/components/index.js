import { toPascalCase } from "~/utils/string";

export default {
  install(app) {
    const allComponents = import.meta.globEager("./**.vue");
    for (const path in allComponents) {
      const component = allComponents[path];
      const fileName = path.split("/").pop().replace(".vue", "");
      const componentName = component.default.name || toPascalCase(fileName);
      app.component(componentName, component.default);
    }
  },
};
