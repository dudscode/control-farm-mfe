import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoComponent } from './producao.component';

describe('ProducaoComponent', () => {
  let component: ProducaoComponent;
  let fixture: ComponentFixture<ProducaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
