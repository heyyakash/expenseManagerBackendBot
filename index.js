const TelegramBot = require('node-telegram-bot-api');
const { checkUser, createUser, addAmount } = require('./apis');
require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT;

const arr = ['food','investment','grocery','commute','medical','clothing','electronics','personal','education','entertainment']

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/,async (msg,match)=>{
    const chatId = msg.from.id
    const check = await checkUser(msg.from.username)
    if(!check){
        const res =await createUser(msg.from)
        if(res) {bot.sendMessage(chatId,'Account Created Successfully')}
        else {bot.sendMessage(chatId,"Some Error Occuered")}
    }
    else{
        bot.sendMessage(chatId,"Welcome Back!!")
    }
    bot.sendMessage(chatId,"To log expenditure, enter : /category amount\n\nExample '/food 120'\n\n👆This conveys that you have spent Rs.120 on food🥘\n\nYou can find the categories in the menu or just type '/' .Enjoy!! 😎")
})

bot.onText(/\/(.+)/,async(msg,match)=>{
    const chatId = msg.from.id
    const type = match[1].split(' ')[0]
    // console.log(arr.includes(type))
    if(arr.includes(type)){
        const amt = match[1].split(' ')[1]
        if(parseInt(amt)!=amt){
            bot.sendMessage(chatId,'Enter a valid amount')
        }
        else{
            const res = addAmount(msg.from.username,amt,type)
            if(res) bot.sendMessage(chatId,`Rs.${amt} spent on ${type}. Added`)
            else bot.sendMessage(chatId,'Some Error Occured')
    }
    }
    else if(type==="start"){}
    else{
        bot.sendMessage(chatId,'Invalid Choice')
    }
    // console.log(msg,match)
    
})