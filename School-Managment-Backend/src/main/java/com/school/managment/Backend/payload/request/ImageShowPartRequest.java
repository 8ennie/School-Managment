package com.school.managment.Backend.payload.request;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageShowPartRequest {
	
	private boolean update;

	private List<ImageShowPart> imageShowParts;
	
	private Long imageShowId;
	
}

