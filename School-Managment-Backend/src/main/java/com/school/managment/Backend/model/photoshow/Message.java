package com.school.managment.Backend.model.photoshow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {

	private String message;
	
	private String category;
	
	private Long monitorId;
	
	private String area;
	
	private boolean overwirite;
	
}
