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
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let afs: AngularFirestore;

  const AngularFirestoreStub = {
    createId: () => 'createId',
    collection: (name: string) => ({
      valueChanges: () => 'valueChanges',
      snapshotChanges: () => 'snapshotChanges',
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
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
    afs = TestBed.get(AngularFirestore);
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
    component.age.setValue('CCC');
    const docSpy = spyOn((component as any).itemsCollection, 'doc');

    // exercise
    component.addItem();

    // verify
    expect(docSpy).toHaveBeenCalledWith('AAA');
    expect(component.name.value).toBe('');
    expect(component.age.value).toBe('');
  });
});
