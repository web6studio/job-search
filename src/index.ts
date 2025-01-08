import { chromium } from "playwright";
import {
  waitToWorkingHour,
  randomDelay,
  loadJobIds,
  saveJobId,
  loadConfig,
  Config,
} from "./utils";
import { sendTelegramMessage } from "./notifier";

const parseJobs = async (config: Config) => {
  console.log(`Base url: ${config.BASE_URL}`);
  console.log(`File for storing vacancies: ${config.JOBS_LIST_FILE}`);

  let browser = await chromium.connectOverCDP("http://localhost:9222");
  let context = browser.contexts()[0];

  while (true) {
    try {
      await waitToWorkingHour(config.WORK_HOURS);
      const page = await context.newPage();
      const jobIds = loadJobIds(config.JOBS_LIST_FILE);

      console.log("Load page...");
      await page.goto(config.BASE_URL || "");
      await page.waitForSelector("div[data-job-id]");

      const jobs = await page.$$("div[data-job-id]");
      for (const job of jobs) {
        const jobId = await job.getAttribute("data-job-id");
        if (jobIds.has(jobId || "")) continue;

        await page.waitForTimeout(1000);
        await job.click();
        await page.waitForTimeout(3000);

        const title = await page.textContent("h1 > a.ember-view");
        const description = await page.textContent(
          "div.jobs-description__content"
        );
        const skillsElement = await page.$(
          "button.job-details-jobs-unified-top-card__job-insight-text-button>a"
        );
        const skills = skillsElement
          ? await skillsElement.textContent()
          : "N/A";
        const jobUrl = await page.getAttribute(
          "div.t-24.job-details-jobs-unified-top-card__job-title a",
          "href"
        );
        const jobUrlFull = `https://www.linkedin.com${jobUrl}`;

        const matchesIncludes = config.FILTERS.INCLUDES.some((word: string) =>
          description?.includes(word)
        );
        const matchesExcludes = config.FILTERS.EXCLUDES.some((word: string) =>
          description?.includes(word)
        );

        if (matchesIncludes && !matchesExcludes) {
          const message = `New vacancy:\n*${title}*\n${skills}\nUrl: ${jobUrlFull}`;
          sendTelegramMessage(message, config.TELEGRAM);
        } else {
          console.log("The vacancy does not match the filters.");
        }

        saveJobId(jobId || "", config.JOBS_LIST_FILE);
      }

      page.close();
      console.log("Wait for next interaction");
    } catch (pageError: any) {
      console.error("Error during page interaction:", pageError.message);
      console.error("Reinitializing...");
      browser = await chromium.connectOverCDP("http://localhost:9222");
      context = browser.contexts()[0];
    }

    await randomDelay(config.DELAY[0], config.DELAY[1]);
  }
};

const main = async () => {
  const configs = loadConfig();

  try {
    await Promise.all(configs.map((config: Config) => parseJobs(config)));
  } catch (error: any) {
    console.log("Failed start parsing: ", error.message);
  }
};

main();
