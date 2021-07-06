
import { Observable, Subscription, Subject } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
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
export class MonitorDashboardComponent implements OnInit, OnChanges, OnDestroy {
  monitors: Monitor[] = [];

  @Input()
  public area: string;
  public updateMonitor: Subject<void> = new Subject<void>();

  @Input()
  public editMonitorImageShow: boolean = false;
  constructor(
    private readonly monitorService: MonitorService,
  ) { }

  private eventsSubscription: Subscription;

  @Input()
  public updateMonitors: Observable<void>;

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

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
    if (this.updateMonitors) {
      this.eventsSubscription = this.updateMonitors.subscribe(() => {
        this.updateMonitor.next();
      });
    }

    if (this.area == null) {
      this.monitorService.getAllActiveMonitors().then(
        (monitors: Monitor[]) => {
          this.monitors = monitors;
        }
      );
    }
  }

  public onImageShowUpdate(): void {
    this.updateMonitor.next();
  }
}
