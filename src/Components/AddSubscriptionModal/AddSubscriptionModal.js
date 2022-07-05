import React from 'react'
import axios from 'axios'
import './AddSubscriptionModal.scss'
import close from '../../Assets/shape.png'
import { v4 as uuid } from 'uuid'
import { nextDate } from '../../DateFunctions/DateFunctions'

export default function AddSubscriptionModal({ closeModal, subscriptions }) {

    const user_id = sessionStorage.getItem('user_id')


    // function to submit new subscription to current users subscriptions in DB
    const formHandler = (ev) => {

        if (subscriptions) {
            const parsedSubscriptions = JSON.parse(subscriptions)

            ev.preventDefault()

            const newSubcriptionObject = {
                id: uuid(),
                name: ev.target.title.value,
                date: ev.target.date.value,
                nextDate: nextDate(ev.target.date.value),
                amount: ev.target.amount.value
            }

            //creating a new array containing the object created above and the already collected list of subscriptions
            const newSubcriptionArray = [...parsedSubscriptions, newSubcriptionObject]

            axios.post(`${process.env.REACT_APP_LOCAL_SERVER}/subscription/add`, { subscriptions: newSubcriptionArray, user_id: user_id })
                .then(res => {
                    console.log(res)
                    ev.target.reset()
                    closeModal()
                })
        }

        else if (!subscriptions) {

            const newSubscription = [{
                id: uuid(),
                name: ev.target.title.value,
                date: ev.target.date.value,
                nextDate: nextDate(ev.target.date.value),
                amount: ev.target.amount.value
            }]

            axios.post(`${process.env.REACT_APP_LOCAL_SERVER}/subscription/add`,
                { subscriptions: newSubscription, user_id: user_id })
                .then(res => {
                    console.log(res)
                    ev.target.reset()
                    closeModal()
                })
        }
    }

    return (
        <div className='addsub__modal-container'>
            <div className='addsub__modal'>
                <img onClick={closeModal} className='addsub__modal-close' src={close} alt='close pop-up button' />
                <h1 className='addsub__modal-title'>Add New Subscription</h1>
                <form type='submit' onSubmit={formHandler} className='addsub__modal-info'>
                    <div className='addsub__modal-info--box'>
                        <label htmlFor='title'>Name</label>
                        <input type='text' name='title' placeholder='Netflix' required />
                    </div>
                    <div className='addsub__modal-info--box'>
                        <label htmlFor='date'>Last Billing Date</label>
                        <input type='date' name='date' required />
                    </div>
                    <div className='addsub__modal-info--box'>
                        <label htmlFor='amount'>Amount</label>
                        <input type='text' name='amount' placeholder='12.99' required />
                    </div>
                    <button className='addsub__modal-add'>ADD</button>
                </form>
            </div>
        </div>
    )
}
