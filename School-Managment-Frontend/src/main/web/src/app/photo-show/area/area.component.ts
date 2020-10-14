import { AuthService } from 'src/app/auth/auth.service';
import { ImageShow } from './../image-show.model';
import { ImageShowStore } from './../image-show.store';
import { List } from 'immutable';
import { MonitorService } from './../monitor/monitor.service';
import { Monitor } from './../monitor/monitor.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  area: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly monitorService: MonitorService,
    private readonly imageShowStore: ImageShowStore,
    private readonly router: Router,
    private readonly authService:AuthService,
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((parms: Params) => {
      this.area = parms['area'];
      this.loadData();
    });
    this.imageShowStore.imageShowsFiltered.subscribe(imageShows => {
      this.imageShows = imageShows.toArray();
      this.monitorImageShowes = imageShows.toArray().map(im => {
        return { label: im.name, value: im._links.self.href }
      });
    });
  }

  loadData() {
    this.imageShowStore.filterForArea(this.area);
    this.monitorService.getMonitorsByArea(this.area).then(
      (res: { _embedded }) => {
        return List(res._embedded.monitors);
      },
      err => console.log("Error retrieving Documents")
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
            m.status = null
          })
        })
      }
    });
  }

  //For Monitors
  monitors: Monitor[];
  selectedMonitor: Monitor;
  monitor: Monitor = new Monitor();
  displayDialog: boolean = false;
  monitorImageShowes: { label: any; value: any; }[];
  displayAllMonitorDialog = false;

  onMonitorRowSelect(event) {
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

  loginAndStartShow() {
    this.monitorService.loginAndStartShow(this.monitor);
    this.saveMonitor();
  }

  saveMonitor() {
    this.monitor.imageShow = this.monitor.imageShowUrl;
    this.monitorService.updateMonitor(this.monitor.id, this.monitor).then(m => {
      this.loadData()
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

  //For ImageShow
  imageShows: ImageShow[] = [];
  uploadImageShow = false;
  onImageShowSelect(event) {
    this.router.navigate(['photoshow', 'edit', event.data.id])
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
