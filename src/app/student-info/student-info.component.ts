import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Student} from '../model/student';
import {StudentService} from '../student.service';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {

  student$: Observable<Student>;

  constructor(private studentService: StudentService,
  private route: ActivatedRoute,
  private router: Router) { }

  ngOnInit(): void {

    this.student$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.studentService.getStudent(params.get('id')))
    );
  }

}
