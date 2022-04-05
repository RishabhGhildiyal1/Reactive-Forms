import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin,Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient , private fb:FormBuilder) { }

  form : FormGroup = new FormGroup({});
  
  ngOnInit(): void {
    this.getalldata()
    this.makeform()
    this.forkjoin()
  }
  makeform(){
    this.form = this.fb.group({
      first_name: ["",[Validators.required]],
      last_name: ["",[Validators.required]],
      email: ["",[Validators.required , Validators.pattern("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/./")]],
    })
    console.log("this.form" , this.form);
    
  }
  submit(){
    if(this.form.value.first_name && this.form.value.last_name && this.form.value.email){
      console.log('myvalue' , this.form.value);
      let url = "https://reqres.in/api/users"
      this.http.post(url,this.form.value).subscribe(res=>{
        console.log(res);
        this.alldata1.unshift(this.form.value)
      },error =>{
      });
    }else{
      alert("fill all the fields first")
    }
  }

  toggleUpdate= false;
  toggleSubmit=true;
  delete(data:any){
    if(confirm('Are you sure you want to delete')){
      let url = `https://reqres.in/api/users/${data.id}`
    this.http.delete(url).subscribe(res =>{
      const index = this.alldata1.indexOf(data);
      this.alldata1.splice(index,1);
    },error =>{
    });
    } 
    
  }
  newId:any;
  ind:any
  updateR(data:any , index:any){
    if(confirm('Are you sure you want to update?')){
    this.ind=index;
    this.form.controls["first_name"].setValue(data.first_name);
    this.form.controls["last_name"].setValue(data.last_name);
    this.form.controls["email"].setValue(data.email);
    this.newId=data.id;
    console.log(this.newId);
    this.toggleSubmit = !this.toggleSubmit;
    this.toggleUpdate = !this.toggleUpdate; 
    }  

}
  update(){
    for(let i=0; i<this.alldata1.length; i++){
      if(this.newId ==this.alldata1[i].id){
        this.alldata1[i].first_name = this.form.value.first_name
        this.alldata1[i].last_name = this.form.value.last_name 
        this.alldata1[i].email = this.form.value.email       
      }
    }
  }
  alldata : any;
  alldata1:any;
  getalldata(){ 
    let url = "https://reqres.in/api/users"
    this.http.get(url).subscribe(res=>{
      this.alldata = res;
      this.alldata1 = this.alldata.data;
      console.log(res);
    },error =>{
    });
  }

  forkjoin1:any;
  forkjoin(){
   this.fork().subscribe(res => {
      // console.log(res);
      const fork = res[0].data.concat(res[1].data);
      console.log(fork);
      this.forkjoin1=this.forkjoin;
    },error => {
    });
  }
  fork():Observable<any>{
    let url = 'https://reqres.in/api/users?page=1'
    let url1 = 'https://reqres.in/api/users?page=2'
    let request1=this.http.get(url)
    let request2=this.http.get(url1)
    return forkJoin([request1,request2]);
  }
}