import React from 'react';

interface ErrorShowProps {
  error?: string;
}

const ErrorShow = ({ error }: ErrorShowProps) => {
  return (
    <div>
      <span style={{ color: 'red' , fontSize: 'small'}} className='pt-1' role='alert'>{error}</span>
    </div>
  );
};

export default ErrorShow;