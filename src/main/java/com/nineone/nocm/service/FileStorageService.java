package com.nineone.nocm.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.nineone.nocm.domain.ContentsFile;
import com.nineone.nocm.domain.User;
import com.nineone.nocm.exception.FileStorageException;
import com.nineone.nocm.exception.UploadFileNotFoundException;
import com.nineone.nocm.repository.FileStorage;
import com.nineone.nocm.util.DateUtil;

@Service
public class FileStorageService {
	private final String USER_IMAGE_PATH = "C:/userImage/";
    private final Path fileStorageLocation;

    @Autowired
	private UserService userService;
    @Autowired
    private FileStorage fileStorage;

    @Autowired
    public FileStorageService() {
        this.fileStorageLocation = Paths.get("C:/Attach").toAbsolutePath().normalize();
        try{
            Files.createDirectories(this.fileStorageLocation);
        }catch (Exception ex){
        	throw new FileStorageException("could not create the directory",ex);
        }
    }
    
    public Path makeDateDirectories(String parentsDirName) {
    	String dirName = new SimpleDateFormat("yyyyMMdd").format(DateUtil.makeDate());
    	String srtPath = "C:/"+parentsDirName+dirName;
    	Path path = Paths.get(srtPath).toAbsolutePath().normalize();
    	try {
			Files.createDirectories(path);
			return path;
		} catch (Exception ex) {
			throw new FileStorageException("could not create the directory",ex);
		}
    }
    
    public void makeThumnail() {
    	
    }
    
    public Path checkExtension(ContentsFile contentsFile) {
    	Path path;
    	switch (contentsFile.getExtension()) {
		case "zip":
		case "7z" :
		case "tar":
			path = makeDateDirectories("zip");
			break;
		case "png":
		case "jpg":
		case "gif":
			path = makeDateDirectories("image");
			break;
		case "pdf":
			path = makeDateDirectories("pdf");
			break;
		case "txt":
			path = makeDateDirectories("txt");
			break;
		default:
			path = makeDateDirectories("else");
			break;
		}
    	return path;
    }
    
    public String storeFile(MultipartFile file, ContentsFile contentsFile){
        String fileName = StringUtils.cleanPath(contentsFile.getServer_name());
        
        //checkExtension(contentsFile);
        
        try{
            if (fileName.contains("..")){
                throw new FileStorageException("Sorry! Filename contains invalid path sequenced "+ fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            //System.out.println(targetLocation+"-----------------------");
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        }catch (IOException ex){
            throw new FileStorageException("Could not store file "+ fileName + ", please try again",ex);
        }
    }
    public String storeFile(MultipartFile file, User user){
		String fileName = StringUtils.cleanPath("u-"+getUUID());
		Path filePath = null;
		Path UserImageStorageLocation = null;
		try{
			if (fileName.contains("..")){
				throw new FileStorageException("Sorry! Filename contains invalid path sequenced "+ fileName);
			}
			UserImageStorageLocation = Paths.get(USER_IMAGE_PATH).toAbsolutePath().normalize();
			Files.createDirectories(UserImageStorageLocation);
			filePath = UserImageStorageLocation.resolve(fileName);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			deleteOldUserPicture(user.getPicture().replace("/api/file/download/",""));
			user.setPicture("/api/file/download/"+fileName);
			userService.userinfoUpdate(user);
			return fileName;
		}catch (IOException ex){
			throw new FileStorageException("Could not store file "+ fileName + ", please try again",ex);
		}
	}
    public Resource loadFileAsResource(String fileName){
        try{
        	Path filePath = null;
        	Path UserImageStorageLocation = null;
        	if(fileName.contains("u-")) {
        		UserImageStorageLocation = Paths.get(USER_IMAGE_PATH).toAbsolutePath().normalize();
        		filePath = UserImageStorageLocation.resolve(fileName).normalize();
        	}else {
        		filePath = this.fileStorageLocation.resolve(fileName).normalize();
        	}
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()){
                return  resource;
            }else{
                throw new UploadFileNotFoundException("File not found : "+fileName);
            }
        } catch (MalformedURLException ex) {
            throw new UploadFileNotFoundException("File not found : "+fileName, ex);
        }
    }
    public void DBStoreFile(ContentsFile file){
        fileStorage.saveFile(file);
    }
	public void deleteOldUserPicture(String fileName) throws RuntimeException{
		File file = new File(USER_IMAGE_PATH+fileName);
		if (file.exists()){
			file.delete();
		}
	}
    public String getUUID(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }

    public String download(String sourceUrl) {
		FileOutputStream fos = null;
		String targetFilename = "u-"+ getUUID();
		InputStream is = null;
		String path = "C:/userImage/"; //폴더 경로
		File Folder = new File(path);

		if (!Folder.exists()) {
			try{
			    Folder.mkdir(); //폴더 생성합니다.
			    System.out.println("폴더가 생성되었습니다.");
		        }
		        catch(Exception e){
			    e.getStackTrace();
			}
	    }
		try {
			fos = new FileOutputStream(path + targetFilename);

			URL url = new URL(sourceUrl);
			URLConnection urlConnection = url.openConnection();
			is = urlConnection.getInputStream();
			byte[] buffer = new byte[1024];
			int readBytes;
			while ((readBytes = is.read(buffer)) != -1) {
				fos.write(buffer, 0, readBytes);
			}
			return targetFilename;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				if (fos != null) {
					fos.close();
				}
				if (is != null) {
					is.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}