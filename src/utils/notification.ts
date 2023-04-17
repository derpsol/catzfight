import { Store } from 'react-notifications-component';

interface INotification {
    title: string,
    message? : string,
    type: 'success' | 'danger' | 'info' | 'default' | 'warning'
}

export const notification = ({ title, message="", type }: INotification) => {
    return Store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}