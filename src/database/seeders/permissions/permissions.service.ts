import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionRole, PermissionRoleDatabaseName } from 'src/users/model/permission-role.model';
import { Permission, PermissionDatabaseName } from 'src/users/model/permissions.model';
import { User, UserDatabaseName } from 'src/users/model/users.model';
import { actions, resources } from './data';



@Injectable()
export class PermissionsSeederService {
    constructor(
        @InjectModel(PermissionDatabaseName) private readonly permissionModel: Model<Permission>,
        @InjectModel(PermissionRoleDatabaseName) private readonly permissionRoleModel: Model<PermissionRole>,
        private readonly configService: ConfigService
    ) {

    }

    public async deleteAllPermission(): Promise<void> {
        await this.permissionModel.deleteMany({});
        await this.permissionRoleModel.deleteMany({});
    }

    public async seedAllPermissions(): Promise<void> {
        let allPermissions = [];
        for (let resource of Object.values(resources)) {
            for (let path of Object.values(resource.path)) {
                for (let action of Object.values(actions)) {
                    allPermissions.push(this.buildPermission(action, resource.name, path));
                }
            }
        }

        let allPermissionsInsert = allPermissions.map(permission => {
            return { name: permission }
        });
        await this.permissionModel.insertMany(allPermissionsInsert);
    }

    public async seedAllPermissionRole(): Promise<void> {
        const allRole = this.configService.get('role');
        let allPermissionRoles = [];
        for (let role of Object.values(allRole)) {
            switch (role) {
                case allRole.ADMIN:
                    allPermissionRoles = allPermissionRoles.concat(await this.seedPermissionRoleAdmin());
                    break;
                case allRole.EDITOR:
                    allPermissionRoles = allPermissionRoles.concat(await this.seedPermissionRoleEditor());
                    break;
                case allRole.DISTRIBUTOR:
                    allPermissionRoles = allPermissionRoles.concat(await this.seedPermissionRoleDistributor());
                    break;
                case allRole.AUTHOR_RIGHT:
                    allPermissionRoles = allPermissionRoles.concat(await this.seedPermissionRoleAuthorRight());
                    break;
            }
        }
        await this.permissionRoleModel.insertMany(allPermissionRoles);
    }

    private async seedPermissionRoleAdmin(): Promise<Array<PermissionRole>> {
        let allPermssionRoles = [];
        let allPathFullAccess = [
            resources.CMS_OPERATOR.path.CLIENT,
            resources.CMS_OPERATOR.path.USER
        ]

        allPermssionRoles = allPermssionRoles.concat(
            await this.buildAccessPermissionRole(
                actions.ALL, resources.CMS_OPERATOR.name, allPathFullAccess, this.configService.get('role').ADMIN
            )
        );

        return allPermssionRoles;
    }

    private async seedPermissionRoleEditor(): Promise<Array<PermissionRole>> {
        let allPermssionRoles = [];

        let allPathFullAccess = [
            resources.CMS_OPERATOR.path.AUTHOR_RIGHT,
            resources.CMS_OPERATOR.path.CONTENT,
            resources.CMS_OPERATOR.path.DISTRIBUTOR_CONTRACT,
            resources.CMS_OPERATOR.path.INGEST_CONFIG,
            resources.CMS_OPERATOR.path.RECORDING_RIGHT,
            resources.CMS_OPERATOR.path.COMPOSER,
            resources.CMS_OPERATOR.path.ARTIST

        ]

        let allPathGet = [
            resources.CMS_OPERATOR.path.DISTRIBUTOR_ANALYTIC,
            resources.CMS_OPERATOR.path.PARTNER_ANALYTIC
        ]

        let allPathPost = [
            resources.CMS_OPERATOR.path.UPLOAD
        ]

        allPermssionRoles = allPermssionRoles.concat(
            await this.buildAccessPermissionRole(
                actions.ALL, resources.CMS_OPERATOR.name, allPathFullAccess, this.configService.get('role').EDITOR
            ),
            await this.buildAccessPermissionRole(
                actions.GET, resources.CMS_OPERATOR.name, allPathGet, this.configService.get('role').EDITOR
            ),
            await this.buildAccessPermissionRole(
                actions.POST, resources.CMS_OPERATOR.name, allPathPost, this.configService.get('role').EDITOR
            ),
        );
        
        return allPermssionRoles;

    }

    private async seedPermissionRoleDistributor(): Promise<Array<PermissionRole>> {
        let allPermssionRoles = [];

        allPermssionRoles = allPermssionRoles.concat(
            await this.buildAccessPermissionRole(
                actions.GET, resources.CMS_PARTNER.name, [resources.CMS_PARTNER.path.DISTRIBUTOR_ANALYTIC], this.configService.get('role').DISTRIBUTOR
            ),
            await this.buildAccessPermissionRole(
                actions.GET, resources.SDP.name, [resources.SDP.path.CONTENT], this.configService.get('role').DISTRIBUTOR
            ),
        );
        
        return allPermssionRoles;
    }

    private async seedPermissionRoleAuthorRight(): Promise<Array<PermissionRole>> {
        let allPermssionRoles = [];

        allPermssionRoles = allPermssionRoles.concat(
            await this.buildAccessPermissionRole(
                actions.ALL, resources.CMS_PARTNER.name, [resources.CMS_PARTNER.path.CONTENT], this.configService.get('role').AUTHOR_RIGHT
            ),
            await this.buildAccessPermissionRole(
                actions.POST, resources.CMS_PARTNER.name, [resources.CMS_PARTNER.path.UPLOAD], this.configService.get('role').AUTHOR_RIGHT
            ),
            await this.buildAccessPermissionRole(
                actions.GET, resources.CMS_PARTNER.name, [resources.CMS_PARTNER.path.PARTNER_ANALYTIC], this.configService.get('role').AUTHOR_RIGHT
            ),

        );

        return allPermssionRoles;
    }

    private async buildAccessPermissionRole(action, name, allPath, role): Promise<Array<PermissionRole>> {
        let allPermssionRoles = [], permissionTmp = "", permissionDatabase;
        for (let path of Object.values(allPath)) {
            permissionTmp = this.buildPermission(action, name, path);
            permissionDatabase = await this.permissionModel.findOne({
                name: permissionTmp
            });

            if (!permissionDatabase) continue;

            allPermssionRoles.push({
                permissionId: permissionDatabase._id,
                role
            });
        }

        return allPermssionRoles;
    }

    private buildPermission(action, name, path): string {
        return action + ':' + name + '/' + path;
    }


}
