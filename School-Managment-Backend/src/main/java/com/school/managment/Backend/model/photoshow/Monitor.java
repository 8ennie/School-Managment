package com.school.managment.Backend.model.photoshow;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.photoshow.help.ShowType;

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
	private String location;
	
	@Column
	private String ipAddress;
	
	@Column
	private boolean status;
	
	@Column
	private ShowType showType;
	
	@OneToOne
	private User user;
	
}
