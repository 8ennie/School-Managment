package com.school.managment.Backend.payload.request;

import lombok.Data;

@Data
public class ImageShowPart{
	Long showPartId;
	
	boolean active;
	
	int position;
	
	Long imageShowShowPartId;
}