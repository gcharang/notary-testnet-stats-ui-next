import Header from "@/components/header.jsx";
import Footer from "@/components/footer.jsx";

export const Layout = ({ pageprops, children }) => {

  return (<div id="wrapper" className="relative h-full">
    <div
      id="content"
      className="overflow-x-hidden wrapper md:overflow-auto"
    >
      <Header />
      <div className="relative min-h-screen z-[10]" id="main">
        <div className="absolute w-full h-full overflow-hidden">
          <div className="absolute top-ellipse"></div>
        </div>
        <main className="container relative mx-auto font-sans text-white md:grid md:gap-0 md:grid-cols-24">
          <div className="hidden lg:block lg:col-span-2"></div>
          <div className="relative px-4 md:col-span-24 lg:col-span-20 xs:px-8 lg:px-0">
            <div className='text-center'>
              <h1 className="text-5xl font-bold">Notary Testnet Stats 2023</h1>
            </div>
            {children}
          </div>
          <div className="hidden lg:block lg:col-span-2"></div>
        </main>
      </div>
      <Footer />
    </div>
  </div>)

}