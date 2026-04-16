import { memo, type SyntheticEvent } from 'react';
import Slide from '../Slide';
import styles from './SlideWorks.module.css';

const works = [
  {
    name: 'Дом «Норд»',
    specs: 'Газобетон | 259 м2',
    price: 'от 9,7 млн \u20BD',
    img: 'https://ncottage.ru/app/uploads/2023/07/nord-new.jpg',
    fallback: 'https://ncottage.ru/app/uploads/2023/07/nord-new.webp',
  },
  {
    name: 'Дом «Аластер»',
    specs: 'Газобетон | 320 м2',
    price: 'от 12,8 млн \u20BD',
    img: 'https://ncottage.ru/app/uploads/2023/07/alaster-new.jpg',
    fallback: 'https://ncottage.ru/app/uploads/2023/07/alaster-new.webp',
  },
  {
    name: 'Дом «Вальтер»',
    specs: 'Кирпич | 401 м2',
    price: 'от 10,4 млн \u20BD',
    img: 'https://ncottage.ru/app/uploads/2023/07/valter-new.jpg',
    fallback: 'https://ncottage.ru/app/uploads/2023/07/valter-new.webp',
  },
  {
    name: 'Дом «Элиот»',
    specs: 'Каркасный | 255 м2',
    price: 'от 7,3 млн \u20BD',
    img: 'https://ncottage.ru/app/uploads/2023/07/eliot-new.jpg',
    fallback: 'https://ncottage.ru/app/uploads/2023/07/eliot-new.webp',
  },
];

const handleError = (fallback: string) => (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== fallback) img.src = fallback;
};

function SlideWorks({ active }: { active: boolean }) {
  return (
    <Slide active={active} className={styles.slideWorks}>
      <div className={styles.worksInner}>
        <div className={styles.worksHeader}>
          <div className="section-label">Портфолио</div>
          <h2 className={styles.worksTitle}>Примеры наших работ</h2>
          <p className={styles.worksSub}>Реализованные проекты загородных домов</p>
        </div>
        <div className={styles.worksGrid}>
          {works.map((w) => (
            <div key={w.name} className={styles.workCard}>
              <img
                src={w.img}
                alt={w.name}
                decoding="async"
                onError={handleError(w.fallback)}
              />
              <div className={styles.workCardOverlay}>
                <div className={styles.workCardName}>{w.name}</div>
                <div className={styles.workCardSpecs}>{w.specs}</div>
                <div className={styles.workCardPrice}>{w.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

export default memo(SlideWorks);
