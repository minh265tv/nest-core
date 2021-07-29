import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDatabaseName } from "src/users/model/users.model";
import { PermissionsSeederService } from "./permissions/permissions.service";


@Injectable()
export class Seeder {
    constructor(
        private readonly permissionsSeederService: PermissionsSeederService,
        @InjectModel(UserDatabaseName) private readonly userModel: Model<User>,
        private readonly configService: ConfigService
    ) { }
    async seed(): Promise<void> {
        if(process.env.SEED_USER){
            await this.user();
        }
        await this.permissions();
    }

    async permissions(): Promise<void> {
        await this.permissionsSeederService.deleteAllPermission();
        await this.permissionsSeederService.seedAllPermissions();
        await this.permissionsSeederService.seedAllPermissionRole();
    }

    async user(): Promise<void> {
        const user = {
            "email": "minhnq@gviet.vn",
            "name": "Minh nguyen",
            "phone": "0123456789",
            "password": "12345678",
            "role": this.configService.get("role").ADMIN,
            "status": this.configService.get("userStatus").ACTIVE
        }

        await this.userModel.create(user)
    }
}