package com.school.managment.Backend.model.photoshow;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageShowShowPart {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne()
	@JoinColumn(name = "image_show_id")
	private ImageShow imageShow;

	@ManyToOne()
	@JoinColumn(name = "show_part_id")
	private ShowPart showPart;
	
	@Column
	private int position;
	
	@Column
	private boolean active = true;
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
		
}
