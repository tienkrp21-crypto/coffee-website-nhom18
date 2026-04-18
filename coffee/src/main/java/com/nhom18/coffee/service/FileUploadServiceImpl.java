package com.nhom18.coffee.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private final Cloudinary cloudinary;

    public FileUploadServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        // Tạo một folder trên Cloudinary (vd: "doan_coffee") để dễ quản lý
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", "doan_coffee", 
                "public_id", UUID.randomUUID().toString() // random tên file để chống trùng
        );

        // Tiến hành upload
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(multipartFile.getBytes(), uploadParams);
        
        // Lấy đường link URL an toàn (https) trả về
        return uploadResult.get("secure_url").toString();
    }
}
