package com.uptime.common.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessRuleException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus httpStatus;

    public BusinessRuleException(String errorCode, String message) {
        this(errorCode, message, null);
    }

    public BusinessRuleException(String errorCode, String message, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
