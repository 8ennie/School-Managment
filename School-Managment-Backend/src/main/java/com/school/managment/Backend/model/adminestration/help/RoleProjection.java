package com.school.managment.Backend.model.adminestration.help;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.school.managment.Backend.model.adminestration.Privilege;
import com.school.managment.Backend.model.adminestration.Role;

@Projection(name = "roleProjection", types = { Role.class })
public interface RoleProjection {

	@Value("#{target.id}")
	Long getId();
	
	String getName();
	
	List<Privilege> getPrivileges();
}
