import { Context } from "telegraf";
import { CompanyController } from "../../controllers/company.controller.js";

const companyController = new CompanyController();

export async function companyHandler(c: Context) {
  //   console.log("Company handler called");
  if (!c.message || !("text" in c.message)) {
    return;
  }
  //   console.log("[Handler] Raw message:", c.message.text);

  // Split the command and everything after it
  const [, ...parts] = c.message.text.trim().split(/\s+/);
  const company = parts.join(" ");
  //   console.log("[Handler] Parsed company:", company);
  if (!company) {
    await c.reply("Usage:\n/company Apple");
    return;
  }
  // indicate that the bot is processing the request
  await c.sendChatAction("typing");

  try {
    // find the company intelligence using the CompanyController
    const result = await companyController.getCompanyIntelligence(company);

    const response = `
        🏢 ${result.company} (${result.symbol})
        💰 Current Price: $${result.quote.c}
        📈 Change: ${result.quote.d} (${result.quote.dp}%)
        🧠 AI Insight
        ${result.explanation}
        `.trim();

    await c.reply(response);
  } catch (error) {
    console.error("Error in companyHandler:", error);
    await c.reply("Sorry, I couldn't find that company.");
  }
}
