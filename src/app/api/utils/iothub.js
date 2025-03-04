import dayjs from "dayjs";

const { Client, Message } = require("azure-iot-device");
const { Mqtt } = require("azure-iot-device-mqtt");

export const sendDataToIotHub = (dataArray) => {
  const deviceConnectionString = process.env.IOTHUB_DEVICE_CONNECTING_STRING;

  let client = Client.fromConnectionString(deviceConnectionString, Mqtt);

  // Open the client connection
  client.open((err) => {
    if (err) {
      console.error("Could not connect: " + err.message);
    } else {
      // console.log("Sending messages individually");

      dataArray.forEach((data) => {
        const message = generateMessage({
          siteId: data.siteId,
          deviceId: data.deviceId,
          nString: data.nString,
          value: data.value,
        });

        client.sendEvent(message, (err) => {
          if (err) {
            console.error("Send error: " + err.toString());
          } else {
            // console.log("Message sent successfully");
          }
        });
      });

      // Close the client after sending all messages
      client.close((err) => {
        if (err) {
          console.error("Close error: " + err.message);
        } else {
          // console.log("Client closed successfully");
        }
      });
    }
  });
};

function generateMessage({ siteId, deviceId, nString, value }) {
  const data = JSON.stringify({
    ts: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    site: siteId,
    devid: deviceId,
    n: nString,
    v: value,
  });
  const message = new Message(data);

  return message;
}
