
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import Layout from "../components/Layout";
import "../styles/globals.css";
import type { AppProps } from "next/app";

Amplify.configure({ ...awsExports, ssr: true });

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default MyApp;