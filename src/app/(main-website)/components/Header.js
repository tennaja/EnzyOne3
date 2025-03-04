"use client";
import { useState } from "react";
import {
  Container,
  Group,
  Burger,
  Title,
  Text,
  Drawer,
  Stack,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import NextImage from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { ToggleSwitch } from "@/components/ToggleSwitch";

const links = [
  { link: "/aboutus", label: "About us" },
  { link: "/pricing", label: "Pricing" },
  // { link: "/#", label: "Download" },
  { link: "/contact", label: "Contact" },
  { link: "/login", label: "Login" },
];

export function Header() {
  const [opened, { toggle, open, close }] = useDisclosure(false);

  const pathname = usePathname();
  const items = links.map((link) => {
    return (
      <Text
        component={Link}
        key={link.label}
        href={link.link}
        className={classNames({
          "px-3 py-2 rounded hover:bg-primary hover:text-white text-black dark:text-slate-200 ": true,
          "text-primary": pathname.includes(link.link),
        })}
      >
        {link.label}
      </Text>
    );
  });

  return (
    <div className="bg-white dark:bg-dark-box border-b ">
      <Container className="flex h-16 justify-between items-center   ">
        {/* <Image src={"/images/enzy_logo_w.png"} alt="" height={100} width={64} /> */}
        <Link href="/">
          <Image
            component={Image}
            src={"/images/enzy_logo_b.png"}
            alt="ENZY"
            className="text-black dark:text-slate-200 object-cover w-32"
          />
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
          <ToggleSwitch collapsed />
        </Group>
        <Burger
          opened={opened}
          onClick={() => {
            toggle();
            open();
          }}
          hiddenFrom="xs"
          size="sm"
        />

        <Drawer opened={opened} onClose={close}>
          <Title
            component={Link}
            href="/"
            className="text-black dark:text-slate-200"
          >
            ENZY
          </Title>
          <Stack gap={10} align="flex-start" className="mt-4">
            {items}
            <ToggleSwitch />
          </Stack>
        </Drawer>
      </Container>
    </div>
  );
}
