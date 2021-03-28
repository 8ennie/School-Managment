import { ImageShowService } from './../../image-show/image-show.service';
import { MessageService } from 'primeng/api';

import { MonitorService } from './../monitor.service';
import { Component, OnInit } from '@angular/core';
import { Monitor } from '../monitor.model';
import { AreaService } from 'src/app/area/area.service';
import { ImageShow } from 'src/app/image-show/image-show.model';

@Component({
  selector: 'app-monitor-list',
  templateUrl: './monitor-list.component.html',
  styleUrls: ['./monitor-list.component.scss']
})
export class MonitorListComponent implements OnInit {

  cols: any[] = [
    { field: 'name', header: 'monitor.list.name' },
    { field: 'location', header: 'monitor.list.location' },
    { field: 'status', header: 'monitor.list.status' },
    { field: 'area', header: 'monitor.list.area' },
  ];


  monitors: Monitor[];

  selectedMonitor: Monitor;

  monitorDialog: boolean = false;

  monitor: Monitor;

  submitted: boolean;

  areas: { label: any; value: any; }[];

  imageShows: { label: any; value: any; }[];

  oldImageShowUrl: string;


  constructor(
    private readonly monitorService: MonitorService,
    private readonly areaService: AreaService,
    private readonly messageService: MessageService,
    private readonly imageShowServie: ImageShowService,
  ) { }

  ngOnInit(): void {
    this.loadDate();
  }

  private loadDate(): void {
    console.log("Load Data");

    this.areaService.getAllAreas().then((areas: []) => {
      this.areas = areas.map(a => {
        return { label: a, value: a };
      });
    });

    this.monitorService.getAllMonitors()
      .then((monitors: Monitor[]) => {
        this.monitors = monitors;
        console.log(monitors);
        
        return monitors;
      })
      .then((monitors: Monitor[]) => {
        monitors.forEach((m: Monitor) => {
          if (m.active) {
            this.pingMonitor(m);
          }
        });
      });
  }

  private pingMonitor(monitor: Monitor): void {
    this.monitorService.getMonitorStatus(monitor).then(
      status => {
        monitor.status = status.screenStatus;
        monitor.serverIp = status.serverIp;
        monitor.wakeTime = new Date(new Date().toDateString() + ' ' + status.wakeTime);
        monitor.sleepTime = new Date(new Date().toDateString() + ' ' + status.sleepTime);
        monitor.onStartResumeLastShow = status.onStartResumeLastShow;
        monitor.startUrl = status.startUrl;
      }
    ).catch(error => {
      monitor.status = null;
    });
  }


  private cloneMonitor(c: Monitor): Monitor {
    const monitor = new Monitor();
    for (const prop in c) {
      monitor[prop] = c[prop];
    }
    return monitor;
  }

  public editMonitor(monitor: Monitor): void {
    console.log(monitor);
    
    if (monitor.active) {
      this.pingMonitor(monitor);
    }
    this.monitor = this.cloneMonitor(monitor);
    if (this.monitor.imageShow) {
      this.oldImageShowUrl = monitor.imageShowUrl;
      if (this.monitor.imageShow?.area) {
        this.onAreaChange(this.monitor.imageShow.area);
      }
    }
    this.monitorDialog = true;
  }

  public newMonitor(): void {
    this.monitor = new Monitor();
    this.monitorDialog = true;
  }

  public rebootMonitor(): void {
    this.monitorService.reboot(this.monitor).then(time => {
      this.messageService.add({ severity: 'success', summary: 'Raspberry Rebooting!', detail: 'Please wait a bit until Raspberry is reconnected!' });
    });
  }

  public hideDialog(): void {
    this.monitorDialog = false;
    this.imageShows = null;
    this.oldImageShowUrl = null;
  }

  public saveMonitor(): void {
    const monitors = [...this.monitors];

    if (!this.monitor.resourceUrl) {
      this.monitorService.saveMonitor(this.monitor).then((m: Monitor) => {
        if (m.active) {
          this.pingMonitor(m);
        }
        this.monitorDialog = false;
        monitors.push(m);
        this.monitors = monitors;
      });
    } else {
      this.monitorService.updateMonitor(this.monitor).then((m: Monitor) => {
        if (m.active) {
          this.pingMonitor(m);
          console.log(m);
          
          if (m.imageShowUrl != this.oldImageShowUrl) {
            this.loginAndStartShow();
          }
        }
        monitors[monitors.findIndex(m => m.resourceUrl == this.monitor.resourceUrl)] = (m as Monitor);
        this.monitors = monitors;
        this.monitorDialog = false;
      });
      // if (closeDialog) {
      //   this.displayDialog = false;
      //   this.monitors = monitors;
      //   this.monitor = null;
      // }
    }
    // if (this.oldShowUrl !== this.monitor.imageShowUrl) {
    //   this.monitor.imageShow = this.monitor.imageShowUrl;
    //   this.loginAndStartShow(false);
    // } else {
    //   this.monitor.imageShow = this.monitor.imageShowUrl;
    // }
  }

  public deleteMonitor(): void {
    const monitors = [...this.monitors];
    this.monitorService.deleteMonitor(this.monitor).then(() => {
      this.monitorDialog = false;
      this.monitors = monitors.filter(m => m.resourceUrl != this.monitor.resourceUrl);
    });
  }

  public onAreaChange(area: string): void {
    this.imageShowServie.getImageShowByArea(area).then(
      (imageShow: ImageShow[]) => {
        this.imageShows = imageShow.map((imageShow: ImageShow) => { return { label: imageShow.name, value: imageShow.resourceUrl } });
      }
    );
  }

  public loginAndStartShow(save: boolean = true): void {
    this.monitorService.loginAndStartShow(this.monitor);
  }

}
