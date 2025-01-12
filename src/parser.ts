import { chromium } from "playwright";
import { sendTelegramMessage } from "./notifier";
import {
  waitToWorkingHour,
  randomSecDelay,
  loadJobIds,
  saveJobId,
  Config,
} from "./utils";

export const parseJobs = async (config: Config) => {
  const JOBS_LIST_FILE = config.JOBS_LIST_FILE || "jobs.txt";
  const HOST = `http://localhost:${config.PORT || 9222}`;

  console.log(`Base url: ${config.BASE_URL}`);
  console.log(`File for storing vacancies: ${JOBS_LIST_FILE}`);

  let browser = await chromium.connectOverCDP(HOST);
  let context = browser.contexts()[0];

  while (true) {
    try {
      await waitToWorkingHour(config.WORK_HOURS);

      console.log("Load page...");
      const page = await context.newPage();
      const jobIds = loadJobIds(JOBS_LIST_FILE);
      await page.goto(config.BASE_URL);
      // Humanization
      await randomSecDelay(6, 10);

      const jobs = await page.$$("div[data-job-id].job-card-container");
      for (const job of jobs) {
        const jobId = await job.getAttribute("data-job-id");
        if (jobIds.has(jobId || "")) continue;

        await job.click();
        // Humanization
        await randomSecDelay(3, 6);

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

        const matchesIncludes = config.FILTERS.INCLUDES.some((word: string) =>
          description?.includes(word)
        );
        const matchesExcludes = config.FILTERS.EXCLUDES.some((word: string) =>
          description?.includes(word)
        );

        if (matchesIncludes && !matchesExcludes) {
          const message = `New vacancy:\n*${title}*\n${skills}\nUrl: https://www.linkedin.com${jobUrl}`;
          sendTelegramMessage(message, config.TELEGRAM);
        } else {
          console.log("The vacancy does not match the filters.");
        }

        saveJobId(jobId || "", JOBS_LIST_FILE);
      }

      page.close();
      console.log("Wait for next interaction");
    } catch (pageError: any) {
      console.error("Error during page interaction:", pageError.message);
      console.error("Reinitializing...");
      browser = await chromium.connectOverCDP(HOST);
      context = browser.contexts()[0];
    }

    // Humanization
    await randomSecDelay(config.DELAY_SEC[0], config.DELAY_SEC[1]);
  }
};
