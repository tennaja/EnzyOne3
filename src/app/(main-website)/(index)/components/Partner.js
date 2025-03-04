import { Container, Title } from "@mantine/core";
import Image from "next/image";
import React from "react";

const logos = [
  {
    company: "Pinthong",
    image: "/images/logo/logo-pinthong.png",
  },
  {
    company: "Samtech",
    image: "/images/logo/logo-samtech.png",
  },
  {
    company: "North East Rubber",
    image: "/images/logo/logo-ner.png",
  },
];
export const Partner = () => {
  return (
    <div className="py-16  bg-white dark:bg-dark-box dark:text-slate-100">
      <Container size="lg">
        <div className="flex justify-center">
          <Title className="uppercase">People who trust us</Title>
        </div>
        <div className="flex  gap-4 justify-between px-24 mt-10">
          {logos.map((item, index) => (
            <Image
              key={index}
              alt={item.company}
              src={item.image}
              height={300}
              width={150}
              className="object-contain"
            />
          ))}
        </div>
      </Container>
    </div>
  );
};
