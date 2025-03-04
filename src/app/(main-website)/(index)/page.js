import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroContent } from "./components/HeroContent";
import { Feature } from "./components/Feature";
import { VideoContent } from "./components/VideoContent";
import { Partner } from "./components/Partner";

export default function Page() {
  return (
    <>
      <Header />

      <HeroContent />
      <Feature />
      <VideoContent />
      <Partner />
      {/* <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base"></main> */}
      <Footer />
    </>
  );
}

export const metadata = {
  title: "ENZY",
  description: "",
};
