import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin-dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>PPR Admin Dashboard - Redirecting...</title>
        <meta name="description" content="Paver Pressure and Repair Quoting Software" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Intentionally empty - this page redirects to install-quote */}
    </>
  );
}
