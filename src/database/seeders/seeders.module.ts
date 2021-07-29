
import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '../database.module'
import { Seeder } from './seeder'
import databaseConfig from '../../config/database.config'
import { PermissionsSeederModule } from './permissions/permissions.module';
import { MongooseModule } from '@nestjs/mongoose'
import { UserDatabaseName, UserSchema } from 'src/users/model/users.model'
import { PermissionRoleDatabaseName, PermissionRoleSchema } from 'src/users/model/permission-role.model'
import { PermissionDatabaseName, PermissionSchema } from 'src/users/model/permissions.model'
import { PermissionsSeederService } from './permissions/permissions.service'
import commonConfig from '@config/common.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        commonConfig
      ],
    }),
    DatabaseModule,
    PermissionsSeederModule,
    MongooseModule.forFeature([
      {name: UserDatabaseName, schema: UserSchema },
      {name: PermissionRoleDatabaseName, schema: PermissionRoleSchema },
      {name: PermissionDatabaseName, schema: PermissionSchema }
    ])
  ],
  providers: [
    Seeder,
    Logger,
    PermissionsSeederService
  ]
})
export class SeedersModule {}
