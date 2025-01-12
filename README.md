# Job Search Automation

Automate job searching on LinkedIn using Playwright and Rebrowser for human-like interaction to bypass automation detection.

## Features

- Automates LinkedIn job search.
- Supports configurable filters for job titles, keywords, and exclusions.
- Sends notifications for matching job vacancies directly to Telegram.
- Human-like delays and Rebrowser to avoid detection.

## Requirements

1. **Node.js**: Install from [Node.js Official Site](https://nodejs.org/en/download).
2. **Google Chrome**: Install from [Google Chrome](https://www.google.com/chrome/).
3. **Telegram**: Install Telegram Desktop from [Telegram Desktop](https://desktop.telegram.org/).
4. **Telegram Bot**: Create your bot using the [Telegram Bot Tutorial](https://core.telegram.org/bots/tutorial).

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/job-search.git
   cd job-search
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Chrome for debugging:

- **Windows:**
  ```bash
  "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\ChromeDebug"
  ```
- **macOS:**
  ```bash
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/Users/username/ChromeDebug"
  ```
- **Linux:**
  ```bash
  google-chrome --remote-debugging-port=9222 --user-data-dir="/home/username/ChromeDebug"
  ```
  > Note: Replace **username** with your system username.

4. Create a **config.json** file:

- Copy config-example.json
  ```bash
  cp config-example.json config.json
  ```
- Fill in the required configuration details (see below for explanation).

5. Run the Script:
   ```bash
   npm run
   ```

## Configuration File (`config.json`)

Example `config.json`:

```json
[
  {
    "BASE_URL": "https://www.linkedin.com/jobs/search/?distance=25&f_TPR=r86400&geoId=100477049&keywords=(Frontend%20OR%20%22Frontend%20Developer%22%20OR%20%22React%20Developer%22%20OR%20%22Mobile%20Developer%22%20OR%20%22React%20Native%20Developer%22%20OR%20%22Full%20Stack%20Developer%22%20OR%20%22TypeScript%20Developer%22%20OR%20%22JavaScript%20Developer%22%20OR%20%22Frontend%20Entwickler%22%20OR%20%22Mobile%20Entwickler%22%20OR%20%22Fullstack%20Entwickler%22)%20AND%20(React%20AND%20Developer)&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&sortBy=DD",
    "WORK_HOURS": [8, 24],
    "DELAY_SEC": [300, 600],
    "FILTERS": {
      "INCLUDES": ["React", "TypeScript", "Remote"],
      "EXCLUDES": ["gute Deutsch", "Proficiency in German"]
    },
    "TELEGRAM": {
      "BOT_TOKEN": "SOME_BOT_TOKEN",
      "CHAT_ID": "SOME_CHAT_ID"
    },
    "JOBS_LIST_FILE": "jobs.txt",
    "PORT": 9222
  }
]
```

### **Configuration Keys Explained:**

- **BASE_URL:** URL of the website to parse (e.g., LinkedIn job search. Should include url filters params).
- **WORK_HOURS:** Array defining active hours for the bot in 24-hour format ([startHour, endHour]).
- **DELAY_SEC:** Delay between requests in seconds ([minDelay, maxDelay]).
- **INCLUDES:** Keywords to include in the content (e.g., React, TypeScript).
- **EXCLUDES:** Keywords to exclude (e.g., gute Deutsch, Proficiency in German).
- **BOT_TOKEN:** Your Telegram bot token.
- **CHAT_ID:** Telegram chat ID to send notifications.
- **JOBS_LIST_FILE:** File to store processed item IDs to avoid duplicates.
- **PORT:** Port for Chrome remote debugging (default: 9222).

## Customizing for Other Websites

The parser can be adapted to automate tasks for other websites, such as searching for apartments. To do this, modify the logic for interacting with the website's HTML in **./src/parser.ts**. Adjust selectors and interactions to match the target website's structure.

## License

This project is licensed under the [MIT License](./LICENSE).
