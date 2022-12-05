// import "../styles/globals.css";
import type { AppProps } from "next/app"
import { WASMContextProvider } from "../context/WASMContext"

import Head from "next/head"
import { AppContextProvider } from "../context/AppContext"
import "../styles/_buttons.scss"
import "../styles/_charts.scss"
import "../styles/_dao.scss"
import "../styles/_funds_activity.scss"
import "../styles/_global.scss"
import "../styles/_image_crop.sass"
import "../styles/_inputs.scss"
import "../styles/_invest_embedded.scss"
import "../styles/_margins.scss"
import "../styles/_modal.scss"
import "../styles/_my_daos.scss"
import "../styles/_progress.scss"
import "../styles/_react-calendar.scss"
import "../styles/_rightcol.scss"
import "../styles/_sidebar.scss"
import "../styles/_toastify.scss"
import "../styles/_utils.scss"
import "../styles/_withdraw.scss"
import "../styles/global.sass"
import { NextPage } from "next"

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <WASMContextProvider>
      <AppContextProvider>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </AppContextProvider>
    </WASMContextProvider>
  )
}

export default App
