import { NextResponse } from "next/server";
import { headers } from "next/headers";
import dayjs from "dayjs";

const puppeteer = require("puppeteer");
export async function GET(request, { params }) {
  // const id = params.customerId;
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ?? dayjs().get("year");
  const month = searchParams.get("month") ?? dayjs().get("month") + 1;

  const pdf = await printPDF();
  const response = new Response(pdf, {
    headers: { "content-type": "application/pdf" },
  });
  return response;
}

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    `${process.env.NEXT_PUBLIC_APP_URL}/pdf/mock-billing/ScanInter`,
    {
      waitUntil: "networkidle0",
    }
  );
  const pdf = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();
  return pdf;
}
