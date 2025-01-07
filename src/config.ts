require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = process.env.BASE_URL;
const JOBS_LIST_FILE = process.env.JOBS_LIST_FILE || "jobs.txt";

const CONFIG = {
  BASE_URL,
  WORK_HOURS: [8, 24],
  DELAY: [5, 10],
  FILTERS: {
    INCLUDES: ["React", "TypeScript", "Remote"],
    EXCLUDES: ["gute Deutsch", "Proficiency in German"],
  },
  TELEGRAM: {
    BOT_TOKEN,
    CHAT_ID,
  },
  JOBS_LIST_FILE,
};

export default CONFIG;
