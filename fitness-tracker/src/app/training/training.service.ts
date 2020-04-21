import { UIService } from '../shared/ui.service';
import { Subject } from 'rxjs/Subject';
import { Excercise } from './excercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class TrainingService {
  private availableExcercises: Excercise[];
  exercisesChanged = new Subject<Excercise[]>();
  private runningExcercise: Excercise;
  excerciseChanged = new Subject<Excercise>();
  finishedExcercisesChanged = new Subject<Excercise[]>();
  private fbSubs: Subscription[] = [];

  constructor(
    private readonly db: AngularFirestore,
    private readonly uiService: UIService
  ) {}

  fetchAvailableExcercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.db
        .collection('availableExcercises')
        .snapshotChanges()
        .map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Excercise),
            };
          });
        })
        .subscribe(
          (excercises: Excercise[]) => {
            this.uiService.loadingStateChanged.next(false);
            this.availableExcercises = excercises;
            this.exercisesChanged.next([...this.availableExcercises]);
          },
          (error) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Unable to fetch excercises...please try again later',
              null,
              3000
            );
          }
        )
    );
  }

  startExcercise(selectedId: string) {
    let selectedExcercise = this.availableExcercises.find(
      (ex) => ex.id === selectedId
    );
    console.log(selectedExcercise);
    this.runningExcercise = selectedExcercise;
    this.excerciseChanged.next({ ...this.runningExcercise });
  }

  fetchCompletedOrCanceledExcercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExcercises')
        .valueChanges()
        .subscribe(
          (excercices: Excercise[]) => {
            this.finishedExcercisesChanged.next(excercices);
          },
          (error) => {
            this.uiService.showSnackbar(
              'Unable to fetch excercises...please try again later',
              null,
              3000
            );
          }
        )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((s) => {
      s.unsubscribe();
    });
  }

  getRunningExcercise() {
    return { ...this.runningExcercise };
  }

  private addDataToDatabase(excercise: Excercise) {
    this.db.collection('finishedExcercises').add(excercise);
  }

  completeExcercise() {
    this.addDataToDatabase({
      ...this.runningExcercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExcercise = null;
    this.excerciseChanged.next(null);
  }

  cancelExcercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExcercise,
      duration: this.runningExcercise.duration * (progress / 100),
      calories: this.runningExcercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExcercise = null;
    this.excerciseChanged.next(null);
  }
}
