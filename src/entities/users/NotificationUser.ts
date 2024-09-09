import { Entity, ManyToOne, Column, PrimaryColumn } from 'typeorm';
import { Notifications } from './Notifications';
import { Users } from './Users';

@Entity()
export class NotificationUser {

    @PrimaryColumn()
    NotificationID: number;

    @PrimaryColumn()
    UserID: number;


    @ManyToOne(() => Notifications, (notification) => notification.NotificationID)
    Notification: Notifications;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @Column('boolean')
    IsSend: boolean;

    @Column('boolean')
    IsRead: boolean;

    @Column('boolean')
    IsEmail: boolean;
}
