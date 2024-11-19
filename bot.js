const TelegramBot = require('node-telegram-bot-api');

// 替换为您的 Bot Token
const token = '7707942258:AAEd2sWtWtC2X6R2tAtgh13dOc6gvfgG2ZQ';
const bot = new TelegramBot(token, { polling: true });

console.log('Bot is running...');

// 替换为您的已部署应用程序的 URL
const deployedUrl = 'https://ecc0-2001-f90-48a0-22ef-897e-3303-8614-f5c8.ngrok-free.app';

// 处理 /start 命令
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `欢迎使用 NFT 红包迷你应用！请访问以下链接以开始：${deployedUrl}`);
});

// 处理其他消息
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // 在这里处理其他消息
});
