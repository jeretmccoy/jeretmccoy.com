import React from 'react';
import './bottombar.css';

function BottomBar() {
  const admin = localStorage.getItem('admin');

  const welcome = () => {
    if (localStorage.getItem('name'))
    {
      return 'Welcome, ' + localStorage.getItem('name');
    }
    else
    {
      return 'Not logged in.';
    }
  };



  return (
    <div className="BottomBar">
      <div className="bottom-bar">
        { admin ? (
                <button className="login-button"><a className="plain-href" href="/makePost">Make Post</a></button>
            ) : (
                <div></div>
            )
        }
        <p className="bottomp">{welcome()}</p>
        <button className="login-button"><a className="plain-href" href="/accounts">Accounts</a></button>
      </div>
    </div>
  );
}

export {BottomBar};