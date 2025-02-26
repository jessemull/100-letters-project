import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Correspondence } from './Correspondence';

@Table({
  timestamps: true,
})
export class Person extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address?: string;

  @HasMany(() => Correspondence)
  correspondences!: Correspondence[];
}
