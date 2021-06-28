package com.school.managment.Backend.model.photoshow;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.hateoas.RepresentationModel;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE image_show SET deleted=true WHERE id=?")
@Where(clause = "deleted = false")
@EntityListeners(AuditingEntityListener.class)
public class ImageShow extends RepresentationModel<ImageShow> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Enumerated(EnumType.STRING)
	private Area area;

	@JsonBackReference(value = "showParts")
	@OneToMany(mappedBy = "imageShow")
	Set<ImageShowShowPart> showParts = new HashSet<ImageShowShowPart>();

	@Temporal(TemporalType.DATE)
	private Date date;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Date createdAt;

	private Boolean deleted = false;

	private Boolean individualDisplayTimes;

	private Boolean showClock;

}
