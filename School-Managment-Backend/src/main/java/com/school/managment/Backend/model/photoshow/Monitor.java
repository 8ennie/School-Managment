package com.school.managment.Backend.model.photoshow;

import java.time.Instant;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.school.managment.Backend.model.adminestration.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners({AuditingEntityListener.class})
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
	private boolean active = true;
	
	@OneToOne
	private User user;
	
	@ElementCollection(targetClass = Area.class)
	@Enumerated(EnumType.STRING)
	private Set<Area> areas;
	
	@CreatedDate
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@NotNull
	private Instant creationDate;
	
	@LastModifiedDate
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@NotNull
	private Instant changeDate;
	
	@CreatedBy
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String createdBy;
	
	@LastModifiedBy
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String modifiedBy;
	
	public Monitor(String ipAdresse, String name, String location){
		this.ipAddress = ipAdresse;
		this.name = name;
		this.location = location;
	}
	
}
