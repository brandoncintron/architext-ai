/**
 * @file This file is the main entry point for the application's home page.
 */
import { SiteActions } from "@/components/ui/site-actions";
import { Wizard } from "@/components/wizard/wizard";

const HomePage = () => {
  return (
    <>
      <header className="flex w-full items-center justify-end pr-4 pt-4">
        <SiteActions />
      </header>

      <div className="flex flex-grow items-center justify-center">
        <Wizard />
      </div>
    </>
  );
};

export default HomePage;
