"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
// var buddhistEra = require("dayjs/plugin/buddhistEra");

dayjs.locale("en");

// dayjs.extend(buddhistEra);

function ClockWidget() {
  const [time, setTime] = useState(dayjs());
  const matchesLarge = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <span className="text-lg lg:text-2xl  text-center pt-8">
      {matchesLarge ? (
        dayjs(time).locale("en").format("YYYY-MM-DD [|] HH:mm:ss")
      ) : (
        <>
          {dayjs(time).locale("en").format("YYYY-MM-DD")} <br />
          {dayjs(time).format("HH:mm:ss")}
        </>
      )}
    </span>
  );
}

export default ClockWidget;
