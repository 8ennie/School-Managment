package com.school.managment.Backend.model.adminestration;

import java.util.Collection;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Role {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true)
	private String name;

	@JsonBackReference(value="privileges")
	@ManyToMany
    @JoinTable(
            name = "roles_privileges", 
            joinColumns = @JoinColumn(
              name = "role_id", referencedColumnName = "id"), 
            inverseJoinColumns = @JoinColumn(
              name = "privilege_id", referencedColumnName = "id"))
	private Collection<Privilege> privileges;

}