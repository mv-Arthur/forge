import { memo } from 'react';
import Icon from '../Icon';
import Slide from '../Slide';
import styles from './SlideWhy.module.css';

const features = [
  {
    title: 'Фиксированная цена в договоре',
    desc: 'Никаких доплат и скрытых расходов после подписания',
    icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  },
  {
    title: 'Строгое соблюдение сроков',
    desc: 'Штрафные санкции за каждый день просрочки',
    icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  },
  {
    title: 'Собственные бригады',
    desc: 'Не привлекаем субподрядчиков — полный контроль качества',
    icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  },
];

function SlideWhy({ active }: { active: boolean }) {
  return (
    <Slide active={active} className={styles.slideWhy}>
      <div className={styles.whyInner}>
        <div className={styles.whyLeft}>
          <div className="section-label">Почему мы</div>
          <h2 className={styles.whyTitle}>
            Почему клиенты
            <br />
            выбирают <span style={{ color: '#4ade80' }}>нас?</span>
          </h2>
          <p className={styles.whyDesc}>
            Мы не просто строим дома — мы создаем пространство для жизни. Каждый проект уникален,
            каждый клиент важен.
          </p>
          <div className={styles.whyFeatures}>
            {features.map((f) => (
              <div key={f.title} className={styles.whyFeature}>
                <div className={styles.whyFeatureIcon}>
                  <Icon path={f.icon} />
                </div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.whyRight}>
          <img
            className={styles.whyImage}
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
            alt="Строительство дома"
            decoding="async"
          />
          <div className={styles.whyImageBadge}>100% домов сданы в срок</div>
        </div>
      </div>
    </Slide>
  );
}

export default memo(SlideWhy);
