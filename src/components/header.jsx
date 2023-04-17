import Link from "next/link";

const Header = () => {
  return (
    <header
      className="relative top-0 w-full px-4 text-white transition-all xs:px-8 lg:px-0  z-[100]"
      id="nav"
    >
      <div className="container py-4 mx-auto transition-all">
        <nav
          className="relative flex items-center justify-between md:justify-center md:grid md:grid-cols-24 md:gap-0"
          aria-label="Global"
        >
          <div className="hidden md:block md:col-span-2"></div>
          <div className="flex justify-between w-full md:col-span-20">
            <Link
              href="/"
              aria-label="Link to Home"
              className="flex items-center"
            >
              <img
                src="/svgs/komodo-logo.svg"
                className="komodo-logo"
                alt="komodo logo"
                width={`169`}
                height={`43`}
              />
            </Link>
            <div className="flex flex-row">
              <a
                href="https://komodoplatform.com/discord"
                aria-label="Link to Komodo Discord"
                className=""
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/svgs/discordIcon.svg"
                  className="discord-logo"
                  alt="discord logo"
                  width={`82px`}
                  height={`82px`}
                />
              </a>
              <a
                href="https://twitter.com/KomodoPlatform/"
                aria-label="Link to Komodo Twitter"
                className="pl-3"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/svgs/twitterIcon.svg"
                  className="twitter-logo"
                  alt="twitter logo"
                  width={`82px`}
                  height={`82px`}
                />
              </a>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2"></div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
