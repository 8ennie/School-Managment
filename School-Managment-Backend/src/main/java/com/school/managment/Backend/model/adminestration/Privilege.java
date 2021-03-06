package com.school.managment.Backend.model.adminestration;

import java.util.Collection;

import javax.persistence.*;


import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Privilege {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
	@Enumerated(EnumType.STRING)
	@Column(length = 20)
    private EPrivilege name;
 
	@JsonBackReference(value="roles")
	@ManyToMany(mappedBy = "privileges")
    private Collection<Role> roles;
    
    
    public Privilege(EPrivilege name) {
		this.name = name;
	}
}
