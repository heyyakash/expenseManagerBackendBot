const dateFunction=()=>{
    const newDate = new Date()
    const dateArr = newDate.toISOString().split('T')[0].split('-')
    const year = dateArr[0]
    const month = dateArr[1]
    const date = dateArr[2]
    return {year,month,date}
}

module.exports = dateFunction