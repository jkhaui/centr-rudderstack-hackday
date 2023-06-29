import { useEffect } from 'react';
import type { AppProps } from 'next/app'
import rudder from '../services/rudder';

import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    rudder.getAnonymousId().then((id) => {
      console.log(id, 'Anonymous Id');
    });
  }, []);

  return <Component rudder={rudder} {...pageProps} />
}
