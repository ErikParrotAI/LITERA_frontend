// src/components/InfoPopup/InfoPopup.tsx
import React from 'react';
import { Feature } from '../../hooks/useLocations';
import styles from './InfoPopup.module.scss';

interface InfoPopupProps {
    feature: Feature | null;
    position: { x: number; y: number } | null;
    onShowBookList: (locationName: string, locationId: number) => void;
    onPopupEnter: () => void;
    onPopupLeave: () => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ feature, position, onShowBookList, onPopupEnter, onPopupLeave }) => {
    if (!feature || !position) return null;

    const { properties } = feature;
    // Припускаємо, що властивості містять поле location_id (якщо ні, додайте його на бекенді)
    const locationId = (properties as any).location_id || 0;

    return (
        <div
            className={styles.infoPopup}
            style={{ left: position.x - 150, top: position.y + 40 }}
            onMouseEnter={onPopupEnter}
            onMouseLeave={onPopupLeave}
        >
            <table>
                <thead>
                <tr>
                    <th colSpan={2}>{properties.name}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>📍 Адреса</td>
                    <td>{properties.address}</td>
                </tr>
                <tr>
                    <td>🕒 Графік</td>
                    <td>{properties.work_schedule}</td>
                </tr>
                <tr>
                    <td>
                        <img src="/instagram_icon.png" alt="Instagram Icon" className={styles.icon} />
                        <a
                            href={properties.instagram_link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            Інстаграм
                        </a>
                    </td>
                    <td>
                        <a
                            href="#"
                            className={styles.link}
                            onClick={(e) => {
                                e.preventDefault();
                                onShowBookList(properties.name, locationId);
                            }}
                        >
                            📚 Список книг
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InfoPopup;