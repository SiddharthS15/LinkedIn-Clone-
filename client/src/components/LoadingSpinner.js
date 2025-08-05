import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-3 text-muted">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
