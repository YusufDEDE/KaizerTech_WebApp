import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../utils/services/category.service';
import { Category } from '../../utils/services/model/category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers:[CategoryService]
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[];
  
  categoryID:any;

  required = false;
  required2 = false;
  required3 = false;

  loading = false;
  update = false;
  add = true;
  
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
  ) { }

  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
  }
 
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }
  
  ngOnInit() {
    this.getCategories();
    this.categoryForm = this.formBuilder.group({
      categoryName:['', Validators.required],
      categoryDesc: ['', Validators.required],
      categoryPic: ['', Validators.required]
     });    
  }

  get f() { return this.categoryForm.controls; } 

  onSubmit() {
    
    if (this.f.categoryName.value == '' || this.f.categoryDesc.value == '' || this.fileData == null ){
      this.required = false;
      this.required2 = false;
      this.required3 = false;
      if (this.f.categoryName.value == '') {
        this.required = true;
      }
      if (this.f.categoryDesc.value == '') {
        this.required2 = true;
      }
      if (this.fileData == null){
        this.required3 = true;
      }
    }
    else {
      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('category_name', this.f.categoryName.value);
      bodyFormData.set('cat_description', this.f.categoryDesc.value);
      bodyFormData.append('cat_picture', this.fileData);

    this.categoryService.addCategories(bodyFormData)
      .subscribe(response => {
        console.log("add Category", response);
      });
    
    }
    
  }

  canUpdateBtn(id, categoryName, categoryDesc, categoryPic) {
    console.log("id : ", id);
    if (!this.update){
      this.categoryID = id;
      this.f.categoryName.setValue(categoryName);
      this.f.categoryDesc.setValue(categoryDesc);
      this.f.categoryPic.setValue(categoryPic.files)
      this.update = true;
      this.add = false;
    }else {
      this.update = false;
      this.add = true;

      this.f.categoryName.setValue('')
      this.f.categoryDesc.setValue('')
    }
    
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(data => {
      console.log(data)
      this.categories = data;
      this.categories.reverse()
    })
 }

  onUpdateCategory(id){
    if (this.f.categoryName.value == '' || this.f.categoryDesc.value == '' || this.fileData == null ){
      this.required = false;
      this.required2 = false;
      this.required3 = false;
      if (this.f.categoryName.value == '') {
        this.required = true;
      }
      if (this.f.categoryDesc.value == '') {
        this.required2 = true;
      }
      if (this.fileData == null){
        this.required3 = true;
      }
    }
    else {  
      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('category_name', this.f.categoryName.value);
      bodyFormData.set('cat_description', this.f.categoryDesc.value);
      bodyFormData.append('cat_picture', this.fileData);

      console.log(bodyFormData.get('cat_picture'));

      this.categoryService.updateCategory(id, bodyFormData).subscribe(data => {
        console.log('update data', data);
      })
    }
  }

  onDeleteCategory(id){
    this.categoryService.deleteCategory(id).subscribe(data => {
      console.log('component data', data);
    })
  }

  
  
}
