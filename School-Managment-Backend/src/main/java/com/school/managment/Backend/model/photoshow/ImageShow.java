package com.school.managment.Backend.model.photoshow;


import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.school.managment.Backend.model.photoshow.help.ShowType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageShow {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@OneToOne
	private Document document;
	
	@Enumerated(EnumType.STRING)
	private ShowType showType;
	
	@JsonBackReference(value="showParts")
	@OneToMany(mappedBy = "show")
	private List<ShowPart> showParts;
	
	@Temporal(TemporalType.DATE)
	private Date date;
	
	
}
