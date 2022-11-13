import { TestBed } from '@angular/core/testing';

import { PhotoviewerService } from './photoviewer.service';

describe('PhotoviewerService', () => {
  let service: PhotoviewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoviewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
