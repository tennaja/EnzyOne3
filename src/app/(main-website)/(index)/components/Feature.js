import {
  BoltIcon,
  ChartBarSquareIcon,
  CircleStackIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { Container, SimpleGrid, Text } from "@mantine/core";

const items = [
  {
    icon: CircleStackIcon,
    title:
      "Automatically analyze data from meters, sensors and other smart devices to provide the best solutions to increase your savings",
  },
  {
    icon: ChartBarSquareIcon,
    title: "Real-time monitoring and alert you when anomaly is detected",
  },
  {
    icon: PresentationChartLineIcon,
    title: "Deliver automated annual reports exported in various formats",
  },
  {
    icon: LightBulbIcon,
    title: "Track carbon emission to show how much you can save the world!",
  },
];

const ListItem = ({ icon: Icon, title }) => {
  return (
    <div className="flex flex-col">
      <Icon className="w-16 h-16 dark:text-dark-foreground-focus self-center" />
      <Text>{title}</Text>
    </div>
  );
};
export function Feature() {
  return (
    <div className="py-16 bg-white dark:bg-dark-box dark:text-slate-100">
      <Container size="lg">
        <SimpleGrid cols={2}>
          {items.map((item, index) => (
            <ListItem {...item} key={index} />
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}
