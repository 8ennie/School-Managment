package com.school.managment.Backend.security.services;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.school.managment.Backend.model.adminestration.Privilege;
import com.school.managment.Backend.model.adminestration.Role;
import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.photoshow.Area;


public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private Long id;

	private String username;

	private String email;

	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;
	
	private Set<Area> areas;

	public UserDetailsImpl(Long id, String username, String email, String password,
			Collection<? extends GrantedAuthority> authorities, Set<Area> areas) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.authorities = authorities;
		this.areas = areas;
	}

	public static UserDetailsImpl build(User user) {
		List<GrantedAuthority> authorities = new ArrayList<>();
		for (Role role : user.getRoles()) {
			for (Privilege privilege : role.getPrivileges()) {
				authorities.add(new SimpleGrantedAuthority(privilege.getName().toString()));
			}
		}
		return new UserDetailsImpl(user.getId(), user.getUsername(), user.getEmail(), user.getPassword(),
			authorities, user.getAreas());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}
	
	public Set<Area> getAreas(){
		return areas;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}

}