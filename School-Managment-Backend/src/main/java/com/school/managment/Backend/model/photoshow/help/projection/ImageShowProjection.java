package com.school.managment.Backend.model.photoshow.help.projection;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.help.ShowType;

@Projection(name = "imageShowProjection", types = { ImageShow.class })
public interface ImageShowProjection {

	@Value("#{target.id}")
	Long getId();

	String getName();

	ShowType getShowType();

	DocumentNameProjection getDocument();

}
