import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  /** The stub of AngureFirestore */
  const AngularFirestoreStub = {
    createId: () => 'createId',
    collection: (name: string) => ({
      valueChanges: () => 'valueChanges',
      snapshotChanges: () => 'snapshotChanges',
      doc: (_id: string) => ({
        valueChanges: () => 'valuChanges',
        set: (_d: any) => 'set',
      }),
    }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule],
      declarations: [AppComponent],
      providers: [
        { provide: AngularFirestore, useValue: AngularFirestoreStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call valueChanges & shapshotChanges', fakeAsync(() => {
      // setup
      const valueChangesSpy = spyOn(
        (component as any).itemsCollection,
        'valueChanges',
      ).and.returnValue(of({ a: 'AAA' }));
      const snapshotChangesSpy = spyOn(
        (component as any).itemsCollection,
        'snapshotChanges',
      ).and.returnValue(of({ b: 'BBB' }));

      // exercise
      component.ngOnInit();
      tick();

      // verify
      expect(valueChangesSpy).toHaveBeenCalled();
      expect(snapshotChangesSpy).toHaveBeenCalled();
    }));

    it('should recieve streems', fakeAsync(() => {
      // setup
      spyOn((component as any).itemsCollection, 'valueChanges').and.returnValue(
        of({ a: 'AAA' }),
      );
      spyOn(
        (component as any).itemsCollection,
        'snapshotChanges',
      ).and.returnValue(of({ b: 'BBB' }));

      // exercise
      component.ngOnInit();
      tick();

      // verify
      component.items.subscribe((a: any) => {
        expect(a).toEqual({ a: 'AAA' });
      });
      component.tiemsSnapshot.subscribe((a: any) => {
        expect(a).toEqual({ b: 'BBB' });
      });
    }));
  });

  it('addItem', () => {
    // setup
    spyOn((component as any).afs, 'createId').and.returnValue('AAA');
    component.name.setValue('BBB');
    component.age.setValue(111);

    const setSpy = jasmine.createSpy('setSpy');
    const docSpy = spyOn(
      (component as any).itemsCollection,
      'doc',
    ).and.callFake(() => ({
      set: setSpy,
    }));

    // exercise
    component.addItem();

    // verify
    expect(docSpy).toHaveBeenCalledWith('AAA');
    expect(setSpy).toHaveBeenCalledWith({
      id: 'AAA',
      name: 'BBB',
      age: 111,
    });
    expect(component.name.value).toBe('');
    expect(component.age.value).toBe('');
  });

  it('editItem', () => {
    // setup
    const item = {
      id: 'AAA',
      name: 'BBB',
      age: 111,
    };

    // exercise
    component.editItem(item);

    // verify
    expect(component.updatedName.value).toBe('BBB');
    expect(component.updatedAge.value).toBe(111);
    expect(component.updatedId).toBe('AAA');
    expect(component.isDisabledDelete).toBeTruthy();
    expect(component.isDisabledEdit).toBeFalsy();
  });

  it('updateItem', () => {
    // setup
    component.updatedId = 'AAA';
    component.updatedName.setValue('BBB');
    component.updatedAge.setValue(111);

    const updateSpy = jasmine.createSpy('updateSpy');
    const docSpy = spyOn(
      (component as any).itemsCollection,
      'doc',
    ).and.callFake(() => ({
      update: updateSpy,
    }));

    // exercise
    component.updateItem();

    // verify
    expect(docSpy).toHaveBeenCalledWith('AAA');
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'AAA',
      name: 'BBB',
      age: 111,
    });
    expect(component.updatedId).toBeNull();
    expect(component.isDisabledDelete).toBeFalsy();
    expect(component.isDisabledEdit).toBeTruthy();
  });

  it('deleteItem', () => {
    // setup
    const item = {
      id: 'AAA',
      name: 'BBB',
      age: 111,
    };

    const deleteSpy = jasmine.createSpy('deleteSpy');
    const docSpy = spyOn(
      (component as any).itemsCollection,
      'doc',
    ).and.callFake(() => ({
      delete: deleteSpy,
    }));

    // exercise
    component.deleteItem(item);

    // verify
    expect(docSpy).toHaveBeenCalledWith('AAA');
    expect(deleteSpy).toHaveBeenCalled();
  });
});
