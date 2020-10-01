package com.school.managment.Backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.school.managment.Backend.repository.ImageShowRepository;
import com.school.managment.Backend.repository.MonitorRepository;

@Service
public class ImageShowService {

	@Autowired
	private ImageShowRepository imageShowRepository;

	@Autowired
	private MonitorRepository monitorRepository;

	public boolean deleteImageShow(Long imageShowid) {
		monitorRepository.findByImageShowId(imageShowid);
		if (monitorRepository.findByImageShowId(imageShowid).size() > 0) {
			return false;
		} else {
			imageShowRepository.deleteById(imageShowid);
			return true;
		}
	}

}
