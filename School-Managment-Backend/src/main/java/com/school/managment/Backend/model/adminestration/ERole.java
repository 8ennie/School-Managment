package com.school.managment.Backend.model.adminestration;

import java.util.List;
import java.util.Arrays;

public enum ERole {
    ROLE_ADMIN(Arrays.asList(EPrivilege.values())),
    ROLE_USER(Arrays.asList(EPrivilege.READ_IMAGE_SHOW)),
    ROLE_MONITOR(Arrays.asList(EPrivilege.READ_IMAGE_SHOW));
    
	public List<EPrivilege> privileges;
    
    private ERole(List<EPrivilege> privileges) {
		this.privileges = privileges;
	}
    
}