package com.school.managment.Backend.payload.request;

import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;

import com.school.managment.Backend.model.photoshow.help.ShowType;

import lombok.Data;

@Data
public class ImageShowRequest {
	@NotBlank
	private String name;
	@NotBlank
	private ShowType showType;
	@NotBlank
	MultipartFile file;

}
