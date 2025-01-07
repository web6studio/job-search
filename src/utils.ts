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
  const requiredVars = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "BASE_URL"];
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `The following required environment variables are missing: ${missingVars.join(
        ", "
      )}`
    );
  }
};
