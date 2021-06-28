package com.school.managment.Backend.model.photoshow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message implements Serializable {

	private String message;
	
	private String category;
	
	private Long monitorId;
	
	private Area area;
	
	private boolean overwirite;
	
}
