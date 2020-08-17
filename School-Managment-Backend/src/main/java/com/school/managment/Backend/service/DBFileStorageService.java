package com.school.managment.Backend.service;
import com.school.managment.Backend.exception.FileStorageException;
import com.school.managment.Backend.exception.MyFileNotFoundException;
import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.repository.DocumentRepository;
import com.school.managment.Backend.repository.ImageShowRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class DBFileStorageService {

    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private ImageShowRepository showRepository;
    
    
    @Autowired
    private PDFConverterService converterService;

    public ImageShow storeFile(MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        ImageShow show = new ImageShow();
        try {
            // Check if the file's name contains invalid characters
            if(fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Document doc = new Document(fileName, file.getContentType(), file.getBytes());
            doc = documentRepository.save(doc);
            show.setDocument(doc);
            show.setShowParts(converterService.convertPDFToPng(doc));
            return show;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Document getFile(Long fileId) {
        return documentRepository.findById(fileId)
                .orElseThrow(() -> new MyFileNotFoundException("File not found with id " + fileId));
    }
}