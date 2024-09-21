import { Entity, ManyToOne, Column, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Notifications } from './Notifications';
import { Users } from './Users';

@Entity()
export class NotificationUser extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    NotificationID: number;

 


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
