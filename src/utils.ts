import * as fs from "fs";

export const isWorkingHour = (workHours: number[][]): boolean => {
  const currentHour = new Date().getHours();
  return workHours.some(
    ([start, end]) => currentHour >= start && currentHour < end
  );
};

export const randomDelay = (min: number, max: number): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min) * 60000;
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

export const validateConfig = (): void => {
  const requiredVars = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"];
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `The following required environment variables are missing: ${missingVars.join(
        ", "
      )}`
    );
  }
};
