import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomButton({ onClick, children }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {children}
    </button>
  );
}

export default CustomButton;
