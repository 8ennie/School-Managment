import { AuthService } from './../../auth/auth.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Monitor } from "../monitor.model";
import { MonitorService } from "../monitor.service";

@Component({
  selector: "app-monitor-dashboard",
  templateUrl: "./monitor-dashboard.component.html",
  styleUrls: ["./monitor-dashboard.component.scss"],
})
export class MonitorDashboardComponent implements OnInit, OnChanges {
  monitors: Monitor[] = [];

  @Input()
  public area: string;

  constructor(
    private readonly monitorService: MonitorService,
    private readonly authService: AuthService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.area) {
      this.monitorService
        .getActiveMonitorsByArea(this.area)
        .then((monitors: Monitor[]) => {
          this.monitors = monitors;
        });
    }
  }

  ngOnInit(): void {
    if (this.area == null) {
      this.monitorService.getAllActiveMonitors().then(
        (monitors: Monitor[]) => {
          this.monitors = monitors;
        }
      );
    }
  }
}
