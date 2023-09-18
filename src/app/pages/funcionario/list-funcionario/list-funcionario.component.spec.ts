import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFuncionarioComponent } from './list-funcionario.component';

describe('ListFuncionarioComponent', () => {
  let component: ListFuncionarioComponent;
  let fixture: ComponentFixture<ListFuncionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFuncionarioComponent]
    });
    fixture = TestBed.createComponent(ListFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
