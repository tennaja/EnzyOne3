"use client";
import { Alert, Button, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import numeral from "numeral";
import { useState } from "react";

export default function SetPointModal({ id, setPointValue, onClose, mutate }) {
  const [value, setValue] = useState(numeral(setPointValue).format("0.[00]"));
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const onConfirm = async () => {
    setIsLoading(true);
    const res = await postSetPoint();
    if (res === true) {
      setIsLoading(false);
      alert("Set point was successfully");
      setTimeout(() => {
        onClose();
        mutate();
      }, 3000);
    } else {
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  const postSetPoint = async (req) => {
    // const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/chiller/setPoint`;
    const url = `https://enzy-chiller.egat.co.th/api/set_point`;

    const params = {
      id: `CH_${id}`,
      value: value,
    };
    try {
      const res = await axios.post(url, params, {
        headers: {
          token: process.env.NEXT_PUBLIC_CHILLER_SETPOINT_TOKEN,
        },
      });
      if (res.status === 201) return true;
    } catch (error) {
      console.log("error on setpoint", error);
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-3 ">
      {!isSuccess ? (
        <Alert variant="light" color="red">
          Something went wrong. Please try again later.
        </Alert>
      ) : (
        <>
          <NumberInput label="Temperature" value={value} onChange={setValue} />
          <div className="flex  gap-3 self-end">
            <Button
              className="w-32 text-primary"
              variant="transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="self-end w-32 btn-primary"
              loading={isLoading}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
