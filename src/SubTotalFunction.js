export const addTotalMonth = (value) => {
    let total = 0

    for(let i in value ) {
        total += value[i]
    }
    return total
}

export const addTotalWeek = (value) => {
    let total = 0

    for(let i in value ) {
        total += value[i]
    }
    return total
}