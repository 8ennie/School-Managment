package com.school.managment.Backend.model.photoshow.help.projection;


import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.model.photoshow.help.ShowType;

@Projection(name = "substitutionShowProjection", types = { SubstitutionShow.class })
public interface SubstitutionShowProjection {

	@Value("#{target.id}")
	Long getId();

	String getName();

	ShowType getShowType();
	
	Date getDate();

	DocumentNameProjection getDocument();

}
