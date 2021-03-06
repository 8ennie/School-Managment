package com.school.managment.Backend.model.adminestration.help;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.adminestration.Role;
import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.photoshow.Area;

@Projection(name = "userProjection", types = { User.class })
public interface UserProjection {

	@Value("#{target.id}")
	Long getId();

	String getUsername();
	
	String getEmail();
	
	List<Role> getRoles();
	
	Set<Area> getAreas();

}
