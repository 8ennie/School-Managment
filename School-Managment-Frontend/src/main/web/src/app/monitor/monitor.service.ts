import { Monitor } from 'src/app/monitor/monitor.model';
import { MonitorHateoas } from './monitor.model';
import { Embeddeds, HateoasCollection } from './../_helper/spring-hateoas/hateoas-collection';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { map } from 'rxjs/operators';


const API_URL = environment.apiUrl + 'monitors';

interface EmbeddedMonitorHateoas extends Embeddeds<MonitorHateoas> {
    monitors: MonitorHateoas[];
}

@Injectable({ providedIn: 'root' })
export class MonitorService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    public getAllMonitors(): Promise<Monitor[]> {
        return this.http.get<HateoasCollection<EmbeddedMonitorHateoas>>(API_URL)
            .pipe(
                map(
                    (monitorHateoasCollection: HateoasCollection<EmbeddedMonitorHateoas>): Monitor[] => {
                        const monitorHateoasArray: MonitorHateoas[] = monitorHateoasCollection._embedded.monitors;
                        return monitorHateoasArray.map((m: MonitorHateoas): Monitor => Object.assign(new Monitor(), m));
                    }
                )
            )
            .toPromise();
    }

    public getMonitorsByArea(area: string): Promise<Monitor[]> {
        return this.http.get<HateoasCollection<EmbeddedMonitorHateoas>>(API_URL + '/search/findByAreas?area=' + area)
            .pipe(
                map(
                    (monitorHateoasCollection: HateoasCollection<EmbeddedMonitorHateoas>): Monitor[] => {
                        const monitortHateoasArray: MonitorHateoas[] = monitorHateoasCollection._embedded.monitors;
                        return monitortHateoasArray.map((m: MonitorHateoas): Monitor => Object.assign(new Monitor(), m));
                    }
                )
            )
            .toPromise();
    }

    public getActiveMonitorsByArea(area: string): Promise<Monitor[]> {
        return this.http.get<HateoasCollection<EmbeddedMonitorHateoas>>(API_URL + '/search/findByAreasAndActiveTrue?area=' + area)
            .pipe(
                map(
                    (monitorHateoasCollection: HateoasCollection<EmbeddedMonitorHateoas>): Monitor[] => {
                        const monitortHateoasArray: MonitorHateoas[] = monitorHateoasCollection._embedded.monitors;
                        return monitortHateoasArray.map((m: MonitorHateoas): Monitor => Object.assign(new Monitor(), m));
                    }
                )
            )
            .toPromise();
    }

    public getMonitorsByShowId(id: string): Promise<Monitor[]> {
        return this.http.get<HateoasCollection<EmbeddedMonitorHateoas>>(API_URL + '/search/findByImageShowId?id=' + id)
            .pipe(
                map(
                    (monitorHateoasCollection: HateoasCollection<EmbeddedMonitorHateoas>): Monitor[] => {
                        const monitortHateoasArray: MonitorHateoas[] = monitorHateoasCollection._embedded.monitors;
                        return monitortHateoasArray.map((m: MonitorHateoas): Monitor => Object.assign(new Monitor(), m));
                    }
                )
            )
            .toPromise();
    }


    public saveMonitor(monitor: Monitor): Promise<Monitor> {
        return this.http.post<EmbeddedMonitorHateoas>(API_URL, monitor)
            .pipe(
                map((monitorHateoas: EmbeddedMonitorHateoas): Monitor => Object.assign(new Monitor(), monitorHateoas))
            )
            .toPromise()
            .then((m: Monitor) => {
                this.authService.signUpMonitor(m.id);
                return m;
            });
    }

    public updateMonitor(monitor: Monitor): Promise<Monitor> {
        monitor.imageShowUrl = monitor.imageShowUrl;
        return this.http.patch<EmbeddedMonitorHateoas>(monitor.resourceUrl, monitor)
            .pipe(
                map((monitorHateoas: EmbeddedMonitorHateoas): Monitor => {
                    return Object.assign(new Monitor(), monitorHateoas);
                })
            )
            .toPromise();
    }

    public deleteMonitor(monitor: Monitor): Promise<void> {
        return this.http.delete<void>(monitor.resourceUrl).toPromise();
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
        if (monitor.imageShow?.id) {
            formData.append('showId', monitor.imageShow.id.toString());
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
        formData.append('time', monitor.wakeTime.getHours() + ':' + monitor.wakeTime.getMinutes());
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

    setStartUrl(monitor: Monitor) {
        const formData = new FormData();
        formData.append('resumeLastShow', monitor.startUrl);
        return this.http.post('http://' + monitor.ipAddress + '/settings/startUrl', formData).toPromise().then(
            (serverIP) => {
                console.log(serverIP);
                return serverIP;
            });
    }

    setStartResumeLastShow(monitor: Monitor) {
        const formData = new FormData();
        formData.append('resumeLastShow', monitor.onStartResumeLastShow ? 'true' : 'false');
        return this.http.post('http://' + monitor.ipAddress + '/settings/onStartResumeLastShow', formData).toPromise().then(
            (serverIP) => {
                console.log(serverIP);
                return serverIP;
            });
    }

    loginAndShowSubstitution(monitor: Monitor) {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        return this.http.post('http://' + monitor.ipAddress + '/show/loginAndShowSubstitution', formData).toPromise();
    }

    reboot(monitor: Monitor) {
        const formData = new FormData();
        formData.append('reboot', 'true');
        return this.http.post('http://' + monitor.ipAddress + '/settings/reboot', formData).toPromise();
    }

}

interface MonitorStatus {
    screenStatus: boolean;
    serverIp: string;
    wakeTime: string;
    sleepTime: string;
    onStartResumeLastShow: boolean;
    startUrl: string;
}
