/**
* @file  FileUpLoader
* @date 2025-05-18
*/


import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import Image from 'next/image'
import { cn,  getFileType  } from "@/lib/utils";
import { useState } from 'react';

const FileUpLoader = () =>  {
const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload</p>
      </Button>
      {
        files.length>0&&(
            <ul className='uploader-previre-list'>
                <h4 className='h4 text-light-100'>Uploading</h4>
                {files.map((file,index)=>{
                    const {type,extension}=getFileType(file.name);
                    return(
                        <li key={`${file.name}-${index}`} className='uploader-preview-tem'></li>
                    )
                })}

            </ul>
        )
      }
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
export default FileUpLoader;
