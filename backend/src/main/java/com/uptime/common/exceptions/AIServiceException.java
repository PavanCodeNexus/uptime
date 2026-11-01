package com.uptime.common.exceptions;

import lombok.Getter;

@Getter
public class AIServiceException extends RuntimeException {
    private final String errorCode;

    public AIServiceException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
