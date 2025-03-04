"use client";
import {
  Group,
  Text,
  Title,
  Container,
  SimpleGrid,
  Overlay,
} from "@mantine/core";
import Image from "next/image";
import React from "react";
import { LuMonitorDot } from "react-icons/lu";
import { RiRemoteControlLine } from "react-icons/ri";
import { FaHeadSideVirus } from "react-icons/fa6";
import { Animated } from "react-animated-css";
import ScrollAnimation from "react-animate-on-scroll";

export const Aboutus = () => {
  return (
    <div className="py-16 bg-white">
      <div>
        <Title order={2} className="flex justify-center">
          ABOUT US
        </Title>
        <div className="flex items-center justify-between">
          <Image
            src={"/images/egat_enzy_logo-1.png"}
            width={512}
            height={256}
            alt="EGAT ENZY"
          />
          <Text className="text-xl">
            ENZY is an energy management system developed by EGAT. It enables
            you to monitor, control and optimize your energy usage to reduce
            costs and enhance machine performance.
          </Text>
        </div>
      </div>

      <Animated animationIn="fadeInUp" isVisible={true}>
        <div>
          <Title order={2} className="flex justify-center">
            OUR TECHNOLOGY
          </Title>
          <Container size="lg" className="mt-10">
            <SimpleGrid cols={3}>
              <div className="flex flex-col items-center gap-4">
                <LuMonitorDot
                  size={80}
                  className="dark:text-dark-foreground-focus self-center"
                />
                <Text>MONITORING</Text>
              </div>
              <div className="flex flex-col items-center gap-4">
                <RiRemoteControlLine
                  size={80}
                  className="dark:text-dark-foreground-focus self-center"
                />
                <Text>CONTROL</Text>
              </div>
              <div className="flex flex-col items-center gap-4">
                <FaHeadSideVirus
                  size={80}
                  className="dark:text-dark-foreground-focus self-center"
                />
                <Text>ANALYTICS</Text>
              </div>
            </SimpleGrid>
          </Container>
        </div>
      </Animated>

      <ScrollAnimation
        animateIn="fadeInUp"
        initiallyVisible={true}
        className="mt-10"
      >
        <div className="flex justify-center p-10 bg-[#d6d6d6]">
          <Image
            src="/images/enzy-cloud.png"
            alt=""
            height={500}
            width={500}
            className="w-100"
          />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="fadeInUp" className="mt-10">
        <Title order={2} className="flex justify-center p-10">
          SENSOR NODE PARTNER
        </Title>
        <div className="flex justify-center">
          <Image
            src="/images/sensor-diagram.png"
            alt=""
            height={800}
            width={800}
          />
        </div>
      </ScrollAnimation>
    </div>
  );
};
