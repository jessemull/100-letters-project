import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Person } from './Person';
import { Letter } from './Letter';

@Table({
  timestamps: true,
})
export class Correspondence extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Person)
  @Column({ type: DataType.UUID, allowNull: false })
  personId!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  reason?: string;

  @HasMany(() => Letter)
  letters!: Letter[];

  @BelongsTo(() => Person)
  person!: Person;
}
