import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestError } from './test-error.component';

describe('TestError', () => {
  let component: TestError;
  let fixture: ComponentFixture<TestError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
