require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = process.env.BASE_URL;
const JOBS_LIST_FILE = process.env.JOBS_LIST_FILE || "jobs.txt";

const CONFIG = {
  BASE_URL,
  WORK_HOURS: [
    [8, 10],
    [12, 15],
    [17, 20],
  ],
  DELAY: {
    SHORT: [5, 10],
    LONG: [20, 40],
  },
  TELEGRAM: {
    BOT_TOKEN,
    CHAT_ID,
  },
  JOBS_LIST_FILE,
};

export default CONFIG;
