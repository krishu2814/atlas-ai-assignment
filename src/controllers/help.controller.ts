export class HelpController {
  getHelp(): string {
    return `
🤖 Atlas AI Commands

👤 /profile
View your saved profile.

✏️ /update
Update your profile information.

🔄 /reset
Reset your profile and restart onboarding.

📰 /news <topic>
Get latest curated news.

🌅 /brief
Generate your personalized daily intelligence brief.

🏢 /company <name>
Deep company intelligence and profile.

📈 /stock <symbol>
Real-time stock price and AI market analysis.

📋 /watchlist [add|remove] <name>
Manage your personal market watchlist.

🧠 /memory
View extracted memory and facts.

❓ /help
Show available commands.

💬 Chat
Simply send any message to chat with Atlas AI.
`.trim();
  }
}

