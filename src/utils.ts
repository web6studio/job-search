import * as fs from "fs";

export const waitToTime = async (targetHour: number): Promise<void> => {
  const now = new Date();
  const targetTime = new Date(now);
  targetTime.setHours(targetHour, 0, 0, 0);

  if (now.getTime() > targetTime.getTime()) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  console.log(`Waiting until ${targetTime.toLocaleTimeString()}`);
  return new Promise((resolve) =>
    setTimeout(resolve, targetTime.getTime() - now.getTime())
  );
};

export const waitToWorkingHour = async (workHours: number[]): Promise<void> => {
  const currentHour = new Date().getHours();
  if (!(currentHour >= workHours[0] && currentHour < workHours[1])) {
    await waitToTime(workHours[0]);
  }
};

export const randomSecDelay = (min: number, max: number): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const loadJobIds = (filePath: string): Set<string> => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return new Set(data.split("\n").filter(Boolean));
  } catch (e) {
    return new Set();
  }
};

export const saveJobId = (jobId: string, filePath: string): void => {
  fs.appendFileSync(filePath, `${jobId}\n`);
};

export const loadConfig = (): Config[] => {
  const rawData = fs.readFileSync("./config.json", "utf-8");
  return JSON.parse(rawData);
};

export type Config = {
  BASE_URL: string;
  WORK_HOURS: [number, number];
  DELAY_SEC: [number, number];
  FILTERS: {
    INCLUDES: string[];
    EXCLUDES: string[];
  };
  TELEGRAM: TelegramConfig;
  JOBS_LIST_FILE: string;
  PORT?: string;
};

export type TelegramConfig = {
  BOT_TOKEN: string;
  CHAT_ID: string;
};
