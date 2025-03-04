import React from "react";

export default function Title({ name, description }) {
  return (
    <div className="text-left flex flex-col lg:pl-8 lg:py-3">
      <div className="font-semibold text-md lg:text-2xl">{name}</div>
      <div className="font-normal text-sm lg:text-lg text-gray-200">
        {description}
      </div>
    </div>
  );
}
