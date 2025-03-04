import { NextResponse } from "next/server";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { ceil, floor } from "@/utils/utils";
import { sendDataToIotHub } from "../utils/iothub";

const puppeteer = require("puppeteer");
export async function GET(request) {
  dayjs.extend(ceil);
  dayjs.extend(floor);
  const now = dayjs();
  const ceilTime = now.ceil("minute", 15).format("YYYY-MM-DD HH:mm:[00]");
  const floorTime = now.floor("minute", 15).format("YYYY-MM-DD HH:mm:[00]");

  console.log("now", dayjs().format("YYYY-MM-DDTHH:mm:ss"));
  console.log("now", now.toISOString());

  sendDataToIotHub([
    {
      siteId: "s00x",
      deviceId: "device1",
      nString: "n1",
      value: 1,
    },
  ]);
  return NextResponse.json(`ceil: ${ceilTime} _____ floor: ${floorTime}`);

  /*  const pdf = await printPDF();
  const response = new Response(pdf, {
    headers: { "content-type": "application/pdf" },
  });
  return response; */
}

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://github.com/puppeteer/puppeteer", {
    waitUntil: "networkidle0",
  });
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();
  return pdf;
}
