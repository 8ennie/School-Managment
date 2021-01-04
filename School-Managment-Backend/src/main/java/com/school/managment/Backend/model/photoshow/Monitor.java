package com.school.managment.Backend.model.photoshow;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.school.managment.Backend.model.adminestration.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Monitor {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;
	
	@Column
	private String name;
	
	@ManyToOne
	private ImageShow imageShow;
	
	@Column
	private boolean imageShowLocked = false;
	
	@Column
	private String location;
	
	@Column
	private String ipAddress;
	
	@Column
	private boolean status;
	
	@OneToOne
	private User user;
	
	@ElementCollection(targetClass = Area.class)
	@Enumerated(EnumType.STRING)
	private Set<Area> areas;
	
	public Monitor(String ipAdresse, String name, String location){
		this.ipAddress = ipAdresse;
		this.name = name;
		this.location = location;
	}
	
}
