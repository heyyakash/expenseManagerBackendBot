require('dotenv').config()

const head = {
    apikey: process.env.SUPABASE_KEY,
    Authorization: process.env.SUPABASE_AUTH
}


exports.getAlldata = async (req, res) => {
    try {
        const { user, date, month, year } = req.body

        //Today's data
        let resDaily = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_All?telegram_id=eq.${user}&date=eq.${date}&month=eq.${month}&year=eq.${year}`,
            {
                headers: head
            })
        const resultDaily = await resDaily.json();


        //This month daily spending
        const resCurrentMonthly = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_All?telegram_id=eq.${user}&month=eq.${month}&year=eq.${year}`,
            {
                headers: head
            })
        const resultDailyCurrentMonth = await resCurrentMonthly.json();


        const resMonthly = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_Monthy?telegram_id=eq.${user}&month=eq.${month}&year=eq.${year}`,
            { headers: head })
        const resultMonthly = await resMonthly.json()

        
        const resYearly = await fetch(`https://srhzlwxqryucqsogslue.supabase.co/rest/v1/Expenditure_Yearly?telegram_id=eq.${user}&year=eq.${year}`, {
            headers: head
        })
        const resultYearly = await resYearly.json()
        res.status(200).json({ resultDaily, resultMonthly, resultYearly, resultDailyCurrentMonth })
    }
    catch (err) {
        console.error("Some Error Occuered")
        res.status(500).json(err)
    }

}