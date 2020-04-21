import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Excercise } from '../excercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  excercises: Excercise[];
  excerciseSubscription: Subscription;

  constructor(private readonly trainingService: TrainingService) {}

  ngOnDestroy(): void {
    this.excerciseSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.excerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (excersises) => (this.excercises = excersises)
    );

    this.trainingService.fetchAvailableExcercises();
  }

  onStartTraining(form: NgForm) {
    console.log(form.value.excercise);
    this.trainingService.startExcercise(form.value.excercise);
  }
}
