import Document, { Html, Head, Main, NextScript } from "next/document"

// we use this to be able to add a modal to root
class MainDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <div id="modal_root"></div>
        </body>
      </Html>
    )
  }
}

export default MainDocument
