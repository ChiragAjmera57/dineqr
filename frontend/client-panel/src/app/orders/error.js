"use client";
const ErrorAlertComponent = dynamic(() => import("@/component/alerts/error"));
import joinExisting from "@/services/joinExisting";
import joinNewTable from "@/services/joinNew";
import getErrorType from "@/utils/getErrorType";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
const ScanQrComponent = dynamic(() => import("@/component/icons/scan"));

const Error = ({ error, reset }) => {
  const router = useRouter();
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    const tableInStore = localStorage.getItem("tableId");
    setTableId(tableInStore);
    console.error("Error boundary caught an error:", error);
  }, [error]);

  const joinTable = async (option) => {
    try {
      if (!tableId) {
        throw new Error("Table not found");
      }
      const res =
        (await option) == "existing"
          ? await joinExisting(tableId)
          :await joinNewTable(tableId);
            if (res?.data?.redirectUrl) {
            if(option=="existing"){
              reset()
            }
            console.log(res?.data?.redirectUrl);
            router.replace(res?.data?.redirectUrl);
            router.refresh(); // This will refresh the data without a full page reload
            }
        // router.push(res?.data?.redirectUrl);
      
    } catch (error) {
      console.error(error)
    }
  };
  const errorType = useMemo(() => getErrorType(error), [error]);

  const renderErrorContent = () => {
    console.log(errorType);
    switch (errorType) {
      case "sequelize":
        return (
          <ErrorAlertComponent
            message="Database Error"
            msgDetail="There was an issue with the database. Please check input and try again later."
            buttons={[
              {
                label: "Scan Again",
                onClick: () => console.log("Scan Again clicked"),
                icon: <ScanQrComponent />,
              },
            ]}
          />
        );

      case "sessionExpired":
        return (
          <ErrorAlertComponent
            message="Session Expired"
            msgDetail="Your session has expired. Please scan the QR code again to continue."
            buttons={[
              {
                label: "Scan Again",
                onClick: () => console.log("Scan Again clicked"),
                icon: <ScanQrComponent />,
              },
            ]}
          />
        );

      case "tableOccupied":
        return (
          <ErrorAlertComponent
            message="Table Occupied"
            msgDetail="This table is already occupied. Please join the existing session or create a new one."
            buttons={[
              {
                label: "Join Existing",
                onClick: () => joinTable("existing"),
              },
              {
                label: "Join New",
                onClick: () => joinTable("new"),
              },
            ]}
          />
        );

      default:
        return <ErrorAlertComponent />;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      {renderErrorContent()}
    </div>
  );
};

export default Error;
