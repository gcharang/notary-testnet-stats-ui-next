import Link from "next/link";

const Footer = () => {
  return (
    <div
      className="relative z-[10] pt-16 lg:pt-[80px] 2xl:pt-[140px] 3xl:pt-[193px]"
      id="footer"
    >
      <footer className="flex flex-col items-center text-center text-white pb-[60px]">
        <Link href="/" aria-label="Link to Home" className="flex items-center">
          <img
            src="/svgs/komodo-logo.svg"
            className="komodo-logo"
            alt="komodo logo"
            width={`169`}
            height={`43`}
          />
        </Link>
        <p className="pt-[26px] text-base font-medium">
          Powered by Komodo Platform 2016 -{` ${new Date().getUTCFullYear()}`}
        </p>
      </footer>
    </div>
  );
};

export default Footer;
