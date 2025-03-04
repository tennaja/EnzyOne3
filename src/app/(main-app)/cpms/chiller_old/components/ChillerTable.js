"use client";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import useSWR from "swr";
import React from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import numeral from "numeral";
import classNames from "classnames";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import SetPointModal from "./SetPointModal";
export const ChillerTable = () => {
  const url = `https://enzy-chiller.egat.co.th/api/get-plant`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const urlCH01 = `https://enzy-chiller.egat.co.th/api/get-chiller?id=CH_01`;
  const {
    data: dataCH01,
    error: errorCH01,
    mutate: mutateCH01,
  } = useSWR(urlCH01, fetcher);

  const urlCH02 = `https://enzy-chiller.egat.co.th/api/get-chiller?id=CH_02`;
  const {
    data: dataCH02,
    error: errorCH02,
    mutate: mutateCH02,
  } = useSWR(urlCH02, fetcher);

  const urlCH03 = `https://enzy-chiller.egat.co.th/api/get-chiller?id=CH_03`;
  const {
    data: dataCH03,
    error: errorCH03,
    mutate: mutateCH03,
  } = useSWR(urlCH03, fetcher);

  const urlCH04 = `https://enzy-chiller.egat.co.th/api/get-chiller?id=CH_04`;
  const {
    data: dataCH04,
    error: errorCH04,
    mutate: mutateCH04,
  } = useSWR(urlCH04, fetcher);

  const TableItem = ({ plantData, chillerData, chillerId, mutate }) => {
    const keyCompressorDraw = `CH ${chillerId} Compressorcurrentdraw`;
    const keyChillWaterReturn = `CH ${chillerId} Chillwater temp entering`;
    const keyCondensorReturn = `CH ${chillerId} condensorWater temp entering`;
    const power =
      (1.732 *
        numeral(chillerData?.["Voltage AB"]).value() *
        (numeral(chillerData?.["Current L1"]).value() +
          numeral(chillerData?.["Current L2"]).value() +
          numeral(chillerData?.["Current L3"]).value())) /
      1000;

    const [opened, { open, close }] = useDisclosure(false);

    return (
      <div
        className={classNames({
          "grid grid-cols-8 border-b border-stroke dark:border-slate-400  text-sm ": true,
          "text-slate-300 dark:text-slate-500":
            chillerData?.["Control"] == "STOP",
          "text-black dark:text-white": chillerData?.["Control"] != "STOP",
        })}
      >
        <div className="flex px-2 py-3">
          <p className="flex  ">CH-{chillerId}</p>
        </div>

        <div className="flex items-center justify-center px-2 py-3">
          <p className="">{chillerData?.["Control"]}</p>
        </div>

        <div className="flex items-center justify-center px-2 py-3">
          <p className="">{formatToNumberWithDecimalPlaces(power, 2, false)}</p>
        </div>

        <div className="flex items-center justify-center px-2 py-3">
          <p className="">
            {formatToNumberWithDecimalPlaces(
              plantData?.[keyCompressorDraw],
              2,
              false
            )}
          </p>
        </div>

        <div className="flex items-center justify-center px-2 py-3">
          <p className="">
            {formatToNumberWithDecimalPlaces(
              plantData?.[keyChillWaterReturn],
              2,
              false
            )}
          </p>
        </div>
        <div className="flex items-center justify-center px-2 py-3">
          <p className="">
            {formatToNumberWithDecimalPlaces(
              plantData?.[keyCondensorReturn],
              2,
              false
            )}
          </p>
        </div>
        <div className="flex items-center justify-center px-2 py-3">
          {chillerData?.["Control"] == "STOP" ? (
            <p className="">
              {formatToNumberWithDecimalPlaces(
                chillerData?.["chilledWaterSetpoint"],
                2,
                false
              )}
            </p>
          ) : (
            <p className="underline text-primary cursor-pointer" onClick={open}>
              {formatToNumberWithDecimalPlaces(
                chillerData?.["chilledWaterSetpoint"],
                2,
                false
              )}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center px-2 py-3">
          <ToggleSwitch
            isEnabled={chillerData?.["Control"] == "STOP" ? false : true}
          />
        </div>

        <Modal
          opened={opened}
          onClose={close}
          title={`Set Control Value: CH_${chillerId}`}
          centered
          overlayProps={{
            color: "#000",
            backgroundOpacity: 0.2,
          }}
        >
          <SetPointModal
            id={chillerId}
            onClose={close}
            setPointValue={chillerData?.["chilledWaterSetpoint"]}
            mutate={mutate}
          />
        </Modal>
      </div>
    );
  };
  return (
    <div className="rounded-xl bg-white p-3  shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Chiller list
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-8 rounded-sm bg-gray-100 dark:bg-slate-600   dark:text-light">
          <div className="px-2 py-3 ">
            <h5 className="text-sm font-medium uppercase">Name</h5>
          </div>
          <div className="px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">Status</h5>
          </div>
          <div className="px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">Power</h5>
          </div>
          <div className=" px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">% Drawer</h5>
          </div>
          <div className=" px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">CHR</h5>
          </div>
          <div className=" px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">CDR</h5>
          </div>
          <div className=" px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">Control</h5>
          </div>
          <div className=" px-2 py-3 text-center ">
            <h5 className="text-sm font-medium uppercase">Auto</h5>
          </div>
        </div>

        <TableItem
          plantData={data}
          chillerData={dataCH01}
          chillerId={"01"}
          mutate={mutateCH01}
        />
        <TableItem
          plantData={data}
          chillerData={dataCH02}
          chillerId={"02"}
          mutate={mutateCH02}
        />
        <TableItem
          plantData={data}
          chillerData={dataCH03}
          chillerId={"03"}
          mutate={mutateCH03}
        />
        <TableItem
          plantData={data}
          chillerData={dataCH04}
          chillerId={"04"}
          mutate={mutateCH04}
        />
      </div>
    </div>
  );
};

export default ChillerTable;
