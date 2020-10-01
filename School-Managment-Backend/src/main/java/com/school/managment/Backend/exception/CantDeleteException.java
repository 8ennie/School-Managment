package com.school.managment.Backend.exception;


public class CantDeleteException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 6845521383867354515L;

	public CantDeleteException(String message) {
        super(message);
    }

    public CantDeleteException(String message, Throwable cause) {
        super(message, cause);
    }
}