// import "../styles/globals.css";
import type { AppProps } from "next/app"
import { WASMContextProvider } from "../context/WASMContext"

import Head from "next/head"
import { AppContextProvider } from "../context/AppContext"
import "../styles/_buttons.sass"
import "../styles/_charts.sass"
import "../styles/_dao.sass"
import "../styles/_funds_activity.sass"
import "../styles/_global.sass"
import "../styles/_image_crop.sass"
import "../styles/_inputs.sass"
import "../styles/_invest_embedded.sass"
import "../styles/_margins.sass"
import "../styles/_modal.sass"
import "../styles/_my_daos.sass"
import "../styles/_progress.sass"
import "../styles/_react-calendar.sass"
import "../styles/_rightcol.sass"
import "../styles/_sidebar.sass"
import "../styles/_toastify.sass"
import "../styles/_utils.sass"
import "../styles/_withdraw.sass"
import "../styles/global.sass"
import "../styles/shared_text.sass"
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
