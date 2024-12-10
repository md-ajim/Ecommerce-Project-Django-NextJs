import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Layout from "../components/layout";
import { SessionProvider } from "next-auth/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

import { ThemeProvider as NextThemesProvider } from "next-themes";
export default function App({ Component, pageProps }) {
  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "sk_test_51QJquZ13Cc4xkRIKyPvv0lnJX4F0dQfScdm7hrW3kAMtdwpCiEXoVaD7jIKUZeTYEfACSxdK8lKx0UKzUBYAeBPg00Zbihzwup",
  };

  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </NextUIProvider>
    </SessionProvider>
  );
}
