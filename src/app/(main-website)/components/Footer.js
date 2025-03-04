"use client";
import {
  Container,
  Group,
  Anchor,
  Title,
  Divider,
  Text,
  Stack,
} from "@mantine/core";
import classes from "./Footer.module.css";
import classNames from "classnames";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Careers" },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div
      className={classNames(classes.footer, { "text-white bg-primary": true })}
    >
      <Container className={classNames(classes.inner)}>
        <Group className={classes.links}>
          <Title>ENZY</Title>
          <Divider orientation="horizontal" size={"xl"} />
          <Stack gap={"xs"}>
            <Text size="xs">Business Development Division</Text>
            <Text size="xs">Electricity Generating Authority of Thailand</Text>
            <Text size="xs">
              53 m.2 Charansanitwong rd. Bangkruai Bangkruai Nonthaburi 11130
              THAILAND
            </Text>
            <Anchor
              size="xs"
              href="mailto:sedp@egat.co.th"
              className="text-white   underline"
            >
              contact us
            </Anchor>
          </Stack>
        </Group>
      </Container>
    </div>
  );
}
