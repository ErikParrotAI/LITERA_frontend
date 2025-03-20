import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { IUser } from '../interfaces/IUser';
import styles from './ProfilePage.module.scss';

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
    // Додано refetch для примусового оновлення даних
    const { user, isLoading, updateUser, changePassword, refetch } = useUser();

    // Примусове оновлення даних при першому монтуванні компонента
    useEffect(() => {
        refetch();
    }, [refetch]);

    // Використовуємо один стан для форми (без avatar та is_private)
    const [formData, setFormData] = useState<Partial<IUser>>({});
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    const handleUpdateProfile = () => {
        updateUser(formData);
    };

    const handleChangePassword = () => {
        changePassword({ oldPassword, newPassword });
    };

    return (
        <div className={styles.container}>
            <h1>Profile: {user?.username}</h1>

            <div className={styles.section}>
                <h2>Update Profile</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username ?? ''}
                    onChange={handleInputChange('username')}
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={formData.first_name ?? ''}
                    onChange={handleInputChange('first_name')}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.last_name ?? ''}
                    onChange={handleInputChange('last_name')}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email ?? ''}
                    onChange={handleInputChange('email')}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phone_number ?? ''}
                    onChange={handleInputChange('phone_number')}
                />
                <input
                    type="text"
                    placeholder="X Link"
                    value={urlToString(formData.x_link)}
                    onChange={handleUrlChange('x_link')}
                />
                <input
                    type="text"
                    placeholder="Instagram Link"
                    value={urlToString(formData.instagram_link)}
                    onChange={handleUrlChange('instagram_link')}
                />
                <input
                    type="text"
                    placeholder="Telegram Link"
                    value={urlToString(formData.telegram_link)}
                    onChange={handleUrlChange('telegram_link')}
                />
                <input
                    type="text"
                    placeholder="Facebook Link"
                    value={urlToString(formData.facebook_link)}
                    onChange={handleUrlChange('facebook_link')}
                />
                <button onClick={handleUpdateProfile}>Update</button>
            </div>

            <div className={styles.section}>
                <h2>Change Password</h2>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Change</button>
            </div>
        </div>
    );
};

export default ProfilePage;