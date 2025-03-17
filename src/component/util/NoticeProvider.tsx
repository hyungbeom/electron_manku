import { createContext, useContext } from "react";
import { notification } from "antd";

const NotificationContext = createContext(null);

export const NoticeProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const notificationAlert = (type, title, description, onClick, style = {cursor : 'pointer'}) => {
        api[type]({
            message: title,
            description: description,
            onClick: onClick,
            duration: 10,
            style: style,
            placement: "bottomLeft"
        });
    };

    return (
        <NotificationContext.Provider value={notificationAlert}>
            {contextHolder} {/* ✅ 여기에 있어야 알림이 정상 동작함 */}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationAlert = () => useContext(NotificationContext);