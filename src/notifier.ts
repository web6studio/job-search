import CONFIG from "./config";

const {
  TELEGRAM: { BOT_TOKEN, CHAT_ID },
} = CONFIG;

export const sendTelegramMessage = async (message: any) => {
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
  } catch (error: any) {
    console.error("Error sending message to Telegram: ", error.message);
  }
};
