import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.left}>NFT Tickets</span>
      <span className={styles.right}>© 2026 / Université Paris 1 Panthéon-Sorbonne</span>
      <span className={styles.right}>Made by Amina, Betul, Bintou, Dogan  </span>
    </footer>
  )
}