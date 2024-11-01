import type { PlopTypes } from "@turbo/gen";
import pkg from '../../package.json'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("package", {
    description: "Create a new package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Name of the package"
      },
      {
        type: "input",
        name: "description",
        message: "Description of the package"
      },
      {
        type: "list",
        name: "type",
        message: "Type of the package",
        choices: ["native", "node"]
      }
    ],
    actions: (answers) => {
      if (!answers) {
        throw new Error("Answers are required");
      }

      answers.scope = pkg.name

      if ("name" in answers && typeof answers.name === 'string') {
        if (!answers.name.startsWith("@")) {
          answers.name = `@${pkg.name}/${answers.name}`
        }
      }

      const nodeTemplate = "templates/package-node"
      const nativeTemplate = "templates/package-native"

      const template = answers.type === 'node' ? nodeTemplate : nativeTemplate

      return [{
        type: "addMany",
        destination: "{{ turbo.paths.root }}/packages/{{ kebabCase name }}",
        base: template,
        templateFiles: template
      }]
    }
  })
}
