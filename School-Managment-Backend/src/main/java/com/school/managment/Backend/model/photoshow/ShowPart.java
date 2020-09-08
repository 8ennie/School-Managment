package com.school.managment.Backend.model.photoshow;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowPart {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToMany(mappedBy = "showPart")
	Set<ImageShowShowPart> imageShows = new HashSet<ImageShowShowPart>();

	@Lob
	private byte[] image;

	@ManyToOne
	private Document parentDocument;

	public ImageShowShowPart addImageShow(ImageShow imageShow) {
		ImageShowShowPart imageShowShowPart = new ImageShowShowPart();
		imageShowShowPart.setImageShow(imageShow);
		imageShowShowPart.setShowPart(this);
		imageShows.add(imageShowShowPart);
		imageShow.getShowParts().add(imageShowShowPart);
		return imageShowShowPart;
	}


}
