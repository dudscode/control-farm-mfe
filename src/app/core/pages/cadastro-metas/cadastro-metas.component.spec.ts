import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMetasComponent } from './cadastro-metas.component';

describe('CadastroMetasComponent', () => {
  let component: CadastroMetasComponent;
  let fixture: ComponentFixture<CadastroMetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMetasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
