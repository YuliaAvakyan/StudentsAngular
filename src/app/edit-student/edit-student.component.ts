import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StudentService} from '../student.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Elective} from '../model/Elective';
import {Mark} from '../model/Mark';
import {Subject} from '../model/Subject';
import {StudentMarkSubject} from '../model/StudentMarkSubject';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  // myForm : FormGroup = new FormGroup({
  //
  //   "userName": new FormControl("", Validators.required),
  //   "userEmail": new FormControl("", [
  //     Validators.required,
  //     Validators.email
  //   ]),
  //   "userPhone": new FormControl("", Validators.pattern("[0-9]{10}"))
  // });

  electives: Elective[];
  marks: Mark[];
  subjects: Subject[];
  selectedElectives = [];
  selectedMarkSubj = [];

  constructor(public dialogRef: MatDialogRef<EditStudentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public studentService: StudentService, private formBuilder: FormBuilder) {
  }

  myForm = this.formBuilder.group({
    name: [this.data.st.name, Validators.required],
    email: [this.data.st.email, [ Validators.required, Validators.email]],
    phone: [this.data.st.phone],
    st_electives: [],
    st_subj: [],
    st_marks: []
  });

  // formControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email
  // ]);



  // getErrorMessage() {
  //   return this.formControl.hasError('required') ? 'Required field' :
  //     this.formControl.hasError('email') ? 'Not a valid email' :
  //       '';
  // }

  // submit() {
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    //Set data to dialogData for update table
    // this.studentService.dialogData = this.data.st;
    // if(this.selectedElectives.length != 0){
    //   this.data.st.electives = this.selectedElectives;
    // }
    this.data.st.name = this.myForm.value.name;
    this.data.st.electives = this.myForm.value.st_electives;
    console.log(this.myForm.value);

    for (let n of this.data.st.electives){
      console.log("ELECTIVE " + n.name);
    }
    //
    // for (let n of this.selectedMarkSubj){
    //   console.log("MS " + n.mark.mark + " " + n.subject.name);
    // }
    // this.studentService.updateStudent(this.data.st, this.data.st.id).subscribe();
    // this.resetForm();
  }

  ngOnInit(): void {
    console.log(this.data.st.name);

    this.studentService.getElectives().subscribe((data) => {
      this.electives = data;

    });
    this.studentService.getMarks().subscribe((data) => {
      this.marks = data;
    });
    this.studentService.getSubjects().subscribe((data) => {
      this.subjects = data;
    });

  }

  checkElectives(elect: string): boolean {
    return this.data.st.electives.some((e) => e.name === elect);
  }

  // onNgModelChange($event){
  //   // console.log($event);
  //   this.selectedElective=$event;
  // }
  resetForm() {
    this.myForm.reset();
  }
}
