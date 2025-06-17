import '../styles/globals.css'
import type { AppProps } from 'next/app'
import BackgroundAnimation from '../components/layout/BackgroundAnimation'
import { QuotesProvider } from '../contexts/QuotesContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <BackgroundAnimation />
      <QuotesProvider>
        <Component {...pageProps} />
      </QuotesProvider>
    </>
  )
}

export default MyApp
