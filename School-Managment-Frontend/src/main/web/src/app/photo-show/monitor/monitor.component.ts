import { ImageShow } from './../image-show.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ImageShowStore } from './../image-show.store';
import { Component, OnInit } from '@angular/core';
import { Monitor } from './monitor.model'
import { MonitorService } from './monitor.service'
import { AreaService } from '../area.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

    displayDialog: boolean;

    addDisplayDialog: boolean = false;

    monitor: Monitor = new Monitor();

    selectedMonitor: Monitor;

    newMonitor: boolean;

    monitors: Monitor[];

    cols: any[];

    imageShowes: { label: any; value: any; }[];

    areas;

    imageShowArea: string;

    oldShowUrl: string;

    constructor(
        private monitorService: MonitorService,
        private areaService: AreaService,
        private imageShowStore: ImageShowStore,
        private messageService: MessageService,
        private authService: AuthService,
    ) {

    }

    ngOnInit() {
        this.loadData();
        this.areaService.getAllAreas().then((areas: []) => {
            this.areas = areas.map(a => {
                return { label: a, value: a }
            });
        });
        this.imageShowStore.imageShowsFiltered.subscribe(imageShows => {
            this.imageShowes = imageShows.toArray().map(im => {
                this.imageShowArea = im.area;
                return { label: im.name, value: im._links.self.href }
            });
        });
        this.cols = [
            { field: 'name', header: 'monitor-name' },
            { field: 'location', header: 'monitor-location' },
            { field: 'status', header: 'monitor-status' },
            { field: 'area', header: 'area' },
        ];
    }

    showDialogToAdd() {
        this.newMonitor = true;
        this.monitor = new Monitor();
        this.addDisplayDialog = true;
    }

    save(closeDialog = true) {
        let monitors = [...this.monitors];
        if (this.oldShowUrl != this.monitor.imageShowUrl) {
            this.monitor.imageShow = this.monitor.imageShowUrl;
            this.loginAndStartShow(false);
        } else {
            this.monitor.imageShow = this.monitor.imageShowUrl;
        }
        if (this.newMonitor) {
            this.monitorService.saveMonitor(this.monitor).then(m => {
                this.loadData()
            })
            this.addDisplayDialog = false;
            this.monitors = monitors;
            this.monitor = null;
        } else {
            this.monitorService.updateMonitor(this.monitor.id, this.monitor).then(m => {
                this.loadData()
            })
            if (closeDialog) {
                this.displayDialog = false;
                this.monitors = monitors;
                this.monitor = null;
            }
        }

    }

    loadData() {
        this.monitorService.getAllMonitors().then(monitors => {
            this.monitors = monitors;
            return monitors
        }).then(monitors => {
            monitors.forEach(m => {
                this.monitorService.getMonitorStatus(m).then(
                    status => {
                        m.status = status.screenStatus;
                        m.serverIp = status.serverIp;
                        m.wakeTime = new Date(new Date().toDateString() + ' ' + status.wakeTime);
                        m.sleepTime = new Date(new Date().toDateString() + ' ' + status.sleepTime);
                    }
                ).catch(error => {
                    console.log(error);
                    m.status = null
                })
            })
        });
    }

    delete() {
        this.monitorService.deleteMonitor(this.monitor.id).then(m => { this.loadData() })
        this.monitor = null;
        this.displayDialog = false;
    }

    onAreaChange() {
        this.imageShowStore.filterForArea(this.imageShowArea);
    }

    onRowSelect(event) {
        this.newMonitor = false;
        this.oldShowUrl = null;
        this.monitor = this.cloneMonitor(event.data);
        if (this.monitor.imageShow) {
            this.oldShowUrl = this.monitor.imageShowUrl;
            this.imageShowArea = this.monitor.imageShow.area;
            this.imageShowStore.filterForArea(this.imageShowArea);
        }
        this.monitorService.getMonitorStatus(this.monitor).then(
            s => {
                this.monitor.status = s.screenStatus;
                this.monitor.serverIp = s.serverIp;
            }
        ).catch(error => {
            console.log("Couldn't Reach Monitor");
            if (this.monitor) {
                this.monitor.status = null
            }

        })
        this.displayDialog = true;
    }

    cloneMonitor(c: Monitor): Monitor {
        let monitor = new Monitor();
        for (let prop in c) {
            monitor[prop] = c[prop];
        }
        return monitor;
    }

    monitorOff() {
        this.monitorService.monitorScreen(this.monitor, false).then(
            s => {
                this.monitor.status = s
                this.messageService.add({ severity: 'success', summary: 'Monitor Screen turned Off!', detail: 'Monitor Screen was successfully turned Off!' });
            });
    }

    monitorOn() {
        this.monitorService.monitorScreen(this.monitor, true).then(
            s => {
                this.monitor.status = s
                this.messageService.add({ severity: 'success', summary: 'Monitor Screen turned On!', detail: 'Monitor Screen was successfully turned On!' });
            });
    }

    loginMonitor() {
        this.monitorService.loginForShow(this.monitor);
    }

    loginAndStartShow(save: boolean = true) {
        this.monitorService.loginAndStartShow(this.monitor);
        this.oldShowUrl = this.monitor.imageShowUrl;
        if (save) {
            this.save(false);
        } 
    }

    setServerIP() {
        this.monitorService.setServerIP(this.monitor).then(ip => {
            this.messageService.add({ severity: 'success', summary: 'Monitor ServerIP changed Successfully!', detail: 'The Monitor ServerIP' + ip });
        });
    }

    showCurrentSubstitutionsPlan() {
        this.monitorService.loginAndShowSubstitution(this.monitor).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Monitor Show changed!', detail: 'The Monitor is showing the current Substitution' });
        });
    }

    setSleepTime() {
        this.monitorService.setSleepTime(this.monitor).then(time => {
            this.messageService.add({ severity: 'success', summary: 'Sleep Time set Successfully!', detail: 'The Sleep Time was set to: ' + time });
        });
    }

    setWakeTime() {
        this.monitorService.setWakeTime(this.monitor).then(time => {
            this.messageService.add({ severity: 'success', summary: 'Sleep Wake set Successfully!', detail: 'The Wake Time was set to: ' + time });
        });
    }

    reboot() {
        this.monitorService.reboot(this.monitor).then(time => {
            this.messageService.add({ severity: 'success', summary: 'Raspberry Rebooting!', detail: 'Please wait a bit until Raspberry reconnected!' });
        });;
    }

    hasPrivilege(privileges: string[]): boolean {
        for (let p of privileges) {
            if (!this.authService.hasPrivilege(privileges)) {
                return false;
            }
        }
        return true;
    }
}
