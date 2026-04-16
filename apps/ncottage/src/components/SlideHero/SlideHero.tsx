import { memo } from 'react';
import Slide from '../Slide';
import styles from './SlideHero.module.css';

const stats = [
  { num: '200+', label: 'Построенных домов' },
  { num: '7+', label: 'Лет опыта' },
  { num: '5', label: 'Лет гарантии' },
  { num: '0 \u20BD', label: 'Скрытых платежей' },
];

function SlideHero({ active }: { active: boolean }) {
  return (
    <Slide active={active} className={styles.slideHero}>
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>Новый Коттедж | с 2018 года</div>
        <h1 className={styles.heroTitle}>
          Строим дома,
          <br />в которых <span>хочется жить</span>
        </h1>
        <p className={styles.heroSub}>
          Полный цикл строительства загородных домов под ключ в Санкт-Петербурге и Ленинградской
          области. От фундамента до новоселья.
        </p>
        <div className={styles.heroStats}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className={styles.heroStatNum}>{s.num}</div>
              <div className={styles.heroStatLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

export default memo(SlideHero);
