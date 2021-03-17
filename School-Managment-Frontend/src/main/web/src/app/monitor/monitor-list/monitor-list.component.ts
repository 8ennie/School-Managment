import { MonitorService } from './../../photo-show/monitor/monitor.service';
import { Component, OnInit } from '@angular/core';
import { Monitor } from '../monitor.model';

@Component({
  selector: 'app-monitor-list',
  templateUrl: './monitor-list.component.html',
  styleUrls: ['./monitor-list.component.scss']
})
export class MonitorListComponent implements OnInit {

  cols: any[] = [
    { field: 'name', header: 'monitor-name' },
    { field: 'location', header: 'monitor-location' },
    { field: 'status', header: 'monitor-status' },
    { field: 'area', header: 'area' },
  ];


  monitors: Monitor[];

  selectedMonitor: Monitor;

  monitorDialog: boolean;

  monitor: Monitor;

  submitted: boolean;

  constructor(
    private readonly monitorService: MonitorService,
  ) { }

  ngOnInit(): void {
    this.loadDate();
  }

  loadDate() {
    this.monitorService.getAllMonitors().then(monitors => {
      this.monitors = monitors;
      return monitors;
    }).then(monitors => {
      monitors.forEach(m => {
        this.monitorService.getMonitorStatus(m).then(
          status => {
            m.status = status.screenStatus;
            m.serverIp = status.serverIp;
            m.wakeTime = new Date(new Date().toDateString() + ' ' + status.wakeTime);
            m.sleepTime = new Date(new Date().toDateString() + ' ' + status.sleepTime);
            m.onStartResumeLastShow = status.onStartResumeLastShow;
            m.startUrl = status.startUrl;
          }
        ).catch(error => {
          console.log(error);
          m.status = null;
        });
      });
    });
  }




  onRowSelect(event): void {
    console.log(event);
    
  }

  showDialogToAdd() {

  }

}
