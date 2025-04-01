'use client';
const ErrorAlertComponent = dynamic(()=> import('@/component/alerts/error'))
import getErrorType from '@/utils/getErrorType';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
const ScanQrComponent = dynamic(() => import('@/component/icons/scan'));


const Error = ({ error, reset }) => {
  useEffect(() => {
    console.error('Error boundary caught an error:', error);
  }, [error]);

  const errorType = useMemo(() => getErrorType(error.error), [error]);

  const renderErrorContent = () => {
    console.log(errorType)
    switch (errorType) {
      case 'sequelize':
        return (
          <ErrorAlertComponent message='Database Error' msgDetail='There was an issue with the database. Please check input and try again later.' buttons={[
            {
              label: 'Scan Again',
              onClick: () => console.log('Scan Again clicked'),
              icon: <ScanQrComponent />,
            },
          ]} />
        );

      case 'sessionExpired':
        return (
          <ErrorAlertComponent message='Session Expired' msgDetail='Your session has expired. Please scan the QR code again to continue.' buttons={[
            {
              label: 'Scan Again',
              onClick: () => console.log('Scan Again clicked'),
              icon: <ScanQrComponent />,
            },
          ]} />
        );

      case 'tableOccupied':
        return (
          <ErrorAlertComponent message='Table Occupied' msgDetail='This table is already occupied. Please join the existing session or create a new one.' buttons={[
            {
              label: 'Join Existing',
              onClick: () => console.log('Join existing clicked'),
              // icon: <ScanQrComponent />,
            },
            {
              label: 'Join New',
              onClick: () => console.log('Join New clicked'),
              // icon: <ScanQrComponent />,
            },
          ]}  />
        );

      default:
        return (
          <ErrorAlertComponent />
        );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      {renderErrorContent()}
  </div>
  
  
  );
};

export default Error;