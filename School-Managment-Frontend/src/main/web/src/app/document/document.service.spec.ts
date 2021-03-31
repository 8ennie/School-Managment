import { DocumentService } from './document.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Document } from './document.model';
describe('DocumentService', () => {

    let httpMock: HttpTestingController;
    let service: DocumentService;

    let testDokuments1: Document[];
    let testDocumentsHateoas1: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [

            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(DocumentService);

        testDokuments1 = ((): Document[] => {
            let document1 = new Document();
            document1.filename = "Test1.pdf";
            document1.resourceUrl = "testUrl/1";
            return [document1];
        })();

        testDocumentsHateoas1 = {
            _embedded: {
                documents: testDokuments1
            }
        }
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });


});