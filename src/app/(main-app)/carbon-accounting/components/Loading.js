"use client";
import React from 'react'
import { RotatingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div
              className="py-12 w-auto items-center text-center"
              style={{ textAlign: "-webkit-center" }}
            >
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <div className="text-center">
                <div className="mt-2 px-7 py-3">
                  <p className="text-lg text-white mt-5">
                    Processing please wait ...
                  </p>
                </div>
              </div>
            </div>
          </div>
  )
}
