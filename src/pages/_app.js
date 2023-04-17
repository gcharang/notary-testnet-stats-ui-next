import "@/styles/globals.css";
import { Layout } from "@/components/shared/Layout";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      {/* <MetaHead pageProps={pageProps} /> */}
      <Layout pageProps={pageProps}>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
