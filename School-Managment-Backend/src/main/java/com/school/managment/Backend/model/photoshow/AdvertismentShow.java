package com.school.managment.Backend.model.photoshow;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvertismentShow extends ImageShow{

	@Temporal(TemporalType.DATE)
	private Date date;
	
	
}
