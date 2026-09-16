import styles from "./Car3DViewer.module.css";

export function Car3DFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className={styles.fallback} role="status">
      <div className={styles.fallbackMark} aria-hidden="true">360°</div>
      <p>{loading ? "3D araç alanı hazırlanıyor" : "3D araç modeli eklendiğinde burada görüntülenecek"}</p>
    </div>
  );
}
