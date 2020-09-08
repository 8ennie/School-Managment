package com.school.managment.Backend.model.photoshow.help.projection;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.ImageShowShowPart;

@Projection(name = "imageShowPartProjection", types = { ImageShowShowPart.class })
public interface ImageShowPartProjection {

	@Value("#{target.id}")
	Long getId();
	
	@Value("#{target.showPart.image}")
	byte[] getShowPartImage();
	
	int getPosition();
	
	@Value("#{target.showPart.id}")
	Long getShowPartId();
	
	boolean getActive();
}
