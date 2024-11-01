import { type Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

export default config;
