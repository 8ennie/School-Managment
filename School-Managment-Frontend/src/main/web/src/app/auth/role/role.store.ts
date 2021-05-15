import { RoleService } from './role.service';
import { Role } from './role.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleStore {
    private _roles: BehaviorSubject<Role[]> = new BehaviorSubject([]);

    public readonly roles: Observable<Role[]> = this._roles.asObservable();

    constructor(
        private readonly roleService: RoleService,
    ) {
        this.loadInitialData();
    }

    private loadInitialData(): void {
        this.roleService.getAllRoles()
            .then(
                (res: Role[]) => {
                    this._roles.next([...res]);
                },
                err => console.log('Error retrieving Roles')
            );
    }

    public getRole(resourceUrl: string): Promise<Role> {
        return this.roleService.getRole(resourceUrl);
    }

    public addRole(newRole: Role): Promise<Role | void> {
        const obs = this.roleService.saveRole(newRole);
        obs.then(
            res => {
                if (res) {
                    this.roleService.getRole(res.resourceUrl)
                        .then((role: Role) => {
                            return this._roles.next([...this._roles.getValue(), role]);
                        });
                }
            });
        return obs;
    }

    public deleteRole(deleted: Role): Promise<void> {
        const obs = this.roleService.deleteRole(deleted);
        obs.then(
            res => {
                const roles: Role[] = this._roles.getValue();
                const index = roles.findIndex((role) => role.resourceUrl === deleted.resourceUrl);
                this._roles.next(roles.splice(index, 1));
            }
        );
        return obs;
    }

    public updateRole(updateRole: Role): Promise<Role> {
        const obs = this.roleService.updateRole(updateRole);

        obs.then(
            (res: Role) => {
                this.roleService.getRole(res.resourceUrl)
                    .then((role: Role) => {
                        const roles: Role[] = this._roles.getValue();
                        const index = roles.findIndex((r) => r.resourceUrl === updateRole.resourceUrl);
                        roles[index] = role;
                        this._roles.next(roles);
                        return res;
                    });
            }
        );
        return obs;
    }
}
