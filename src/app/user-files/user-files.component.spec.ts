import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserFilesComponent } from './user-files.component';

describe('UserFilesComponent', () => {
  let component: UserFilesComponent;
  let fixture: ComponentFixture<UserFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserFilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
