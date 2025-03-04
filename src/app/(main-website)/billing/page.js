import BillingDetailForm2 from "@/app/(main-app)/report/billing/BillingDetailForm2";
import React from "react";
import { Header } from "../components/Header";
import { Space } from "@mantine/core";

export default function Billing() {
  return (
    <>
      <BillingDetailForm2 isPDF={false} />
    </>
  );
}

export const metadata = {
  title: "Billing",
  description: "",
};
