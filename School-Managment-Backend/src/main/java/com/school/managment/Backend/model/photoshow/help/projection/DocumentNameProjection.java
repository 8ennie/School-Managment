package com.school.managment.Backend.model.photoshow.help.projection;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.Document;

@Projection(name = "documentProjection", types = { Document.class })
public interface DocumentNameProjection {

	@Value("#{target.id}")
	Long getId();
	
	String getFileName();
	
	Date getUploadDate();
	
	Area getArea();
}
