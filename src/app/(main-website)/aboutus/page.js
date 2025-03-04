import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Aboutus } from "./components/Aboutus";

export default function Page() {
  return (
    <>
      <Header />
      <Aboutus />
      <Footer />
    </>
  );
}

export const metadata = {
  title: "About us",
  description: "",
};
