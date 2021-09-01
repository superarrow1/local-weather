import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useWeather } from "../lib/swr-hooks";

export default function Home() {
  const [address, setAddress] = useState();
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    lng: -81.5612,
  });
  const [loading, setLoading] = useState();
  const [searchValue, setSearch] = useState("Orlando, FL");
  const { weather, isLoading } = useWeather(coordinates);

  /**
   * Fetch the address.
   */
  async function getAddress() {
    setLoading(true);
    const response = await fetch(
      `/api/reversegeocoding?lat=${coordinates?.lat}&lng=${coordinates?.lng}`
    );
    const address = await response.json();
    setAddress(address);
    setSearch(address);
    setLoading(false);
  }

  /**
   * Fetch the coordinates.
   */
  async function getCoordinates() {
    setLoading(true);
    const response = await fetch(
      `/api/geocoding?address=${JSON.stringify(searchValue)}`
    );
    const coordinates = await response.json();
    setCoordinates(coordinates);
    setLoading(false);
  }

  /**
   * Fetch user's coordinates.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
   */
  async function getLocation() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoordinates({
          lat: pos?.coords?.latitude,
          lng: pos?.coords?.longitude,
        }),
      (err) => {
        console.warn(`There was a problem getting your location ${err}`);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  /**
   * Search handler.
   *
   * @param {object} event The event object.
   */
  function handleSearch(event) {
    event.preventDefault();
    setSearch(searchValue);
    getCoordinates();
  }

  /**
   * When the page loads intially, or if the
   * user clicks the "Local Forecast" button.
   */
  useEffect(() => {
    getAddress();
  }, [coordinates]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Weather</h1>
        <form onSubmit={handleSearch}>
          <label className={styles.screenReader} htmlFor="search">
            Enter your city
          </label>
          <input
            id="search"
            className={styles.search}
            minLength="4"
            onChange={(e) => setSearch(e.target.value)}
            pattern="^[^~`^<>]+$"
            placeholder="Orlando, FL"
            type="text"
            value={searchValue}
          />
          <button className={styles.button}>Search</button>
        </form>
        <div className={styles.weather}>
          <button className={styles.button} onClick={getLocation}>
            Click for Local Forecast
          </button>
          <h2>{!!address && address}</h2>
          {loading || isLoading ? (
            <p>Loading current conditions...</p>
          ) : (
            <>
              <p>{weather?.currently?.summary}</p>
              <p className={styles.temp}>
                {Math.round(weather?.currently?.temperature)}F
              </p>
              <p>{weather?.minutely?.summary}</p>
              <p>{weather?.daily?.summary}</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
