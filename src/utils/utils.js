import axios from "axios";
import Cookies from "js-cookie";
import numeral from "numeral";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const ceil = (option, dayjsClass) => {
  dayjsClass.prototype.ceil = function (unit, amount) {
    return this.add(amount - (this.get(unit) % amount), unit).startOf(unit);
  };
};

export const floor = (option, dayjsClass) => {
  dayjsClass.prototype.floor = function (unit, amount) {
    const mod = this.get(unit) % amount;
    return this.subtract(mod, unit).startOf(unit);
  };
};

export const round = (option, dayjsClass) => {
  dayjsClass.prototype.round = function (amount, unit) {
    const mod = this.get(unit) % amount;

    if (mod < amount / 2) {
      return this.subtract(mod, unit).startOf(unit);
    }

    return this.add(amount - mod, unit).startOf(unit);
  };
};

export const formatToNumberWithDecimalPlaces = (
  value,
  decimalPlace = 0,
  alwaysShowDecimal = true
) => {
  let stringDecimal = "";
  for (let i = 0; i < decimalPlace; i++) {
    stringDecimal += "0";
  }
  if (alwaysShowDecimal) {
    return numeral(value).format(`0,0.${stringDecimal}`);
  } else {
    return numeral(value).format(`0,0.[${stringDecimal}]`);
  }
};

const authorizationHeader = {
  Authorization: "Bearer " + Cookies.get("token"),
};
export const fetcher = (url) =>
  axios
    .get(url, { headers: { ...authorizationHeader } })
    .then((response) => response.data);
