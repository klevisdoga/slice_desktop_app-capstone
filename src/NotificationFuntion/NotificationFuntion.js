export const notfiyMe = (value) => {

    const notified = sessionStorage.getItem("notified")

    const showNotifcation = () => {
        let notification = new Notification("Slice App", {
            body: `You have ${value} upcoming ${value === 1 ? "subscription" : "subscriptions" } this week!`
        });

        notification.onClick = () => {
            window.open('https://ks-slice.herokuapp.com/login')
        }
    }

    if (Notification.permission === "granted" && notified !== "true") {
        showNotifcation()
        sessionStorage.setItem("notified", "true")
    }

    else if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotifcation()
            }
        })
    }

}