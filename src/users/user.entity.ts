import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, Unique, UpdateDateColumn, } from 'typeorm'
import { Exclude, Expose ,Transform} from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Transform(id => id.value.toString() ,{ toPlainOnly: true })
  @ObjectIdColumn()
  _id: ObjectID

  @ApiProperty({})
  id: string

  @ApiProperty()
  @Unique(['email'])
  @Column()
  email: string

  @ApiProperty()
  @Column()
  firstName: string

  @ApiProperty()
  @Column()
  lastName: string

  @ApiProperty()
  @Exclude()
  @Column()
  password: string

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean

  @ApiProperty()
  @CreateDateColumn({
    default: `now()`,
    nullable: true,
  })
  createdAt: string

  @ApiProperty()
  @UpdateDateColumn({
    default: `now()`,
    nullable: true,
  })
  updatedAt: string

  constructor(partial: Partial<User>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
