const dateFunction = require('./helpers/datefunction')

require('dotenv').config()

const head = {
    'apikey': process.env.SUPABASE_KEY,
    'Authorization': process.env.SUPABASE_AUTH,
    'Content-Type': 'application/json'
}

exports.checkUser = async (username) => {
    const res = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Profiles?telegram_id=eq.${username}`, {
        method: "GET",
        headers: head
    })
    const result = await res.json()
    if (result.length === 0) return false
    return true
}

exports.createUser = async (data) => {
    try {
        const { id, first_name, last_name, username } = data
        console.log({ first_name, id, last_name, telegram_id: username })
        await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Profiles`, {
            method: "POST",
            headers: head,
            body: JSON.stringify({ first_name, id, last_name, telegram_id: username })
        })
        return true
    }
    catch (err) {
        console.error(err)
        return false
    }
}


exports.addAmount = async (username, data, type) => {
    try {
        const { year, month, date } = dateFunction();
        //get Monthly amount

        let existingMonth = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_Monthy?telegram_id=eq.${username}&month=eq.${month}`,{
            headers:head
        })
        existingMonth = await existingMonth.json();
        let existingYear = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_Yearly?telegram_id=eq.${username}&year=eq.${year}`,{headers:head})
        existingYear = await existingYear.json();
        console.log(existingMonth,existingYear)

        
        // add new entry
        let res = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_All`, {
            method: "POST",
            headers:head,
            body: JSON.stringify({ date,amount:data, month, year, telegram_id: username,category:type })
        })
       
        //update monthly expenditure
        res = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_Monthy${existingMonth.length!==0?`?telegram_id=eq.${username}&month=eq.${month}`:``}`, {
            method: existingMonth.length!==0?"PATCH":"POST",
            headers:{...head,
                "Prefer":"return=minimal"
            },
            body:JSON.stringify({
                telegram_id:username,
                month,
                amount:existingMonth.length!==0?parseFloat(existingMonth[0].amount)+parseFloat(data):data,
                year
            })
        })
   
        //update yearly expenditure
        res = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_Yearly${existingYear.length!==0?`?telegram_id=eq.${username}&year=eq.${year}`:``}`, {
            method: existingYear.length!==0?"PATCH":"POST",
            headers:{...head,
                "Prefer":"resolution=merge-duplicates"        
            },
            body:JSON.stringify({
                telegram_id:username,
                amount:existingYear.length!==0?parseFloat(existingYear[0].amount)+parseFloat(data):data,
                year
            })
        })
        return true

    }
    catch (err) {
        console.log(err)
        return false
    }
}