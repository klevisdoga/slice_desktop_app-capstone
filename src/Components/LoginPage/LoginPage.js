import React, { useState, useEffect } from 'react'
import './LoginPage.scss'
import axios from 'axios'
import SubscriptionModal from '../../Components/SubscriptionModal/SubscriptionModal'
import AddSubscriptionModal from '../../Components/AddSubscriptionModal/AddSubscriptionModal'
import PlaidLinkButton from '../../Components/PlaidLinkButton/PlaidLinkButton.tsx'
import { v4 as uuid } from 'uuid'
import { handleDates } from '../../DateFunctions/DateFunctions'
import {addTotalMonth, addTotalWeek } from '../../SubTotalFunction';
import { notfiyMe } from '../../NotificationFuntion/NotificationFuntion'
import UpdateInfoModal from '../../Components/UpdateInfoModal/UpdateInfoModal'

export default function LoginPage() {

    const [error, setError] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [updateInfo, setUpdateInfo] = useState(false)
    const [connected, setConnected] = useState(false)
    const [manually, setManually] = useState(false)
    const [userData, setUserData] = useState(false)
    const [userSubs, setUserSubs] = useState({ status: false, subscriptions: [] })
    const [selectedSub, setSelectedSub] = useState('')
    const [upcoming, setUpcoming] = useState({ status: false, subscriptions: [] })

    let monthTotal = 0
    let weekTotal = 0


    if (userData && userSubs.subscriptions && upcoming.subscriptions) {
        const data = JSON.parse(userData.subscriptions)

        const monthAmounts = data.map(item => {
            return parseFloat(item.amount)
        })

        const weekAmounts = upcoming.subscriptions.map(price => {
            return parseFloat(price.amount)
        })
        
        monthTotal = addTotalMonth(monthAmounts)
        weekTotal = addTotalWeek(weekAmounts)
    };



    const token = sessionStorage.getItem('token')
    const connection = sessionStorage.getItem('connection')

    const handleLoggedIn = () => {
        setLoggedIn(true)
    }
    const signOut = () => {
        setLoggedIn(false)
        sessionStorage.removeItem('connection')
        sessionStorage.removeItem('notified')
    }
    const handleSettings = () => {
        setShowSettings(true)
    }
    const handleCloseSettings = () => {
        setShowSettings(false)
    }
    const openModal = (id) => {
        setModalOpen(true)
        setSelectedSub(id)
    }
    const openAddModal = () => {
        setAddNew(true)
    }
    const openUpdateModal = () => {
        setUpdateInfo(true)
    }
    const closeModal = () => {
        setModalOpen(false)
        setAddNew(false)
        setUpdateInfo(false)
        window.location.reload(true)
    }

    //Function for handling if the user chose to add subscriptions manually
    const handleManually = () => {
        setConnected(false)
        sessionStorage.setItem("connection", "manually")
        window.location.reload(true)
    }
    // function to tell the browser what to do on inital render of the page
    useEffect(() => {

        if (!token) {
            signOut()
        } else if (token) {
            handleLoggedIn()
        }

        const currentDate = handleDates().currentDate; // creating a current date to compare next billing date and current  
        const nextWeek = handleDates().nextWeek; //creating a 'next week date'

        const handleUpcoming = () => {
            let upcomingSubs = []

            //filter that finds the subscriptions that are coming up within the following 7 days
            if (userSubs.status && userSubs.subscriptions) {
                upcomingSubs = JSON.parse(userSubs.subscriptions)
                    .filter(item => {
                        return parseInt(item.nextDate.split('-').join('')) < nextWeek
                    })
                    .filter(item => {
                        return parseInt(item.nextDate.split('-').join('')) >= currentDate
                    })
                setUpcoming({ status: true, subscriptions: upcomingSubs })

                // to ensure that if there are no upcoming subs, status remains false
                if (upcomingSubs.length === 0) {
                    setUpcoming({ status: false, subscriptions: [] })
                }
                else if (upcomingSubs.length !== 0) {
                    notfiyMe(upcomingSubs.length)
                }
            }
        }

        // Get the users data(subscriptions) from DB .then setting it to their appropriate states
        axios.get(`${process.env.REACT_APP_LOCAL_SERVER}/account`, {
            headers: {
                authorization: 'Bearer ' + token
            },
        })
            .then(res => [
                setUserSubs({ status: true, subscriptions: res.data[0].subscriptions }),
                setUserData(res.data[0]),
                res.data[0].connected === 'true' ? setConnected(true) : '',
            ])

        if (connection === 'manually') {
            setManually(true)
        }

        handleUpcoming();

    }, [token, userSubs.status, userSubs.subscriptions, connection]);

    const formHandler = (ev) => {
        ev.preventDefault()

        axios.post(`https://kd-slice-server.herokuapp.com/login`, {
            email: ev.target.email.value,
            password: ev.target.password.value
        }).then((res) => {
            sessionStorage.setItem('token', res.data.token)
            sessionStorage.setItem('user_id', res.data.user_id)

            setLoggedIn(true)
        })
            .catch(() => {
                setError(true)
            })
    }
    if (!loggedIn) {
        return (
            <div className='login'>
                <h1 className='login__title'>Welcome Back.</h1>
                <div className='login__main'>
                    <h2 className='login__main-title'>Log in to your <br /> Slice account.</h2>
                    <form className='login__form' type='submit' onSubmit={formHandler} >
                        <input type='text' name='email' placeholder='Your email address' required />
                        <div className='login__form-bottom'>
                            <input type='password' name='password' className='login__form-bottom-password' placeholder='Password' required />
                            {error ? <p className='login__form--dnm'>Incorrect Email/Password!</p> : ''}
                        </div>
                        <button className='login__form-button'>Log in</button>
                    </form>
                    <div className='signup__redirect'>
                        <p className='signup__redirect-text'>Don't have an account? Visit https://kd-slice.herokuapp.com/signup</p>
                    </div>
                </div>
            </div>
        )
    } else if (loggedIn && token && !showSettings) {
        return (
            <div className='account'>
                <div className='account__title-container'>
                    <div className='account__nav'>
                        <h2 className='account__title' >ACCOUNT</h2>
                        <h2 onClick={handleSettings} className='account__title'>SETTINGS</h2>
                    </div>
                    {/* <p className='account__signout' onClick={signOut}>Sign Out</p> */}
                </div>

                {/* Upcoming subscriptions */}
                <div className='account__main'>
                    <div className='account__upcoming'>
                        <h1 className='account__upcoming-title'>Upcoming:</h1>
                        <div className='account__upcoming-list'>
                            {upcoming.status ? upcoming.subscriptions?.map(info => {
                                return (
                                    <div key={uuid()} className='account__upcoming-listitem'>
                                        <h3 className='account__upcoming-listitem-title'>{info.name}</h3>
                                        {parseInt(info.nextDate.split('-').join('')) === handleDates().currentDate
                                            ? <span className='account__upcoming-listitem-date'>Today</span>
                                            : <span className='account__upcoming-listitem-date'>{info.nextDate}</span>}
                                        <span className='account__upcoming-listitem-date'>{`$${info.amount} USD`}</span>
                                    </div>
                                )
                            }) : <p>No upcoming subscriptions</p>}
                        </div>
                    </div>

                    {/* List of all subscriptions */}
                    <div className='account__all'>
                        <h1 className='account__all-title'>All Subscriptions:</h1>
                        <div className='account__all-list'>
                            {userSubs.status && userSubs.subscriptions ? JSON.parse(userSubs.subscriptions).map(subs => {
                                return (
                                    <div key={uuid()} className='account__all-listitem'>
                                        <h3 onClick={() => openModal(subs.id)} className='account__all-listitem-title'>{subs.name}</h3>
                                    </div>
                                )
                            }) : ''}
                            <div className='account__all-listitem'>
                                <button onClick={openAddModal} className='account__all-listitem--add'>Add</button>
                            </div>
                        </div>
                    </div>
                    <div className='account__spending'>
                        <h1 className='account__spending-title'>Total Spending:</h1>
                        <div className='account__spending-container'>
                            <div className='account__spending-month'>
                                <h2>This month:</h2>
                                <h1>{`$${monthTotal}`}</h1>
                            </div>
                            <div className='account__spending-week'>
                                <h2>This week:</h2>
                                <h1>{`$${weekTotal}`}</h1>
                            </div>
                        </div>
                    </div>


                </div>
                {modalOpen ? <SubscriptionModal selectedSub={selectedSub} userSubs={userSubs} closeModal={closeModal} /> : ''}
                {addNew ? <AddSubscriptionModal closeModal={closeModal} subscriptions={userSubs.subscriptions} /> : ''}
                {updateInfo ? <UpdateInfoModal closeModal={closeModal} userData={userData} /> : ""}
            </div>
        )
    } else if (showSettings) {
        return (
            <div className='account'>
                <div className='account__title-container'>
                    <div className='account__nav'>
                        <h2 onClick={handleCloseSettings} className='account__title' >ACCOUNT</h2>
                        <h2 className='account__title'>SETTINGS</h2>
                    </div>
                    {/* <p className='account__signout' onClick={signOut}>Sign Out</p> */}
                </div>
                <div className='account__main'>
                    <div className='account__settings'>
                        <div className='account__settings-profile'>
                            <h3 className='account__settings-profile-title'>My Profile</h3>
                            <div className='account__settings-profile-info'>
                                <div className='account__settings-profile-info-container'>
                                    <h3 className='account__settings-profile-info-title'>Account Information</h3>
                                    <h4 className='account__settings-profile-info-span'>{`${userData.firstName} ${userData.lastName}`}</h4>
                                    <h4 className='account__settings-profile-info-span'>{userData.userName ? userData.userName : ''}</h4>
                                    <h4 className='account__settings-profile-info-span'>{userData.email}</h4>
                                    <div className='account__settings-profile-info-buttons'>
                                        <span onClick={openUpdateModal} className='account__settings-profile-info-edit'>Edit</span>
                                        <span onClick={signOut} className='account__settings-profile-info-edit'>Sign Out</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='account__settings-profile'>
                            <h3 className='account__settings-profile-title'>Prefrences</h3>
                            <div className='account__settings-profile-info'>
                                <div className='account__settings-profile-info-container'>
                                    <h3 className='account__settings-profile-info-title'>Display Preferences</h3>
                                    <h4 className='account__settings-profile-info-span'>Theme: Dark Mode</h4>
                                    <h4 className='account__settings-profile-info-span'>Notifications: On</h4>
                                    <div className='account__settings-profile-info-buttons'>
                                        <span onClick={openUpdateModal} className='account__settings-profile-info-edit'>Edit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='account__settings-profile'>
                            <h3 className='account__settings-profile-title'>My Card</h3>
                            <div className='account__settings-profile-info'>
                                {connected ?
                                    <>
                                        <div className='account__settings-profile-info-container'>
                                            <h3 className='account__settings-profile-info-title'>Card Information</h3>
                                            <h4 className='account__settings-profile-info-span'>VISA ---- 1001</h4>
                                            <h4 className='account__settings-profile-info-span'>7/12</h4>
                                            <span className='account__settings-profile-info-edit'>Edit <span className='account__settings-profile-info-edit--divider'>|</span> </span>
                                            <span onClick={handleManually} className='account__settings-profile-info-edit'>Remove</span>
                                        </div>
                                        <div className='account__settings-profile-info-container'>
                                            <h3 className='account__settings-profile-info-title'>Account Balance</h3>
                                            <h4 className='account__settings-profile-info-span'>$0.01 USD</h4>
                                        </div>
                                    </>
                                    :
                                    <div className='account__settings-profile-info-container'>
                                        <PlaidLinkButton />
                                    </div>}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}
