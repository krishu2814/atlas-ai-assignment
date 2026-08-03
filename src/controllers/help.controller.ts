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

❓ /help
Show available commands.

💬 Chat
Simply send a message to chat with Atlas AI.
`;
  }
}
