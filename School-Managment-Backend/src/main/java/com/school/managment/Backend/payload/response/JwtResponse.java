package com.school.managment.Backend.payload.response;
import java.util.List;
import java.util.Set;

import com.school.managment.Backend.model.photoshow.Area;

import lombok.Data;

@Data
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String username;
	private String email;
	private List<String> roles;
	private Set<Area> areas;

	public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles, Set<Area> areas) {
		this.token = accessToken;
		this.id = id;
		this.username = username;
		this.email = email;
		this.roles = roles;
		this.areas = areas;
	}

	
}