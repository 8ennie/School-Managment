package com.school.managment.Backend.model.photoshow.help.projection;


import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.Area;


@Projection(name = "monitorProjection", types = { MonitorProjection.class })
public interface MonitorProjection {

	@Value("#{target.id}")
	Long getId();

	String getName();
	
	ImageShowProjection getImageShow();
	
	boolean getImageShowLocked();
	
	String getLocation();
	
	String getIpAddress();
	
	Set<Area> getAreas();
	
	boolean getActive();
	
}
