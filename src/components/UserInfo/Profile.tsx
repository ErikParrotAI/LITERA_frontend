import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { IUser } from '../../interfaces/IUser';
import styles from './Profile.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';


// Helper functions to convert URL <-> string
function urlToString(u: URL | string | null | undefined): string {
    if (!u) return '';
    return typeof u === 'string' ? u : u.href;
}

function parseUrlOrString(value: string): URL | string {
    try {
        return new URL(value);
    } catch {
        return value;
    }
}

const ProfilePage: React.FC = () => {
    const { user, isLoading, updateUser, refetch } = useUser();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<IUser>>({});

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                x_link: user.x_link ? new URL(user.x_link.toString()) : null,
                instagram_link: user.instagram_link ? new URL(user.instagram_link.toString()) : null,
                telegram_link: user.telegram_link ? new URL(user.telegram_link.toString()) : null,
                facebook_link: user.facebook_link ? new URL(user.facebook_link.toString()) : null,
            });
        }
    }, [user]);

    if (isLoading) return <p>Loading...</p>;

    const handleInputChange = (field: keyof IUser) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleUrlChange = (field: keyof IUser) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: parseUrlOrString(e.target.value) }));
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        updateUser(formData);
        setEditMode(false);
    };

    const handleCancelClick = () => {
        setFormData({
            username: user?.username ?? '',
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            email: user?.email ?? '',
            phone_number: user?.phone_number ?? '',
            x_link: user?.x_link ? new URL(user.x_link.toString()) : null,
            instagram_link: user?.instagram_link ? new URL(user.instagram_link.toString()) : null,
            telegram_link: user?.telegram_link ? new URL(user.telegram_link.toString()) : null,
            facebook_link: user?.facebook_link ? new URL(user.facebook_link.toString()) : null,
        });
        setEditMode(false);
    };

    return (
        <div className={styles.container}>
            <h1>Профіль</h1>

            <div className={styles.section}>
                <div className={styles['user-info']}>
                    <div className={styles['user-pic']}>
                        <img src={'./assets/power-headset.jpg'} className={styles['img']} alt="User Profile Image" />
                    </div>
                    <div className={styles['profile-details']}>
                        {editMode ? (
                            <div className={styles['input-container']}>
                                <div className={styles['input-row']}>
                                    <label><strong>Нікнейм:</strong></label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username ?? ''}
                                        onChange={handleInputChange('username')}
                                        className={styles['form-control']}
                                        placeholder="Нікнейм"
                                    />
                                </div>
                                <div className={styles['input-row']}>
                                    <label><strong>Ім'я:</strong></label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name ?? ''}
                                        onChange={handleInputChange('first_name')}
                                        className={styles['form-control']}
                                        placeholder="Ім'я"
                                    />
                                </div>
                                <div className={styles['input-row']}>
                                    <label><strong>Прізвище:</strong></label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name ?? ''}
                                        onChange={handleInputChange('last_name')}
                                        className={styles['form-control']}
                                        placeholder="Прізвище"
                                    />
                                </div>
                                <div className={styles['input-row']}>
                                    <label><strong>Email:</strong></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email ?? ''}
                                        onChange={handleInputChange('email')}
                                        className={styles['form-control']}
                                        placeholder="Email"
                                    />
                                </div>
                                <div className={styles['input-row']}>
                                    <label><strong>Телефон:</strong></label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number ?? ''}
                                        onChange={handleInputChange('phone_number')}
                                        className={styles['form-control']}
                                        placeholder="Телефон"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p><strong>Нікнейм:</strong> {user?.username ?? 'username'}</p>
                                <p><strong>Ім'я:</strong> {user?.first_name ?? 'first name'}</p>
                                <p><strong>Прізвище:</strong> {user?.last_name ?? 'last name'}</p>
                                <p><strong>Email:</strong> {user?.email ?? 'email'}</p>
                                <p><strong>Телефон:</strong> {user?.phone_number ?? ' - '}</p>
                            </>
                        )}
                    </div>
                </div>
                {editMode ? (
                    <div className={styles['btn']}>
                        <button className={styles['btnAccept']} onClick={handleSaveClick}>Зберегти</button>
                        <button className={styles['btnCancel']} onClick={handleCancelClick}>Скасувати</button>
                    </div>
                ) : (
                    <button className={styles['editButton']} onClick={handleEditClick}>Редагувати</button>
                )}
                <hr />
                <div className={styles['social-section']}>
                    <h3>Соцмережі</h3>
                    {editMode ? (
                        <div className={styles['input-container']}>
                            <div className={styles['input-row']}>
                                <label><strong>Twitter:</strong></label>
                                <input
                                    type="url"
                                    name="x_link"
                                    value={urlToString(formData.x_link)}
                                    onChange={handleUrlChange('x_link')}
                                    className={styles['form-control']}
                                    placeholder="Twitter URL"
                                />
                            </div>
                            <div className={styles['input-row']}>
                                <label><strong>Instagram:</strong></label>
                                <input
                                    type="url"
                                    name="instagram_link"
                                    value={urlToString(formData.instagram_link)}
                                    onChange={handleUrlChange('instagram_link')}
                                    className={styles['form-control']}
                                    placeholder="Instagram URL"
                                />
                            </div>
                            <div className={styles['input-row']}>
                                <label><strong>Telegram:</strong></label>
                                <input
                                    type="url"
                                    name="telegram_link"
                                    value={urlToString(formData.telegram_link)}
                                    onChange={handleUrlChange('telegram_link')}
                                    className={styles['form-control']}
                                    placeholder="Telegram URL"
                                />
                            </div>
                            <div className={styles['input-row']}>
                                <label><strong>Facebook:</strong></label>
                                <input
                                    type="url"
                                    name="facebook_link"
                                    value={urlToString(formData.facebook_link)}
                                    onChange={handleUrlChange('facebook_link')}
                                    className={styles['form-control']}
                                    placeholder="Facebook URL"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles['social-icons']}>
                            {user?.x_link && (
                                <Link to={user?.x_link} target="_blank" className={styles['social-icon']}>
                                    <i className="fab fa-twitter"></i>
                                </Link>
                            )}
                            {user?.instagram_link && (
                                <Link to={user?.instagram_link} target="_blank" className={styles['social-icon']}>
                                    <i className="fab fa-instagram"></i>
                                </Link>
                            )}
                            {user?.telegram_link && (
                                <Link to={user?.telegram_link} target="_blank" className={styles['social-icon']}>
                                    <i className="fab fa-telegram"></i>
                                </Link>
                            )}
                            {user?.facebook_link && (
                                <Link to={user?.facebook_link} target="_blank" className={styles['social-icon']}>
                                    <i className="fab fa-facebook"></i>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
