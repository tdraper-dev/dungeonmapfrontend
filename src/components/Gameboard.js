import React, { useState, useRef } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'

function MapImageView() {

  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        <img className="mapImage img-fluid" alt='' src="https://d20.pub/assets/uploads/2018/03/Simple-battlemap-for-Hoard-of-the-Dragon-Queen-Dungeons-and-Dragons-Adventure-Module-Part-1-Keep-in-Greenest-on-Fire.jpg" />
      </div>

    </div> 
  )
}

function MapTray() {

  return (
    <div className="mapTrayContainer col-12   d-flex">
      <MapImageView />
    </div>
  )
}




function Gameboard() {
  const [image64, setImage64] = useState('')

  return (
    <div className="gameBoardPage row">
      <img src={image64} />
      <MapTray />
    
      <FileBase64 className=""
      multiple={false}
      onDone={({ base64 }) => setImage64(base64)} />
    </div>
  )
}


function FileBase64(props) {

  function base64ToBlob(base64, mime) {
    mime = mime || '';
    let sliceSize = 1024;
    let byteChars = window.atob(base64);
    let byteArrays = [];

    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      let slice = byteChars.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime} );
  }

  const handleChange = (e) => {
    e.preventDefault()
    console.log('yo')
    let file = fileRef.current.files[0]

    const formData = new FormData();
    formData.append('myImage', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post('/api/images', formData, config)
      .then((response) => {
      let reader = new FileReader()
      console.log(response.data)
      reader.onload = () => {
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64: reader.result,
          file: file
        };
      }
      })
      .catch((error) => {
        console.log('error, ', error)
      })
 
    /*if(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64: reader.result,
          file: file
        };
        const imageBlob = base64ToBlob((reader.result.replace(/^data:image\/(png|jpeg);base64,/, "")), fileInfo.type)

        props.onDone(fileInfo);
      } //end of initial onload
    }

    const formData  = new FormData();
    formData.append('file', file)
    formData.append('title', 'Porco Rosoo')
    formData.append('imageType', 'image/jpeg')
    const config = {
      header: {
        'Content-Type': 'multipart/form-data'
      }
    }
    axios.post('/api/images', formData, config)*/
  }

  const fileRef = useRef()
  return (
 
    <form id="uploadForm" encType='multipart/form-data' onSubmit={handleChange}>

      <label htmlFor="fileUpload" className='d-flex fileUpload' >Upload Something!</label>

      <input ref={fileRef} type="file" id="file" name="file" />

      <input type='submit' value='Upload' />

    </form>


  )

}

FileBase64.defaultProps = {
  multiple: false,
};

/*
const dreamer = new FileReader();
        dreamer.readAsDataURL(imageBlob);
        dreamer.onload = () => {
          const convertedBlob64 = dreamer.result
          console.log('convertedBlob64', convertedBlob64)
          console.log('fileInfo.base64', fileInfo.base64 )
          console.log('DOES FIRST EQUAL LAST?', convertedBlob64 === fileInfo.base64)
*/

/*
THE ORIGINAL FILE UPLOAD IS A BLOB -- SO IT'S POSSIBLE YOU DO NOT NEED TO TRANSLATE IT INTO BASE64 THEN INTO A BLOB BEFORE RUNNING IT INTO THE DATABASE


      const urlCreator = window.URL || window.webkitURL;
      let imageUrl = urlCreator.createObjectURL(file)
      props.onDone({file: imageUrl})
TRY:


IMAGE SELECT -->
-->BLOB TO DB 
-->BASE64 TO SCREEN */
export default Gameboard

