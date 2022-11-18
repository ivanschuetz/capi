// import "../styles/globals.css";
import type { AppProps } from "next/app"
import { WASMContextProvider } from "../context/WASMContext"

import "../styles/_global.scss"
import "../styles/_margins.scss"
import "../styles/_sidebar.scss"
import "../styles/_inputs.scss"
import "../styles/_buttons.scss"
import "../styles/_modal.scss"
import "../styles/_my_daos.scss"
import "../styles/_charts.scss"
import "../styles/_dao.scss"
import "../styles/_invest_embedded.scss"
import "../styles/_funds_activity.scss"
import "../styles/_withdraw.scss"
import "../styles/_rightcol.scss"
import "../styles/_image.scss"
import "../styles/_progress.scss"
import "../styles/_toastify.scss"
import "../styles/_react-calendar.scss"
import "../styles/_utils.scss"
import Head from "next/head"
import { AppContextProvider } from "../context/AppContext"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WASMContextProvider>
      <AppContextProvider>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AppContextProvider>
    </WASMContextProvider>
  )
}

export default App
