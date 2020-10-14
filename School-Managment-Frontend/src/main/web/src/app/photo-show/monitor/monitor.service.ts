import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Monitor } from './monitor.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class MonitorService {

    ressorceUrl = environment.apiUrl + 'monitors';


    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    getAllMonitors() {
        return this.http.get<any>(this.ressorceUrl + '?projection=').toPromise()
            .then(res =>
                <Monitor[]>res._embedded.monitors
            )
    }

    getMonitorsByArea(area: string) {
        return this.http.get(this.ressorceUrl + '/search/findByAreas?area=' + area).toPromise();
    }

    getMonitorsByShowId(id: string) {
        return this.http.get(this.ressorceUrl + '/search/findByImageShowId?id=' + id).toPromise();
    }


    saveMonitor(monitor: Monitor) {
        return this.http.post<Monitor>(this.ressorceUrl, monitor).toPromise()
            .then(monitor => {
                let monitorId = monitor._links.self.href.split("/").slice(-1)[0];
                monitor.id = monitorId
                this.authService.signUpMonitor(monitor).then(
                    monitorUser => console.log(monitorUser)
                );
                return monitor
            });
    }

    updateMonitor(id: number, monitor: Monitor) {
        return this.http.patch<any>(this.ressorceUrl + '/' + id, monitor).toPromise()
            .then(res =>
                <Monitor>res
            )
            .then(data => {
                return data;
            });
    }

    deleteMonitor(id: number,) {
        return this.http.delete<any>(this.ressorceUrl + '/' + id).toPromise()
    }



    loginForShow(monitor: Monitor) {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        return this.http.post('http://' + monitor.ipAddress + '/show/login', formData).toPromise().then(
            (status: boolean) => {
                return status;
            });
    }

    

    loginAndStartShow(monitor: Monitor) {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        if(monitor.imageShow.id){
            formData.append('showId', monitor.imageShow.id.toString());
        } else {
            const showUrlParts = monitor.imageShow.split("/");
            const showId = showUrlParts[showUrlParts.length-1]
            formData.append('showId', showId);
        }
        return this.http.post('http://' + monitor.ipAddress + '/show/loginAndShow', formData).toPromise().then(
            () => {
                console.log('Starting');
            });
    }

    monitorScreen(monitor: Monitor, state: boolean) {
        return this.http.post('http://' + monitor.ipAddress + '/screen/changeStatus?status=' + state, '').toPromise().then(
            (status: boolean) => {
                return status;
            });
    }

    getMonitorStatus(monitor: Monitor) {
        return this.http.get('http://' + monitor.ipAddress + '/status').toPromise().then(
            (status: (MonitorStatus)) => {
                return status;
            });
    }

    setServerIP(monitor: Monitor) {
        const formData = new FormData();
        formData.append('ip', monitor.serverIp);
        return this.http.post('http://' + monitor.ipAddress + '/settings/serverIp', formData).toPromise().then(
            (serverIP) => {
                console.log(serverIP);
                return serverIP;
            });
    }

    setWakeTime(monitor: Monitor) {
        const formData = new FormData();
        formData.append('time',  monitor.wakeTime.getHours() + ':' + monitor.wakeTime.getMinutes());
        return this.http.post('http://' + monitor.ipAddress + '/settings/wakeTime', formData).toPromise().then(
            (status: boolean) => {
                return status;
            });
    }

    setSleepTime(monitor: Monitor) {
        const formData = new FormData();
        formData.append('time', monitor.sleepTime.getHours() + ':' + monitor.sleepTime.getMinutes());
        return this.http.post('http://' + monitor.ipAddress + '/settings/sleepTime', formData).toPromise().then(
            (status: boolean) => {
                return status;
            });
    }

    loginAndShowSubstitution(monitor: Monitor) {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        return this.http.post('http://' + monitor.ipAddress + '/show/loginAndShowSubstitution', formData).toPromise();
    }

    reboot(monitor: Monitor){
        const formData = new FormData();
        formData.append('reboot', 'true');
        return this.http.post('http://' + monitor.ipAddress + '/settings/reboot', formData).toPromise();
    }

}

interface MonitorStatus{
     screenStatus: boolean;
     serverIp: string;
     wakeTime: string;
     sleepTime:string;
}