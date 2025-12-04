import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFilter } from './shop-filter.component';

describe('ShopFilter', () => {
  let component: ShopFilter;
  let fixture: ComponentFixture<ShopFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
