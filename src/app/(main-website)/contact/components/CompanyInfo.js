import { Text, Title } from "@mantine/core";
import React from "react";
import { BsTelephone } from "react-icons/bs";
import { MdLocationPin, MdOutlineMail } from "react-icons/md";

export const CompanyInfo = () => {
  return (
    <div className="flex flex-col gap-6">
      <Title order={3}>Electricity Generating Authority of Thailand</Title>
      <div className="flex gap-2 items-center">
        <div className="rounded-full p-2 bg-dark-box dark:bg-slate-500">
          <MdLocationPin className="w-8 h-8 text-white" />
        </div>
        <Text>
          53 m.2 Charansanitwong rd. Bangkruai Bangkruai Nonthaburi 11130
          Thailand
        </Text>
      </div>
      <div className="flex gap-2 items-center">
        <div className="rounded-full p-2 bg-dark-box dark:bg-slate-500">
          <BsTelephone className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col">
          <Text>+66 2 436 4122</Text>
          <Text>+66 9 2807 8131</Text>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="rounded-full p-2 bg-dark-box dark:bg-slate-500">
          <MdOutlineMail className="w-8 h-8 text-white" />
        </div>
        <Text>sedp@egat.co.th</Text>
      </div>
    </div>
  );
};
