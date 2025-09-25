import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { sdk } from '@farcaster/miniapp-sdk'

export default function Home() {
  <script type="module">
    import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk'
  </script>
  (async () => {
    await sdk.actions.ready()
  })()
  return (
    <div className="container-fluid">
      <main>
        <Header title="Leo's Simple Weather" />
        <section className="inputs">
          <input type="text" id="cityInput" placeholder="Enter city name" />
          <button id="getWeatherBtn">Get Weather</button>
          <div id="weatherResult"></div>
        </section>
        <section className="display">
          <div className="wrapper">
            <h2 id="cityOutput"></h2>
            <p id="description"></p>
            <p id="temp"></p>
            <p id="wind"></p>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  )
}
