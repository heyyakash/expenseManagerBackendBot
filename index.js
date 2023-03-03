const express = require('express')
const app = express()
const userRouter = require('./Routes/Routes')
const loginRouter = require('./Routes/login')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api');
const { checkUser, createUser, addAmount, generatePassword } = require('./apis');
const { options } = require('./Routes/Routes')
require('dotenv').config()

app.use(cors({
    origin:'*'
}))
app.use(express.json())

// app.use('/',async(req,res)=>{
//     res.send("Heheh")
// })
app.use('/user',userRouter)
app.use('/action',loginRouter)

app.listen(5000,()=>{
    console.log("Server Running")
})


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
        if(res){
                bot.sendMessage(chatId,'Account Created Successfully')
            }
        else{
            bot.sendMessage(chatId,"Some Error Occuered")
        }
    }
    else{
        bot.sendMessage(chatId,"Welcome Back!!")
    }
    bot.sendMessage(chatId,"To log expenditure, enter : /category amount\n\nExample '/food 120'\n\n👆This conveys that you have spent Rs.120 on food🥘\n\nYou can find the categories in the menu or just type '/' .Enjoy!! 😎")
})

bot.onText(/\/pwd/,async(msg,match)=>{
    const chatId = msg.from.id
    const user = msg.from.username
    if(!user) bot.sendMessage(chatId,"It seems you are using telegram without username. Please add username to continue")
    else{
        const res = await generatePassword(user)
        if(res.status){
            bot.sendMessage(chatId,`Your OTP is : ${res.password    }`)
        }
    }
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
    else if(type==="start"|| type ==="pwd"){}
    else{
        bot.sendMessage(chatId,'Invalid Choice')
    }
    
})

bot.onText(/\/spent (.+)/,(msg,match)=>{
    console.log(msg,match)
    bot.sendMessage(msg.from.id,"Choose a category",{
        "reply_markup":{
            "keyboard":arr.map((x)=>[x])
        }
    })
})

