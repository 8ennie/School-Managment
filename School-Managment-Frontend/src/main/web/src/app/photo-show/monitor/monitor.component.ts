import { Component, OnInit } from '@angular/core';
import { Monitor } from './monitor.model'
import { MonitorService } from './monitor.service'
import { AdvertismentService } from '../advertisment/advertisment.service';

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

    showTypes;

    constructor(
        private monitorService: MonitorService,
        private advertismentService: AdvertismentService
    ) {
        this.showTypes = [
            { label: 'Advertisment', value: 'ADVERTISEMENT' },
            { label: 'Substitution', value: 'SUBSTITUTION' },
        ];
    }

    ngOnInit() {
        this.loadData()
        this.advertismentService.getAdvertisments().then(showes => {
            this.imageShowes = showes.map(s => {
                return { label: s.name, value: s._links.self.href }
            });    
        });
        this.cols = [
            { field: 'name', header: 'monitor-name' },
            { field: 'showType', header: 'image-show-type' },
            { field: 'location', header: 'monitor-location' },
            { field: 'status', header: 'monitor-status' }
        ];
    }

    showDialogToAdd() {
        this.newMonitor = true;
        this.monitor = new Monitor();
        this.addDisplayDialog = true;
    }

    save() {
        let monitors = [...this.monitors];
        this.monitor.imageShow = this.monitor.imageShowUrl
        if (this.newMonitor) {
            this.monitorService.saveMonitor(this.monitor).then(m => {
                this.loadData()
            })
        } else {
            this.monitorService.updateMonitor(this.monitor.id, this.monitor).then(m => {
                this.loadData()
            })
        }
        this.monitors = monitors;
        this.monitor = null;
        this.addDisplayDialog = false;
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

    onRowSelect(event) {
        this.newMonitor = false;
        this.monitor = this.cloneMonitor(event.data);
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
            s => this.monitor.status = s
        );
    }

    monitorOn() {
        this.monitorService.monitorScreen(this.monitor, true).then(
            s => this.monitor.status = s
        );
    }

    loginMonitor() {
        this.monitorService.loginForShow(this.monitor);
    }
    
    loginAndStartShow(){
        this.monitorService.loginAndStartShow(this.monitor)
    }

    setServerIP(){
        this.monitorService.setServerIP(this.monitor);
    }

    showCurrentSubstitutionsPlan(){
        this.monitorService.loginAndShowSubstitution(this.monitor);
    }

}
