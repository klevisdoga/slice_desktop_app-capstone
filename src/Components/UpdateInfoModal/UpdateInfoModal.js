import React from 'react'
import axios from 'axios'
import './UpdateInfoModal.scss'
import close from '../../Assets/shape.png'

export default function UpdateInfoModal({ closeModal, userData, handleLoggedOut }) {
    const user_id = sessionStorage.getItem('user_id')

    // function to update users information in DB
    const formHandler = (ev) => {
        ev.preventDefault()

        axios.put(`${process.env.REACT_APP_LOCAL_SERVER}/user/update`, {
            user_id: user_id,
            firstName: ev.target.firstName.value,
            lastName: ev.target.lastName.value,
            email: ev.target.email.value
        })
        .then(() => {
            closeModal()
            handleLoggedOut()
        })


    }

    return (
        <div className='updateinfo__modal-container'>
            <div className='updateinfo__modal'>
                <img onClick={closeModal} className='updateinfo__modal-close' src={close} alt='close pop-up button' />
                <h1 className='updateinfo__modal-title'>Update your information</h1>
                <form type='submit' onSubmit={formHandler} className='updateinfo__modal-info'>
                    <div className='updateinfo__modal-info--box'>
                        <label htmlFor='firstName'>First Name</label>
                        <input type='text' name='firstName' defaultValue={userData.firstName} required />
                    </div>
                    <div className='updateinfo__modal-info--box'>
                        <label htmlFor='lastName'>Last Name</label>
                        <input type='text' name='lastName' defaultValue={userData.lastName} required />
                    </div>
                    <div className='updateinfo__modal-info--box'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' name='email' defaultValue={userData.email} required />
                    </div>
                    <button className='updateinfo__modal-add'>UPDATE</button>
                </form>
            </div>
        </div>
    )
}
