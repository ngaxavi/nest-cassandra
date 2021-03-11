import {
  Column,
  CreateDateColumn,
  Entity,
  GeneratedUUidColumn,
  UpdateDateColumn,
} from '@lib/cassandra';

@Entity({
  key: [['id']],
})
export class User {
  @GeneratedUUidColumn()
  id: any;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'boolean', default: true })
  isActive: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
