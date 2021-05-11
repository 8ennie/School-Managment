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

    public getAllActiveMonitors(): Promise<Monitor[]> {
        return this.http.get<HateoasCollection<EmbeddedMonitorHateoas>>(API_URL + '/search/findByActiveTrue')
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


    public setStartUrl(monitor: Monitor): Promise<string> {
        const formData = new FormData();
        formData.append('startUrl', monitor.startUrl.toString());
        return this.http.post('http://' + monitor.ipAddress + '/settings/startUrl', formData, { responseType: 'text' }).toPromise();
    }

    public setStartResumeLastShow(monitor: Monitor): Promise<boolean> {
        const formData = new FormData();
        formData.append('resumeLastShow', monitor.onStartResumeLastShow ? 'true' : 'false');
        return this.http.post<boolean>('http://' + monitor.ipAddress + '/settings/onStartResumeLastShow', formData).toPromise();
    }

    public loginAndStartShow(monitor: Monitor): Promise<void> {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        if (monitor.imageShow?.id) {
            formData.append('showId', monitor.imageShow.id.toString());
        } else {
            const imageShowId: string = monitor.imageShowUrl.split('/').slice(-1)[0];
            formData.append('showId', imageShowId);
        }
        return this.http.post<void>('http://' + monitor.ipAddress + '/show/loginAndShow', formData).toPromise();
    }

    loginForShow(monitor: Monitor) {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        return this.http.post('http://' + monitor.ipAddress + '/show/login', formData).toPromise().then(
            (status: boolean) => {
                return status;
            });
    }





    monitorScreen(monitor: Monitor, state: boolean) {
        return this.http.post('http://' + monitor.ipAddress + '/screen/changeStatus?status=' + state, '').toPromise().then(
            (status: boolean) => {
                return status;
            });
    }

    private getMonitorStatus(monitor: Monitor): Promise<MonitorStatus> {
        return this.http.get('http://' + monitor.ipAddress + '/status').toPromise().then(
            (status: (MonitorStatus)) => {
                return status;
            });
    }

    private setMonitorId(monitor: Monitor): Promise<number> {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        return this.http.post<number>('http://' + monitor.ipAddress + '/settings/monitorId', formData).toPromise();
    }

    public pingMonitor(monitor: Monitor): Promise<Monitor> {
        return this.getMonitorStatus(monitor).then(
            status => {
                if (!status.monitorId || status.monitorId != monitor.id) {
                    this.setMonitorId(monitor);
                }
                monitor.currentUrl = status.url;
                monitor.status = status.screenStatus;
                monitor.serverIp = status.serverIp;
                monitor.wakeTime = new Date(new Date().toDateString() + ' ' + status.wakeTime);
                monitor.sleepTime = new Date(new Date().toDateString() + ' ' + status.sleepTime);
                monitor.onStartResumeLastShow = status.onStartResumeLastShow;
                monitor.startUrl = status.startUrl;
                return monitor;
            }
        ).catch(() => {
            monitor.status = null;
            return monitor;
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



    loginAndShowSubstitution(monitor: Monitor) {
        const formData = new FormData();
        formData.append('monitorId', monitor.id.toString());
        return this.http.post('http://' + monitor.ipAddress + '/show/loginAndShowSubstitution', formData).toPromise();
    }

    public reboot(monitor: Monitor): Promise<boolean> {
        const formData = new FormData();
        formData.append('reboot', 'true');
        return this.http.post<boolean>('http://' + monitor.ipAddress + '/settings/reboot', formData).toPromise();
    }

}

interface MonitorStatus {
    screenStatus: boolean;
    serverIp: string;
    wakeTime: string;
    sleepTime: string;
    onStartResumeLastShow: boolean;
    startUrl: string;
    url: string;
    monitorId: number;
}
