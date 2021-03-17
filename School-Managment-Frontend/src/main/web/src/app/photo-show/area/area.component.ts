import { AuthService } from 'src/app/auth/auth.service';
import { ImageShow } from './../image-show.model';
import { ImageShowStore } from './../image-show.store';
import { List } from 'immutable';
import { MonitorService } from './../monitor/monitor.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Monitor } from 'src/app/monitor/monitor.model';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly monitorService: MonitorService,
    private readonly imageShowStore: ImageShowStore,
    private readonly router: Router,
    public readonly authService: AuthService,
  ) {

  }

  area: string;

  // For Monitors
  monitors: Monitor[];
  selectedMonitor: Monitor;
  monitor: Monitor = new Monitor();
  displayDialog = false;
  monitorImageShowes: { label: any; value: any; }[];
  displayAllMonitorDialog = false;

  // For ImageShow
  imageShows: ImageShow[] = [];
  uploadImageShow = false;

  ngOnInit(): void {
    this.route.params.subscribe((parms: Params) => {
      this.area = parms['area'];
      this.loadData();
    });
    this.imageShowStore.imageShowsFiltered.subscribe(imageShows => {
      this.imageShows = imageShows.toArray();
      this.monitorImageShowes = imageShows.toArray().map(im => {
        return { label: im.name, value: im._links.self.href };
      });
    });
  }

  loadData() {
    this.imageShowStore.filterForArea(this.area);
    this.monitorService.getMonitorsByArea(this.area).then(
      (res: { _embedded }) => {
        return List(res._embedded.monitors);
      },
      err => console.log('Error retrieving Monitors!')
    ).then((monitors: List<Monitor>) => {
      if (monitors) {
        this.monitors = monitors.toArray();
        this.monitors.forEach(m => {
          this.monitorService.getMonitorStatus(m).then(
            status => {
              m.status = status.screenStatus;
              m.serverIp = status.serverIp;
              m.wakeTime = new Date(new Date().toDateString() + ' ' + status.wakeTime);
              m.sleepTime = new Date(new Date().toDateString() + ' ' + status.sleepTime);
            }
          ).catch(error => {
            console.log(error);
            m.status = null;
          });
        });
      }
    });
  }

  onMonitorRowSelect(event) {
    this.monitor = this.cloneMonitor(event.data);
    this.monitorService.getMonitorStatus(this.monitor).then(
      s => {
        this.monitor.status = s.screenStatus;
        this.monitor.serverIp = s.serverIp;
      }
    ).catch(error => {
      console.log('Couldn\'t Reach Monitor');
      if (this.monitor) {
        this.monitor.status = null;
      }
    });
    this.displayDialog = true;
  }

  cloneMonitor(c: Monitor): Monitor {
    const monitor = new Monitor();
    for (const prop in c) {
      monitor[prop] = c[prop];
    }
    return monitor;
  }

  loginAndStartShow() {
    this.monitorService.loginAndStartShow(this.monitor);
    this.saveMonitor();
  }

  saveMonitor() {
    this.monitor.imageShow = this.monitor.imageShowUrl;
    this.monitorService.updateMonitor(this.monitor.id, this.monitor).then(m => {
      this.loadData();
    });
  }

  loginAndStartShowOnAllMonitors(imageShowUrl) {
    this.monitors.forEach(m => {
      this.monitor = this.cloneMonitor(m);
      this.monitor.imageShowUrl = imageShowUrl;
      this.loginAndStartShow();
    });
    this.displayAllMonitorDialog = false;
  }
  onImageShowSelect(event) {
    this.router.navigate(['photoshow', 'edit', event.data.id]);
  }
}
