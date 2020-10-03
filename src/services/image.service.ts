import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  imageURL = environment.API_URL+'/pictures/';

  constructor(private http:HttpClient) { }

  saveImageToLocal(id:string,file:string)
  {
    
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
