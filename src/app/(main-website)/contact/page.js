import { Container, Notification, Text, Title } from "@mantine/core";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { CompanyInfo } from "./components/CompanyInfo";
import { FormContact } from "./components/FormContact";

export default function Page() {
  return (
    <>
      <Header />

      <div className="py-16 bg-white dark:bg-dark-box dark:text-slate-100">
        <Container size="lg">
          <Title order={2} className="text-center uppercase">
            Contact
          </Title>
          <Text className="text-center mt-3">
            Please fill the form. Our team will reach you as soon as possible.
          </Text>
          <div className="grid grid-cols-2 gap-8 mt-10">
            <FormContact />
            <CompanyInfo />
          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export const metadata = {
  title: "Contact",
  description: "",
};
