import { NextResponse } from "next/server";
import { headers } from "next/headers";

const puppeteer = require("puppeteer");
export async function GET(request) {
  const pdf = await printPDF();
  const response = new Response(pdf, {
    headers: { "content-type": "text/html" },
  });
  return response;
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
