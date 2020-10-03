import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { ModifiedImage } from 'src/models/helpers/modifiedImage';
import { fileReturn, httpReturn } from 'src/models/httpReturn';
import { file } from 'src/models/schemas/file';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private imageURL = environment.API_URL+'/pictures/';

  constructor(private http:HttpClient) { }

  uploadImage(image:ModifiedImage):Observable<fileReturn>{
    switch(image.status)
    {
      case 'create':{
        const data = new FormData();
        data.append('image',image.content);
        return this.http.post<fileReturn>(this.imageURL+'upload?fileId='+image.id+'&status=create',data)
      }
      case 'update':{
        const data = new FormData();
        data.append('image',image.content);
        return this.http.post<fileReturn>(this.imageURL+'upload?fileId='+image.id+'&status=update',data)
      }
      case 'delete':{
        return this.http.delete<httpReturn>(this.imageURL+image.id).pipe(
          map(result=>{
            return {result:result,fileParam:null};
          })
        )
      }
    }
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
