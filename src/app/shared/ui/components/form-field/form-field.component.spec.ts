import { Injector, runInInjectionContext, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

import { FormFieldComponent } from './form-field.component';

describe('FormField', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent, MatError, MatFormField, MatInput, MatLabel],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);

    runInInjectionContext(TestBed.inject(Injector), () => {
      const testFormSignal = signal({ testField: '' });
      const testForm = form(testFormSignal, () => ({}));

      fixture.componentRef.setInput('control', {
        label: 'Test Field',
        field: testForm.testField,
        type: 'text',
      });
    });

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
