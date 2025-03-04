"use client";
import { Title, Text, Container, Button, Overlay, Center } from "@mantine/core";
import classes from "./HeroContent.module.css";
import classNames from "classnames";
import { useRouter } from "next/navigation";

export function HeroContent() {
  const router = useRouter();
  const handleOnclick = () => {
    router.push("/aboutus");
  };
  return (
    // <div className={classes.wrapper}>
    <div className="relative max-h-128 py-16 bg-[url('/images/enzy-bg.jpg')] bg-cover bg-center">
      <Overlay color="#000" opacity={0.7} zIndex={1} />
      {/*  <video
        className=""
        poster="https://enzy.egat.co.th/wp-content/uploads/2021/04/0enzy_web_pr_2_1_b.mp4"
        playsinline=""
        autoplay=""
        muted=""
        loop=""
        src="https://enzy.egat.co.th/wp-content/uploads/2021/04/enzy_web_pr_4.mp4"
      > */}
      <div className={classes.inner}>
        <Title className={classes.title}>FIND YOUR BEST ENERGY SOLUTION</Title>

        <Container size="md">
          <Text size="lg" className="text-white">
            A powerful tool enabling you to monitor, control and optimize your
            energy consumption for your factory to reduce costs and enhance
            machine performance
          </Text>
        </Container>

        <Center className="mt-5">
          <Button
            className=""
            variant="white"
            size="lg"
            onClick={handleOnclick}
          >
            Get started
          </Button>
        </Center>
      </div>
      {/* </video> */}
    </div>
  );
}
