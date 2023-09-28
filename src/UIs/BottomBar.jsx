import React from 'react';
import './bottombar.css';

function BottomBar() {
  return (
    <div className="BottomBar">
      <div className="bottom-bar">
        <button className="login-button"><a className="plain-href" href="/accounts">Accounts</a></button>
      </div>
    </div>
  );
}

export {BottomBar};