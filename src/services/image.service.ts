import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { ImageUploadMessage } from 'src/models/helpers/ImageUploadMessage';
import { ModifiedImage } from 'src/models/helpers/modifiedImage';
import { fileReturn, httpReturn } from 'src/models/httpReturn';
import { file } from 'src/models/schemas/file';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private imageURL = environment.API_URL+'/pictures/';

  constructor(private http:HttpClient) { }

  uploadSlideImage(image:ImageUploadMessage):Observable<fileReturn>{
    const data = new FormData();
    data.append('image',image.content);
    if(image.status=='initial')
    {
      return this.http.post<fileReturn>(this.imageURL+'upload?fileId='+image.id+'&status=create',data);
    }
    else
    {
      return this.http.post<fileReturn>(this.imageURL+'upload?fileId='+image.id+'&status=upload',data);
    }
  }

  removeThisImage(imageId:string):Observable<httpReturn>{
     return this.http.delete<httpReturn>(this.imageURL+imageId);
  }

  setImageUrlWithId(id:string,newUrl:string)
  {
    var objectId = id.split(' ');
    if(localStorage.getItem(objectId[0]))
    {
      var object = JSON.parse(localStorage.getItem(objectId[0]));
      if(objectId.length>1)
      {
        object[objectId[1]] = newUrl;
      }
      else
      {
        object = newUrl;
      }
      localStorage.setItem(objectId[0],JSON.stringify(object));
    }
  }

  getSlidesImage()
  {
    return JSON.parse(localStorage.getItem('slides'))
  }
  
  addNewSlide()
  {
    if(localStorage.getItem('slides'))
    {
      var object = JSON.parse(localStorage.getItem('slides'));
      console.log(object);
      object.push(environment.DEFAULT_IMAGE_URL);
      localStorage.setItem('slides',JSON.stringify(object));
    }
    else
    {
      object = [''+environment.DEFAULT_IMAGE_URL];
      localStorage.setItem('slides',JSON.stringify(object));
    }
  }

  removeSlide(slideIndex:Number)
  {
    if(localStorage.getItem('slides'))
    {
      var object = JSON.parse(localStorage.getItem('slides'));
      object.splice(slideIndex,1);
      localStorage.setItem('slides',JSON.stringify(object));
    }
  }
}
