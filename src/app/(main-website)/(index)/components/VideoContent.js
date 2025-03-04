import { Container, Group, Image, Stack, Text, Title } from "@mantine/core";
import NextImage from "next/image";
import React from "react";

export const VideoContent = () => {
  return (
    <div className="py-16  bg-gradient-to-b from-primary to-secondary dark:bg-dark-box dark:text-slate-100">
      <Container size="lg">
        <Group justify="space-between">
          <a href="https://youtu.be/VFHnPGKy3tQ" className="aspect-video">
            <Image
              component={NextImage}
              src="/images/video-player.png"
              height={400}
              width={400}
            />
          </a>
          <Stack align="center">
            <Title className="uppercase">Easy Way To Save Energy</Title>
            <Text>
              ENZY will help you maximize your energy efficiency with the least
              cost.
            </Text>
          </Stack>
        </Group>
      </Container>
    </div>
  );
};
