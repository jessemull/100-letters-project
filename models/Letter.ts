import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Correspondence } from './Correspondence';

@Table({
  timestamps: true,
})
export class Letter extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Correspondence)
  @Column({ type: DataType.UUID, allowNull: false })
  correspondenceId!: string;

  @Column({ type: DataType.ENUM('sent', 'received'), allowNull: false })
  type!: 'sent' | 'received';

  @Column({ type: DataType.DATE, allowNull: false })
  date!: Date;

  @Column({ type: DataType.TEXT, allowNull: false })
  text!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  method?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  status?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  title?: string;

  @BelongsTo(() => Correspondence)
  correspondence!: Correspondence;
}
