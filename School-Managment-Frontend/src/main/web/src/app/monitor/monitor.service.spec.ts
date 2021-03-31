import { environment } from './../../environments/environment.prod';
import { AuthService } from './../auth/auth.service';
import { MonitorService } from './monitor.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Monitor } from './monitor.model';
describe('MonitorService', () => {

    let httpMock: HttpTestingController;
    let service: MonitorService;

    let monitors: Monitor[];

    let authService: Partial<AuthService> = {
        signUpMonitor(monitorId: number): Promise<any> {
            return null;
        },
    };



    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                { provide: AuthService, useValue: authService },
            ]
        })

        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(MonitorService);


        monitors = ((): Monitor[] => {
            let monitor1: Monitor = new Monitor();
            monitor1.name = "Test 1";
            monitor1.imageShowUrl = `${environment.apiUrl}/imagesShows/1`;
            monitor1.ipAddress = "192.168.178.112:5001";
            monitor1.location = "Test Location 1";
            
            return [monitor1];
        })();
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


});
