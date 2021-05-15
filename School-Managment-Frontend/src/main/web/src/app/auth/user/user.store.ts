import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from './user.model';


@Injectable({ providedIn: 'root' })
export class UserStore {
    private _users: BehaviorSubject<User[]> = new BehaviorSubject([]);

    public readonly users: Observable<User[]> = this._users.asObservable();

    constructor(private userService: UserService) {
        this.loadInitialData();
    }

    private loadInitialData(): void {
        this.userService.getAllUsers()
            .then(
                (users: User[]) => {
                    this._users.next(users);
                },
                err => console.log('Error retrieving Roles')
            );
    }


    public addUser(newUser: User): Promise<void | User> {
        const obs = this.userService.saveUser(newUser);
        obs.then(
            res => {
                if (res) {
                    this._users.next([...this._users.getValue(), res]);
                }
            });
        return obs;
    }

    public deleteUser(deleted: User): Promise<void> {
        const obs = this.userService.deletetUser(deleted);
        obs.then(
            res => {
                let users: User[] = this._users.getValue();
                const index = users.findIndex((user) => user.resourceUrl === deleted.resourceUrl);
                users.splice(index, 1)
                this._users.next(users);
            }
        );

        return obs;
    }

    public updateUser(updateUser: User): Promise<User> {
        const obs = this.userService.updatetUser(updateUser);
        obs.then(
            (res: User) => {
                this.userService.getUser(res.resourceUrl).then((user: User) => {
                    let users: User[] = this._users.getValue();
                    const index = users.findIndex((user) => user.resourceUrl === updateUser.resourceUrl);
                    user[index] = user;
                    this._users.next(users);
                    return res;
                });
            }
        );
        return obs;
    }
}
