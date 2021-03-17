package com.school.managment.Backend.model.adminestration;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.school.managment.Backend.model.photoshow.Area;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(	name = "users", 
		uniqueConstraints = { 
			@UniqueConstraint(columnNames = "username"),
			@UniqueConstraint(columnNames = "email") 
		})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 20)
	private String username;

	@Size(max = 50)
	@Email
	private String email;

	@NotBlank
	@Size(max = 120)
	@JsonIgnore
	private String password;

	@ManyToMany
	@JoinTable( 
    name = "users_roles", 
    joinColumns = @JoinColumn(
      name = "user_id", referencedColumnName = "id"), 
    inverseJoinColumns = @JoinColumn(
      name = "role_id", referencedColumnName = "id")) 
	private Set<Role> roles = new HashSet<>();
	
	@ElementCollection(targetClass = Area.class)
	@Enumerated(EnumType.STRING)
	private Set<Area> areas;
	
	public User(String username, String email, String password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}

}