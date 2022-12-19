/* eslint-disable react/prop-types */
import React from 'react';
import Modal from 'react-modal';

const ModalContainer = ({
  ModalState,
  changeModal,
  Content,
  contentProps
}) => (
  <Modal
    style={{
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(150, 150, 150, 0.75)',
      },
      content: {
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        left: '50%',
        border: '1px solid #ccc',
        textAlign: 'center',
        background: 'white',
        color: 'black',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '12px',
        width: '600px',
        height: '600px',
        outline: 'none',
        padding: '20px',
      },
    }}
    isOpen={ModalState}
    onRequestClose={() => changeModal(false)}
    className="image-modal"
  >
    <Content props={contentProps}/>
  </Modal>

);

export default ModalContainer;
