import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Feature } from "./components/Feature";
import { Pricing } from "./components/Pricing";

export default function Page() {
  return (
    <>
      <Header />
      <Pricing />
      <Feature />
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Pricing",
  description: "",
};
