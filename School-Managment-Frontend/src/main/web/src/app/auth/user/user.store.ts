import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { List } from 'immutable';
import { User } from './user.model';


@Injectable({ providedIn: 'root' })
export class UserStore {
    private _users: BehaviorSubject<List<User>> = new BehaviorSubject(List([]));

    public readonly users: Observable<List<User>> = this._users.asObservable();

    constructor(private userService: UserService) {
        this.loadInitialData();
    }

    loadInitialData() {
        this.userService.getAllUsers()
            .then(
                (res: { _embedded }) => {
                    let users = res._embedded.users;
                    this._users.next(List(users));
                },
                err => console.log("Error retrieving Roles")
            );
    }


    addUser(newUser: User) {
        let obs = this.userService.saveUser(newUser);
        obs.then(
            res => {
                if(res){
                        this._users.next(this._users.getValue().push(res));
                }
            });

        return obs;
    }

    deleteUser(deleted: User) {
        let obs = this.userService.deletetUser(deleted);
        obs.then(
            res => {
                let users: List<User> = this._users.getValue();
                let index = users.findIndex((user) => user.id === deleted.id);
                this._users.next(users.delete(index));
            }
        );

        return obs;
    }

    updateUser(updateUser: User) {
        let obs = this.userService.updatetUser(updateUser);
        obs.then(
            (res: User) => {
                var id: number = res._links.self.href.split('/').pop();
                this.userService.getUser(id.toString()).then((user: User) => {
                    let users: List<User> = this._users.getValue();
                    let index = users.findIndex((role) => role.id === updateUser.id);
                    console.log(user);
                    
                    this._users.next(users.update(index, () => user));
                });
            }
        );

        return obs;
    }
}