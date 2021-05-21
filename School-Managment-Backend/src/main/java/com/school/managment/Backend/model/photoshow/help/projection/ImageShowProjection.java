package com.school.managment.Backend.model.photoshow.help.projection;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.ImageShow;

@Projection(name = "imageShowProjection", types = { ImageShow.class })
public interface ImageShowProjection {

	@Value("#{target.id}")
	Long getId();

	String getName();

	Area getArea();

	Date getDate();
	
	Date getCreatedAt();

	@Value("#{target.getShowParts().size()}")
	int getImageCount();

}
