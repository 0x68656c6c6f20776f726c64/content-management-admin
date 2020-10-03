import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from 'src/services/image.service';
import { environment } from 'src/environments/environment';
import { ImageViewService } from 'src/components/modals/image-view/image-view.component';
import { ImageUploadMessage } from 'src/models/helpers/ImageUploadMessage';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  @Input() message:ImageUploadMessage;
  @Output() newImage = new EventEmitter<File>();

  imageURL = environment.API_URL+'/pictures/';

  selectedFile = {
    src:''
  };

  constructor(private imageViewService:ImageViewService,private image:ImageService) { }

  ngOnInit(): void {
    if(this.message.id)
    {
      this.selectedFile.src = this.imageURL+this.message.id;
    }
    else
    {
      this.selectedFile.src = this.imageURL+'default';
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile.src = event.target.result;
      this.newImage.emit(file);

    });
    reader.readAsDataURL(file);
  }

  imageView()
  {
    this.imageViewService.create({title:"Image: "+this.message.id,content:this.selectedFile.src}).then(
      ()=>{},
      ()=>{}
    )
  }

}
