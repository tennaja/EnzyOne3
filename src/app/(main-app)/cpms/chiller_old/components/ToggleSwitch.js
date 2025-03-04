"use client";
import React from "react";
import { useState, Fragment } from "react";
import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/redux/slicer/appConfigSlice";

export function ToggleSwitch({ collapsed, isEnabled = false }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      disabled={isEnabled ? false : true}
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}
