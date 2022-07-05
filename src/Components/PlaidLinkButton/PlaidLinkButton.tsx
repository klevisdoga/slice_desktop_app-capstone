import React, { useCallback, useState } from 'react';
import axios from "axios"
import { usePlaidLink, PlaidLinkOnSuccess } from 'react-plaid-link';

export default function PlaidLinkButton() {
  const [token, setToken] = useState<string | null>(null);
  const id = sessionStorage.getItem('user_id')

  // get link_token from your server when component mounts
  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_LOCAL_SERVER}/access/create_link_token`)
      .then(res => {
        setToken(res.data)
      })
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {

    axios.post(`${process.env.REACT_APP_LOCAL_SERVER}/access/public_token_exchange`, {
      public_token: publicToken
    })
      .then(res => {
        const access_token = res.data

        axios.post(`${process.env.REACT_APP_LOCAL_SERVER}/access/transactions/recurring`, {
          access_token: access_token,
          user_id: id
        })
          .then(resolve => {
            window.location.reload(true)
          })
      })
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
    // onEvent
    // onExit
  });

  return (
    <button className='account__settings-connect' onClick={() => open()} disabled={!ready}>
      Connect
    </button>
  );
};
