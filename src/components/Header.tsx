import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <>
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <Link to="/" relative="path">
          <span className="flex items-center gap-2 text-base font-semibold md:text-lg">
            <span>ZeroTrust Starter Kit</span>
          </span>
        </Link>

        <nav className="flex gap-5 ml-auto md:gap-4 lg:gap-5">
          <Link to="/settings" relative="path">
            <Button variant="outline" size="icon">
              <SettingsIcon />
            </Button>
          </Link>
          <ModeToggle />
        </nav>
      </header>
    </>
  );
};

export default Header;
