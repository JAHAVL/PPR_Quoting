import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>PPR Quoting</h1>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={`${styles.navItem} ${isActive('/quotes') ? styles.active : ''}`}>
              <Link href="/quotes">
                <a>Quotes</a>
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive('/projects') ? styles.active : ''}`}>
              <Link href="/projects">
                <a>Projects</a>
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive('/clients') ? styles.active : ''}`}>
              <Link href="/clients">
                <a>Clients</a>
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive('/employees') ? styles.active : ''}`}>
              <Link href="/employees">
                <a>Employees</a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} PPR Quoting Software</p>
      </footer>
    </div>
  );
};

export default Layout;
