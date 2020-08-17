package com.school.managment.Backend.model.photoshow.help.projection;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.ShowPart;

@Projection(name = "showPartProjection", types = { ShowPart.class })
public interface ShowPartProjection {

	@Value("#{target.id}")
	Long getId();

	ImageShowProjection getShow();
	
	byte[] getImage();

	String getOrigin();
	
}
