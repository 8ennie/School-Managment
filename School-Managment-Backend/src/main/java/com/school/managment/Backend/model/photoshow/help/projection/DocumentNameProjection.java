package com.school.managment.Backend.model.photoshow.help.projection;

import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.Document;

@Projection(name = "imageShowProjection", types = { Document.class })
public interface DocumentNameProjection {

	String getFileName();
}
