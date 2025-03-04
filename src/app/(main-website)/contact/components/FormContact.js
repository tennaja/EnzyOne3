"use client";

import { createContact } from "@/utils/api";
import {
  Button,
  Group,
  Notification,
  TextInput,
  Textarea,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";

export const FormContact = () => {
  const [isShowNotification, setIsShowNotification] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },

    validate: {
      email: isEmail("Invalid email"),
    },
  });

  const sendContact = async (values) => {
    try {
      const response = await createContact(values);
      if (response.status === 201) {
        form.reset();
        setIsShowNotification(true);
        setTimeout(() => {
          setIsShowNotification(false);
        }, 5000);
      }
    } catch (error) {}
  };
  return (
    <div className="px-8">
      {isShowNotification && (
        <Notification
          title="Contact received"
          withCloseButton={false}
          color="teal"
        >
          We have received your contact. We will contact to you as soon as
          possible.
        </Notification>
      )}

      <form onSubmit={form.onSubmit((values) => sendContact(values))}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Your name"
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />

        <TextInput
          withAsterisk
          label="Phone Number"
          placeholder="+66123456789"
          {...form.getInputProps("phone")}
        />
        <Textarea
          label="Message (optional)"
          placeholder="optional message"
          {...form.getInputProps("message")}
        />

        <Group justify="flex-start" mt="md">
          <Button type="submit" className="bg-primary">
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
};
