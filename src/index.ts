import { loadConfig, Config } from "./utils";
import { parseJobs } from "./parser";

const main = async () => {
  const configs = loadConfig();

  try {
    await Promise.all(configs.map((config: Config) => parseJobs(config)));
  } catch (error: any) {
    console.log("Failed start parsing: ", error.message);
  }
};

main();
