import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StudentService} from '../student.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Elective} from '../model/Elective';
import {Mark} from '../model/Mark';
import {Subject} from '../model/Subject';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  electives: Elective[];
  marks: Mark[];
  subjects: Subject[];
  myForm: FormGroup;
  selectedElective: Elective;
  selectedElectives: Elective[];
  isSelectElective: boolean = false;


  constructor(public dialogRef: MatDialogRef<EditStudentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public studentService: StudentService, private formBuilder: FormBuilder) {
    let stMarkSubj = [];

    for (let i = 0; i < this.data.st.studentMarkSubjects.length; i++) {
      stMarkSubj.push(this.formBuilder.group({
        mark: new FormControl(this.data.st.studentMarkSubjects[i].mark),
        subject: new FormControl(this.data.st.studentMarkSubjects[i].subject)
      }));
    }

    this.myForm = this.formBuilder.group({
      name: [this.data.st.name, Validators.required],
      email: [this.data.st.email, [Validators.required, Validators.email]],
      phone: [this.data.st.phone],
      st_electives: this.formBuilder.array, //this.formBuilder.array(this.data.st.electives.map(el => new FormControl(el))),
      st_mark_subj: this.formBuilder.array(stMarkSubj)
    });
  }

  addRow() {
    const st_mark_subj = this.myForm.get('st_mark_subj') as FormArray;
    st_mark_subj.push(this.createItem());
  }

  removeRow(index) {
    const st_mark_subj = this.myForm.get('st_mark_subj') as FormArray;
    st_mark_subj.removeAt(index);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      mark: [],
      subject: []
    });
  }

  onNgModelChange($event: any) {

    this.selectedElective = $event;
    console.log("CHANGE " + this.selectedElective);
    console.log("CHANGEs " + this.selectedElectives);
    if (!$event.option.value.isChecked) {
      this.isSelectElective = true;
      console.log(this.isSelectElective);
    }

  }


  checkElectives(elect: string): boolean {
    return this.data.st.electives.some((e) => e.name === elect);
  }

  compareFn(a, b) {
    return a && b && a.id == b.id;
  }


  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {

    this.data.st.name = this.myForm.value.name;
    this.data.st.phone = this.myForm.value.phone;
    this.data.st.email = this.myForm.value.email;
    this.data.st.studentMarkSubjects = this.myForm.value.st_mark_subj;

    if(this.isSelectElective === true){
      this.data.st.electives = this.selectedElectives;
    }

    this.studentService.updateStudent(this.data.st, this.data.st.id).subscribe();
    this.dialogRef.close({event: "update", student: this.data.st});
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
}
