import { CreditCardIcon } from "@heroicons/react/24/outline";
import { Button, Card, Text, Title } from "@mantine/core";
import classNames from "classnames";
import Link from "next/link";

export const Pricing = () => {
  const CardItem = ({ title, description, detail = "", color = "black" }) => {
    return (
      <Card
        key={title}
        shadow="md"
        radius="md"
        className="flex items-center"
        padding="xl"
      >
        <CreditCardIcon
          className={classNames({ "w-20 h-20": true, [`text-${color}`]: true })}
        />
        <Text
          fz="lg"
          fw={500}
          mt="md"
          className={classNames({ [`text-${color}`]: true })}
        >
          {title}
        </Text>
        <Text>{description}</Text>
        {detail ? (
          <div className="flex flex-col gap-3 items-center mt-1">
            <Text>Start at</Text>
            <Text className="font-bold">{detail}</Text>
          </div>
        ) : (
          <>
            <Link
              href={"/contact"}
              className={classNames({
                "p-2 border rounded-lg mt-5": true,
                [`border-${color}`]: true,
              })}
            >
              CONTACT US
            </Link>
          </>
        )}
      </Card>
    );
  };
  return (
    <div className=" py-16 bg-white">
      <Title order={2} className="text-center">
        Pricing
      </Title>
      <div className="grid grid-cols-3 container mx-auto gap-8 mt-10 ">
        <CardItem
          title="Silver"
          description="~10 Data Points"
          detail="฿10,000/Month"
          color="gray-500"
        />
        <CardItem
          title="Gold"
          description="~20 Data Points"
          detail="฿20,000/Month"
          color="amber-400"
        />
        <CardItem
          title="Platinum"
          description="Customized Data Points"
          color="slate-400"
        />
      </div>
    </div>
  );
};
