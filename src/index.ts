import { chromium } from "playwright";
import {
  waitToWorkingHour,
  randomDelay,
  loadJobIds,
  saveJobId,
  validateConfig,
} from "./utils";
import { sendTelegramMessage } from "./notifier";
import CONFIG from "./config";

const main = async () => {
  try {
    validateConfig();
    console.log(`Base url: ${CONFIG.BASE_URL}`);
    console.log(`File for storing vacancies: ${CONFIG.JOBS_LIST_FILE}`);

    const jobIds = loadJobIds(CONFIG.JOBS_LIST_FILE);

    const browser = await chromium.connectOverCDP("http://localhost:9222");
    const context = browser.contexts()[0];

    while (true) {
      try {
        await waitToWorkingHour(CONFIG.WORK_HOURS);
        const page = await context.newPage();

        console.log("Load page...");
        await page.goto(CONFIG.BASE_URL || "");
        await page.waitForSelector("div[data-job-id]");

        const jobs = await page.$$("div[data-job-id]");
        for (const job of jobs) {
          const jobId = await job.getAttribute("data-job-id");
          if (jobIds.has(jobId || "")) continue;

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

          const matchesIncludes = CONFIG.FILTERS.INCLUDES.some((word: string) =>
            description?.includes(word)
          );
          const matchesExcludes = CONFIG.FILTERS.EXCLUDES.some((word: string) =>
            description?.includes(word)
          );

          if (matchesIncludes && !matchesExcludes) {
            const message = `New vacancy:\n*${title}*\n${skills}\nUrl: ${jobUrlFull}`;
            sendTelegramMessage(message);
          } else {
            console.log("The vacancy does not match the filters.");
          }

          saveJobId(jobId || "", CONFIG.JOBS_LIST_FILE);
        }

        page.close();
        console.log("W8 for next interaction");
      } catch (pageError: any) {
        console.error("Error during page interaction:", pageError.message);
      }

      await randomDelay(CONFIG.DELAY[0], CONFIG.DELAY[1]);
    }
  } catch (error: any) {
    console.error("Global error:", error.message);
    process.exit(1);
  }
};

main();
