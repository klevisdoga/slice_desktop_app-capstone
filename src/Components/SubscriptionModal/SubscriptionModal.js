import React, { useState } from 'react'
import './SubscriptionModal.scss'
import close from '../../Assets/shape.png'
import axios from 'axios'

export default function Modal({ closeModal, userSubs, selectedSub }) {

  const [deleted, setDeleted] = useState({selected:false, confirmed: false}) // to see if the user selected delete and/or confirmed their decision
  const user_id = sessionStorage.getItem('user_id')

  if(deleted.selected && deleted.confirmed){
    const filteredSubs = JSON.parse(userSubs.subscriptions).filter(info => info.id !== selectedSub)
 
    axios.delete(`${process.env.REACT_APP_LOCAL_SERVER}/subscription/delete`, {data: {
      subscriptions: filteredSubs,
      user_id: user_id
    }})
    .then(res => {
      console.log(res)
      closeModal()
    })
  }
  
  // to ensure the data is there before showing any details
  if (userSubs.status && userSubs.subscriptions) {

    const subInfo = JSON.parse(userSubs.subscriptions)
    const filteredInfo = subInfo.find(info => info.id === selectedSub)

    return (
      <div className='sub__modal-container'>
        <div className='sub__modal'>
          <img onClick={closeModal} className='sub__modal-close' src={close} alt='close pop-up button' />
          <h1 className='sub__modal-title'>{filteredInfo.name}</h1>
          <div className='sub__modal-info'>
            <div className='sub__modal-info-prev'>
              <h3 className='sub__modal-info-title'>Previous Billing Date:</h3>
              <span className='sub__modal-info-span'>{filteredInfo.date}</span>
            </div>
            <div className='sub__modal-info-amount'>
              <h3 className='sub__modal-info-title'>Amount:</h3>
              <span className='sub__modal-info-span'>{`$${filteredInfo.amount} USD`}</span>
            </div>
            <div className='sub__modal-info-next'>
              <h3 className='sub__modal-info-title'>Next Billing Date:</h3>
              <span className='sub__modal-info-span'>{filteredInfo.nextDate}</span>
            </div>
          </div>
          {!deleted.selected
            ? <button onClick={() => setDeleted({selected: true, confirmed: false})} className='sub__modal-delete'>DELETE</button>
            : "" }
            {deleted.selected ? 
            <div>
              <p>Are you sure you want to delete {filteredInfo.name}?</p>
              <div className='sub__modal-delete-container'>
                <button onClick={closeModal} className='sub__modal-delete-container--cancel'>CANCEL</button>
                <button onClick={() => setDeleted({selected: true, confirmed: true})} className='sub__modal-delete-container--delete'>DELETE</button>
              </div>
            </div> : ""}

        </div>
      </div>
    )
  }
}
