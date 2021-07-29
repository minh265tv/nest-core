import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDatabaseName, UserSchema } from 'src/users/model/users.model'
import { PermissionRoleDatabaseName, PermissionRoleSchema } from 'src/users/model/permission-role.model'
import { PermissionDatabaseName, PermissionSchema } from 'src/users/model/permissions.model'
import { PermissionsSeederService } from './permissions.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: UserDatabaseName, schema: UserSchema },
      {name: PermissionRoleDatabaseName, schema: PermissionRoleSchema },
      {name: PermissionDatabaseName, schema: PermissionSchema }
    ])
  ],
  providers: [
    PermissionsSeederService, 
    ConfigService
  ]
})
@Injectable()
export class PermissionsSeederModule {

}
