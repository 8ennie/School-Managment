import { RoleService } from './role.service';
import { Role } from './role.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { List } from 'immutable';


@Injectable({ providedIn: 'root' })
export class RoleStore {
    private _roles: BehaviorSubject<List<Role>> = new BehaviorSubject(List([]));

    public readonly roles: Observable<List<Role>> = this._roles.asObservable();

    constructor(private roleService: RoleService) {
        this.loadInitialData();
    }

    loadInitialData() {
        this.roleService.getAllRoles()
            .then(
                (res: { _embedded }) => {
                    let roles = res._embedded.roles;
                    this._roles.next(List(roles));
                },
                err => console.log("Error retrieving Roles")
            );
    }


    addRole(newRole: Role) {
        let obs = this.roleService.saveRole(newRole);

        obs.then(
            res => {
                if(res){
                    var id: number = res._links.self.href.split('/').pop();
                    this.roleService.getRole(id.toString()).then((role: Role) => {
                        console.log(role);
                        
                        this._roles.next(this._roles.getValue().push(role));
                    });
                }
            });

        return obs;
    }

    deleteRole(deleted: Role) {
        let obs = this.roleService.deleteRole(deleted);
        obs.then(
            res => {
                let roles: List<Role> = this._roles.getValue();
                let index = roles.findIndex((role) => role.id === deleted.id);
                this._roles.next(roles.delete(index));
            }
        );

        return obs;
    }

    updateRole(updateRole: Role) {
        let obs = this.roleService.updateRole(updateRole);

        obs.then(
            (res: Role) => {
                var id: number = res._links.self.href.split('/').pop();
                this.roleService.getRole(id.toString()).then((role: Role) => {
                    let roles: List<Role> = this._roles.getValue();
                    let index = roles.findIndex((role) => role.id === updateRole.id);
                    this._roles.next(roles.update(index, () => role));
                });
            }
        );

        return obs;
    }
}