import {
  BellAlertIcon,
  BoltIcon,
  ChartBarSquareIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { Container, SimpleGrid, Text, Title } from "@mantine/core";
import { BiPulse, BiSolidReport } from "react-icons/bi";
import { FaLeaf, FaSolarPanel } from "react-icons/fa6";

const items = [
  {
    icon: ComputerDesktopIcon,
    title: "Show real-time and historical energy usage and energy cost",
  },
  {
    icon: PresentationChartLineIcon,
    title: "Predict 6-hour ahead peak demand by AI with high 90% accuracy",
  },
  {
    icon: BellAlertIcon,
    title:
      "Alert you via LINE when energy usage is more than the target or when anomaly is detected",
  },
  {
    icon: FaSolarPanel,
    title: "Forecast energy generation from solar PV",
  },
  {
    icon: BiPulse,
    title:
      "Monitor real-time status, energy efficiency and energy cost for a machine",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Remotely control machines and AC with a mobile phone",
  },
  {
    icon: CheckCircleIcon,
    title:
      "Provide suggestions for more short-term and long-term savings by AI",
  },
  {
    icon: BiSolidReport,
    title: "Auto-generated reports exported in various formats",
  },
  {
    icon: FaLeaf,
    title: "Track carbon emission",
  },
];

const ListItem = ({ icon: Icon, title }) => {
  return (
    <div className="flex gap-4  items-center">
      <Icon className="w-6 h-6 dark:text-dark-foreground-focus self-center" />
      <Text>{title}</Text>
    </div>
  );
};
export function Feature() {
  return (
    <div className="py-16 bg-white dark:bg-dark-box dark:text-slate-100">
      <Container size="lg">
        <Title order={2} className="text-center">
          ENZY Feature
        </Title>
        <div className="grid grid-cols-2 gap-6 mt-10">
          {items.map((item, index) => (
            <ListItem {...item} key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
