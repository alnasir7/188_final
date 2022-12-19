/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';

const handleClick = (up) => {
  if (up) {
    alert('upvoted');
  } else {
    alert('downvoted');
  }
};

const Votes = ({
  up,
  down
}) => (
  <div>
    <div role="button" tabIndex={0} className="is-clickable" onClick={() => handleClick(true)}
         style={{ display: 'inline-block' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <img src={`${process.env.PUBLIC_URL}/icons/chevron-up.svg`} alt="upvote"/>
        <span style={{ marginLeft: '5px' }}>{up}</span>
      </div>
    </div>
    <div role="button" tabIndex={0} className="is-clickable" onClick={() => handleClick(false)}
         style={{
           display: 'inline-block',
           marginLeft: '20px'
         }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <img style={{ margin: '0 auto' }} src={`${process.env.PUBLIC_URL}/icons/chevron-down.svg`}
             alt="upvote"/>
        <span style={{ marginLeft: '5px' }}>{down}</span>
      </div>
    </div>
  </div>
);

export default Votes;
