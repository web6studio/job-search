import { TelegramConfig } from "./utils";

export const sendTelegramMessage = async (
  message: string,
  telegramConfig: TelegramConfig
) => {
  const { BOT_TOKEN, CHAT_ID } = telegramConfig;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log("Message sent to Telegram!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending message to Telegram: ", error.message);
    } else {
      console.error("Unknown sending message to Telegram: ", error);
    }
  }
};
