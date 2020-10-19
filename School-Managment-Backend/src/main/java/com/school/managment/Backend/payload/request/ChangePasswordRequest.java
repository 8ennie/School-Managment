package com.school.managment.Backend.payload.request;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ChangePasswordRequest {
	@NotBlank
	private String username;

	@NotBlank
	private String oldPassword;
	
	@NotBlank
	private String newPassword;

	
}