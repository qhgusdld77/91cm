package com.nineone.nocm.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ContentsFile {
    private int id;
    private String original_name;
    private String server_name;
    private String path;
    private String extension;
    private Date datetime;
    private int message_id;
    private String sender;
    private int file_size;
    private String uri;
    
    @Builder
    public ContentsFile(int id, String original_name, String server_name, String path,
    		String extension, Date datetime, int message_id, String sender, int file_size,String uri) {
        this.id = id;
        this.original_name = original_name;
        this.server_name = server_name;
        this.path = path;
        this.extension = extension;
        this.datetime = datetime;
        this.message_id = message_id;
        this.sender = sender;
        this.file_size = file_size;
        this.uri = uri;
    }

    public static ContentsFile getDefaultInstance(MultipartFile file) {
        String fileName = UUID.randomUUID().toString().replaceAll("-","");
        String fileSize = String.valueOf(file.getSize());
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        fileExtension = fileExtension.equals("jpg") ? "JPEG" : fileExtension; 
        return ContentsFile.builder()
                .original_name(file.getOriginalFilename())
                .server_name(fileName)
                .extension(fileExtension)
                .path("/api/file/download/"+fileName)
                // file.getSize는 Long 타입이라서 추후에 문제가 될 수 있음
                // 나중에 Table 변경 혹은 long 타입을 핸들링할 로직 필요
                .file_size(Integer.valueOf(fileSize))
                .build();
    }


}
