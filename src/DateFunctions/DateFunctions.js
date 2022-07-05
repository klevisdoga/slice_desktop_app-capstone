export const nextDate = (curDate) => {
    const date = new Date(curDate.split('-'))
    const nextDay = String(date.getDate()).padStart(2, '0')
    const nextMonth = String(date.getMonth() + 2).padStart(2, '0')
    const year = String(date.getFullYear())
    const nextDate = year + '-' + nextMonth + '-' + nextDay

    return nextDate
}

export const handleDates = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = String(today.getFullYear())
    let currentDate = year+month+day
    currentDate = (parseInt(currentDate))

    let nextWeek = new Date(today.getFullYear(), String(today.getMonth()).padStart(2, '0'), today.getDate() + 8).toISOString().slice(0, 10);
    nextWeek = parseInt(nextWeek.split('-').join(''))

    return {currentDate: currentDate, nextWeek: nextWeek}
}