package com.nineone.nocm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(HttpStatus.NOT_FOUND)
public class UploadFileNotFoundException extends RuntimeException{
    public UploadFileNotFoundException(String message){
        super(message);
    }
    public UploadFileNotFoundException(String message, Throwable cause){
        super(message, cause);
    }
}
